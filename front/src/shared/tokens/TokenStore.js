class TokenStore {
    constructor() {
        this.REFRESH_KEY = "refresh_key"
        this.token = null
    }

    // Access token handling (in-memory)
    getAccess = () => {
        return this.token
    }

    setAccess = (newAccess) => {
        this.token = newAccess
    }

    deleteAccess = () => {
        this.token = null
    }

    // Refresh token handling (localStorage)
    getRefresh = () => {
        try {
            return localStorage.getItem(this.REFRESH_KEY)
        } catch (e) {
            console.error("Error reading refresh token", e)
            return null
        }
    }

    setRefresh = (refresh) => {
        try {
            localStorage.setItem(this.REFRESH_KEY, refresh)
        } catch (e) {
            console.error("Error saving refresh token", e)
        }
    }

    deleteRefresh = () => {
        try {
            localStorage.removeItem(this.REFRESH_KEY)
        } catch (e) {
            console.error("Error deleting refresh token", e)
        }
    }

    clearTokens = () => {
        this.deleteAccess()
        this.deleteRefresh()
    }
}

export const tokenStore = new TokenStore()
