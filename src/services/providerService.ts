import type {Provider} from "react";
import authenticationService from "@src/services/authentication.ts";
import type {TestConnectionPayload, TestConnectionResponse} from "@src/types/providerModel.ts";
import {useMutation, useQuery} from "@tanstack/react-query";

const providerApi = {
    getAll: async (): Promise<Provider[]> => {
        const { data } = await authenticationService.get('/providers/');
        return data;
    },

    getByCode: async (code: string): Promise<Provider> => {
        const { data } = await authenticationService.get(`/providers/${code}/`);
        return data;
    },

    testConnection: async (payload: TestConnectionPayload): Promise<TestConnectionResponse> => {
        const { data } = await authenticationService.post('/providers/test-connection/', payload);
        return data;
    },
};

export const providerKeys = {
    all: ['providers'] as const,
    lists: () => [...providerKeys.all, 'list'] as const,
    detail: (code: string) => [...providerKeys.all, 'detail', code] as const,
};

export function useProviders() {
    return useQuery({
        queryKey: providerKeys.lists(),
        queryFn: providerApi.getAll,
        staleTime: 5 * 60 * 1000, // Providers don't change often
    });
}

export function useProvider(code: string) {
    return useQuery({
        queryKey: providerKeys.detail(code),
        queryFn: () => providerApi.getByCode(code),
        enabled: !!code,
    });
}

export function useTestConnection() {
    return useMutation({
        mutationFn: providerApi.testConnection,
    });
}