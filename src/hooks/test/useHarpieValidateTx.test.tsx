import { expect, it, describe } from "vitest";
import { renderHook, waitFor } from '@testing-library/react'
import { useHarpieValidateTx } from "../useHarpieValidateTx";
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'

import React from 'react';

interface WrapperProps {
    children: React.ReactNode;
}

const queryClient = new QueryClient()
const wrapper = ({ children }: WrapperProps) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('txTest', () => {
    it('should test harpie api for bad addresses', async () => {

        const apiKey = import.meta.env.VITE_HARPIE_KEY;

        const { result } = renderHook(() => useHarpieValidateTx(
            apiKey,
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // usdc
            0,
            '0x2249950E7bc93042196d37dF430651052dDf3b1E', // Random USDC-holding address
            '0xa9059cbb0000000000000000000000005bac20beef31d0eccb369a33514831ed8e9cdfe00000000000000000000000000000000000000000000000000000000008f0d180'
        ), { wrapper })

        await waitFor(() => {
            expect(result.current).toEqual([{ title: 'Star Wars' }]);{ wrapper };
        });
    });
});