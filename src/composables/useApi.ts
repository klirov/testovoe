import { ref } from 'vue'

export function useApi() {
    const data = ref()
    const isLoading = ref(false)
    const isSuccess = ref(false)
    const isError = ref(false)
    const error = ref<unknown>(null)
    const status = ref<number | null>(null)

    async function request<T>(url: string, init?: RequestInit): Promise<T> {
        isLoading.value = true
        isSuccess.value = false
        isError.value = false
        error.value = null

        try {
            const response = await fetch(url, init)

            status.value = response.status

            if (!response.ok) {
                throw new Error(`HTTP ОШИБКА: ${response.status}`)
            }

            const result = (await response.json()) as T
            data.value = result
            isSuccess.value = true

            return result
        } catch (e) {
            error.value = e
            isError.value = true
            throw e
        } finally {
            isLoading.value = false
        }
    }

    return {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        status,
        request,
    }
}
