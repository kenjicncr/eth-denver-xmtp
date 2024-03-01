import { useQuery } from '@tanstack/react-query';

const fetchHarpieValidation = async (
    apiKey: string,
    from: `0x${string}`,
    to: `0x${string}`,
    value: number,
    data: `0x${string}`
) => {
    // Construct the URL with your parameters
    try {
        const response = await fetch("https://api.harpie.io/v2/validateTransaction", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                to: to,
                value: value,
                from: from,
                data: data
            })
        })
        return response.json();
    } catch (e) {
        console.error(e)
        return undefined
    }

};

export function useHarpieValidateTx(
    apiKey: string,
    from: `0x${string}`,
    to: `0x${string}`,
    value: number = 0,
    data: `0x${string}`,
) {
    const { data: apiResponse, error, isError, isLoading, isSuccess } = useQuery(
        ['harpieValidateTx', { apiKey, from, to, value, data }],
        () => fetchHarpieValidation(apiKey, from, to, value, data ),
        {
            // Options like staleTime, cacheTime, refetchOnWindowFocus can be configured here
            enabled: !!apiKey && !!from && !!to && !!data, // Ensure all required params are not empty
        }
    );

    return { apiResponse, error, isError, isLoading, isSuccess };
}
