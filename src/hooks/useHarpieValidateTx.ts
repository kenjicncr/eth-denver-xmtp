import { useQuery } from '@tanstack/react-query';

const fetchHarpieValidation = async (
    apiKey: string,
    to: `0x${string}`,
    value: number,
    from: `0x${string}`,
    data: `0x${string}`
) => {
    try {
        const response = await fetch("https://api.harpie.io/v2/validateTransaction", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                from: from,
                to: to,
                value: value,
                data: data
            })
        })
        return response.json();
    } catch (e) {
        console.error(e)
        Promise.reject(e)
    }
};

export function useHarpieValidateTx(
    apiKey: string,
    to: `0x${string}`,
    value: number = 0,
    from: `0x${string}`,
    data: `0x${string}`,
) {
    const { data: apiResponse, error, isError, isLoading, isSuccess } = useQuery(
        ['harpieValidateTx', { apiKey, from, to, value, data }],
        () => fetchHarpieValidation(apiKey, to, value, from, data),
        {
            // Options like staleTime, cacheTime, refetchOnWivaluendowFocus can be configured here
            enabled: !!apiKey && !!from && !!to && !!data, // Ensure all required params are not empty
            refetchOnMount: false,
            staleTime: Infinity, // Set staletime to infinity to prevent refetches forever
        }
    );

    return { apiResponse, error, isError, isLoading, isSuccess };
}
