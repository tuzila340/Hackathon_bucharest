import { tokenStore } from "../tokens/tokenStore"

class HttpClient {
    constructor() {
        this.baseURL = "http://127.0.0.1:8000/api/"
        this.isRefreshing = false
        this.pendingRequests = []
    }

    // =========================
    // PUBLIC API
    // =========================
    get(endpoint) {
        return this.requestWithAuth(endpoint, { method: "GET" })
    }

    post(endpoint, body) {
        return this.requestWithAuth(endpoint, { method: "POST", body })
    }

    patch(endpoint, body) {
        return this.requestWithAuth(endpoint, { method: "PATCH", body })
    }

    delete(endpoint) {
        return this.requestWithAuth(endpoint, { method: "DELETE" })
    }

    publicRequest(endpoint, options = {}) {
        return this.request(endpoint, options)
    }

    // =========================
    // CORE
    // =========================
    async requestWithAuth(endpoint, options = {}) {
        const accessToken = tokenStore.getAccess()

        const response = await this.requestRaw(endpoint, {
            ...options,
            headers: {
                ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
                ...(options.headers || {}),
            },
        })

        if (response.ok) {
            return this.parseResponse(response)
        }

        if (response.status !== 401 && response.status !== 403) {
            throw await this.buildError(response)
        }

        // =========================
        // REFRESH FLOW
        // =========================

        if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
                this.pendingRequests.push({
                    execute: () => this.requestWithAuth(endpoint, options),
                    resolve,
                    reject,
                })
            })
        }

        this.isRefreshing = true

        try {
            await this.refreshAccess()

            const data = await this.requestWithAuth(endpoint, options)

            const queue = this.pendingRequests
            this.pendingRequests = []

            queue.forEach((req) => {
                req.execute().then(req.resolve).catch(req.reject)
            })

            return data
        } catch (error) {
            const queue = this.pendingRequests
            this.pendingRequests = []

            queue.forEach((req) => req.reject(error))
            throw error
        } finally {
            this.isRefreshing = false
        }
    }

    async request(endpoint, options = {}) {
        const response = await this.requestRaw(endpoint, options)

        if (!response.ok) {
            throw await this.buildError(response)
        }

        return this.parseResponse(response)
    }

    async requestRaw(endpoint, options = {}) {
        const url = this.baseURL + endpoint

        return fetch(url, {
            method: options.method || "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(options.headers || {}),
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        })
    }

    // =========================
    // REFRESH
    // =========================
    async refreshAccess() {
        const refreshToken = tokenStore.getRefresh()

        if (!refreshToken) {
            throw new Error("NO_REFRESH_TOKEN")
        }

        const response = await this.requestRaw("user/refresh/", {
            method: "POST",
            body: { refresh: refreshToken },
        })

        if (!response.ok) {
            throw await this.buildError(response)
        }

        const data = await this.parseResponse(response)

        tokenStore.setAccess(data.access)
    }

    async tryRefresh() {
        try {
            await this.refreshAccess()
            return true
        } catch {
            return false
        }
    }

    clearQueue() {
        const queue = this.pendingRequests
        this.pendingRequests = []

        queue.forEach((req) => {
            req.reject(new Error("LOGOUT"))
        })
    }

    // =========================
    // HELPERS
    // =========================
    async parseResponse(response) {
        if (response.status === 204) {
            return undefined
        }

        const contentType = response.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            return response.json()
        }

        return response.text()
    }

    async buildError(response) {
        const rawText = await response.text()

        if (rawText.startsWith("<!DOCTYPE html") || rawText.startsWith("<html")) {
            return new Error("Endpoint not found")
        }

        try {
            const json = JSON.parse(rawText)
            return new Error(json.detail || JSON.stringify(json))
        } catch {
            return new Error(rawText || `HTTP ${response.status}`)
        }
    }
}

export const httpClient = new HttpClient()
