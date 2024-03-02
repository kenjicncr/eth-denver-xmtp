import { expect, it, describe } from "vitest";
import { renderHook, waitFor } from '@testing-library/react'
import { useHarpieValidateTx } from "../useHarpieValidateTx";
import {
    QueryClient,
    QueryClientProvider
} from '@tanstack/react-query'

import React from 'react';
import { useHarpieValidateAddress } from "../useHarpieValidateAddress";

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

        const { result } = renderHook(() => useHarpieValidateAddress(
            apiKey,
            '0x55456cbd1f11298b80a53c896f4b1dc9bc16c731',
        ), { wrapper })

        await waitFor(() => {
            expect(result.current).toEqual([{ title: 'Star Wars' }]);{ wrapper };
        });
    });
});