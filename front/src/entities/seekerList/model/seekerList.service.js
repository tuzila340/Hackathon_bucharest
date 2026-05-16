import { seekerListApi } from "../api/api"

export const seekerListService = {
    get: async () => {
        return seekerListApi.get()
    },
}
