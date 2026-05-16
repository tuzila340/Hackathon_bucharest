import { tokenStore } from "@/utils/TokenStore"

class HttpClient {
    baseURL = "https://backend-production-5f49d.up.railway.app/api/"
    // private baseURL = "http://10.0.2.2:8000/api/" // localhost

    isRefreshing = false
    pendingRequests = []

    // =========================
    // PUBLIC API
    // =========================
    get(endpoint) {
        return this.requestWithAuth < T > (endpoint, { method: "GET" })
    }

    post(endpoint, body) {
        return this.requestWithAuth < T > (endpoint, { method: "POST", body })
    }

    patch(endpoint, body) {
        return this.requestWithAuth < T > (endpoint, { method: "PATCH", body })
    }

    delete(endpoint) {
        return this.requestWithAuth < T > (endpoint, { method: "DELETE" })
    }

    publicRequest(endpoint, options) {
        return this.request < T > (endpoint, options)
    }

    // =========================
    // CORE
    // =========================
    async requestWithAuth(endpoint, options) {
        const accessToken = tokenStore.getAccess()

        const response = await this.requestRaw(endpoint, {
            ...options,
            headers: {
                ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
                ...options.headers,
            },
        })

        if (response.ok) {
            return this.parseResponse < T > response
        }

        if (response.status !== 401 && response.status !== 403) {
            throw await this.buildError(response)
        }

        // ===== REFRESH FLOW =====
        if (this.isRefreshing) {
            return (
                new Promise() <
                T >
                ((resolve, reject) => {
                    this.pendingRequests.push({
                        execute: () => this.requestWithAuth < T > (endpoint, options),
                        resolve,
                        reject,
                    })
                })
            )
        }

        this.isRefreshing = true

        try {
            await this.refreshAccess()

            const data = await this.requestWithAuth(endpoint, options)

            const queue = this.pendingRequests
            this.pendingRequests = []

            queue.forEach((req) => req.execute().then(req.resolve).catch(req.reject))

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

    async request(endpoint, options) {
        const response = await this.requestRaw(endpoint, options)

        if (!response.ok) {
            throw await this.buildError(response)
        }

        return this.parseResponse < T > response
    }

    async requestRaw(endpoint, options) {
        const url = this.baseURL + endpoint

        return fetch(url, {
            method: options.method ?? "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...options.headers,
            },
            body: options.body ? JSON.stringify(options.body) : undefined,
        })
    }

    // =========================
    // REFRESH
    // =========================
    async refreshAccess() {
        const refreshToken = await tokenStore.getRefresh()

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

        queue.forEach((req) => req.reject(new Error("LOGOUT")))
    }

    // =========================
    // HELPERS
    // =========================
    async parseResponse(response) {
        if (response.status === 204) {
            return undefined
        }

        const contentType = response.headers.get("content-type")

        if (contentType?.includes("application/json")) {
            return await response.json()
        }

        const text = await response.text()
        return text
    }

    async buildError(response) {
        const rawText = await response.text()

        let message = `HTTP ${response.status}`

        if (rawText.startsWith("<!DOCTYPE html") || rawText.startsWith("<html")) {
            return new Error("Endpoint not found")
        }

        try {
            const json = JSON.parse(rawText)
            message = json.detail ?? JSON.stringify(json)
        } catch {
            if (rawText) message = rawText
        }

        return new Error(message)
    }
}

export const httpClient = new HttpClient()
