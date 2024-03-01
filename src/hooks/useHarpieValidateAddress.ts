import { useQuery } from '@tanstack/react-query';

const fetchHarpieValidation = async (
    apiKey: string,
    address: `0x${string}` | undefined
) => {
    console.log(`FETCHING: ${address}`)
    try {
        const response = await fetch("https://api.harpie.io/v2/validateAddress", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                apiKey: apiKey,
                address: address
            })
        })
        return response.json();
    } catch (e) {
        console.error(e)
        Promise.reject(e)
    }
};

export function useHarpieValidateAddress(
    apiKey: string,
    address: `0x${string}` | undefined
) {
    console.log(address);
    const { data: apiResponse, error, isError, isLoading, isSuccess } = useQuery(
        ['harpieValidateAddress', { apiKey, address }],
        () => fetchHarpieValidation(apiKey, address),
        {
            // Options like staleTime, cacheTime, refetchOnWindowFocus can be configured here
            enabled: !!apiKey && !!address, // Ensure all required params are not empty
            refetchOnMount: false,
            staleTime: Infinity, // Set staletime to infinity to prevent refetches forever
        }
    );

    console.log(apiResponse);

    const { isMaliciousAddress } = apiResponse ?? false;

    return { isMaliciousAddress };
}
