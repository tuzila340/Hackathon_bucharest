import { httpClient } from "@/shared/http/HttpClient"

export const seekerListApi = {
    get: () => {
        return httpClient.get("profile/")
    },
}
