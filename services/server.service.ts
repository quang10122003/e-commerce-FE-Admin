import { getApiErrorMessage } from "@/lib/axios/error";

export async function safeFetch<T>(
    funtion: () => Promise<T>,
    errorMessage: string,
) {
    try {
        const data = await funtion();
        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: getApiErrorMessage(error, errorMessage),
        };
    }
}