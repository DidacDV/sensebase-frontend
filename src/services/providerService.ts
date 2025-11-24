
import authenticationService from "@src/services/authentication.ts";
import type { Provider } from "@src/types/providerModel";
import {useQuery} from "@tanstack/react-query";

const providerApi = {
    getAll: async (): Promise<Provider[]> => {
        const { data } = await authenticationService.get('/providers/');
        return data;
    },

    getByCode: async (code: string): Promise<Provider> => {
        const { data } = await authenticationService.get(`/providers/${code}/`);
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
