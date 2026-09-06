import { useAuth } from "../context/useAuth";


export const useApi = () => {
    const {
        accessToken,
        refreshAccessToken,
        clearAuthState
    } = useAuth();

    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {

        const response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                Authorization: `Bearer ${accessToken} `,
            },
            credentials: "include",
        });

        if (response.status === 401) {
            try {
                await refreshAccessToken();

                //* after refresh , use the latest token.
                const retryResponse = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                         Authorization: `Bearer ${accessToken} `,
                    },
                    credentials: "include",

                })
                return retryResponse;
            } catch {
                clearAuthState();
                throw new Error("Session expired");
                
            }
        }
        return response;
    }
    return {
        fetchWithAuth
    };
}