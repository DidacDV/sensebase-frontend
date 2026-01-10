import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import authenticationService from "@src/services/authentication.ts";
import type {CreateTariffBlueprintPayload, TariffBlueprint} from "@src/types/tariffModel.ts";

const tariffBlueprintApi = {
    getByBoard: async (boardId: string): Promise<TariffBlueprint[]> => {
        const { data } = await authenticationService.get(`/boards/${boardId}/tariff-blueprints/`);
        return data;
    },
    extractFromPDF: async (file: File): Promise<Partial<TariffBlueprint>> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await authenticationService.post('/tariffs/blueprints/extract-from-pdf/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },
    create: async (data: CreateTariffBlueprintPayload): Promise<TariffBlueprint> => {
        const payloadToSend = {
            ...data,
            board_id: Number(data.board_id),
        };

        const { data: responseData } = await authenticationService.post(
            '/tariffs/blueprints/',
            payloadToSend
        );
        return responseData;
    },
    optimize: async (payload: {
        tariffId: string;
        consumption: any;
        recommendations: Array<{ type: string; parameters: any }>
    }) => {
        const { data } = await authenticationService.post(
            '/tariffs/optimize/',
            payload
        );
        return data;
    },
};

export const tariffBlueprintKeys = {
    all: ['tariff-blueprints'] as const,
    byBoard: (boardId: string) => [...tariffBlueprintKeys.all, 'board', boardId] as const,
};

export function useBoardTariffBlueprints(boardId: string) {
    return useQuery<TariffBlueprint[]>({
        queryKey: tariffBlueprintKeys.byBoard(boardId),
        queryFn: () => tariffBlueprintApi.getByBoard(boardId),
        enabled: !!boardId,
    });
}

export function useExtractTariffFromPDF() {
    return useMutation({
        mutationFn: (file: File) => tariffBlueprintApi.extractFromPDF(file),
    });
}

export function useCreateTariffBlueprint() {
    const queryClient = useQueryClient();

    return useMutation<TariffBlueprint, Error, CreateTariffBlueprintPayload>({
        mutationFn: (data) => tariffBlueprintApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: tariffBlueprintKeys.all });
        },
    });
}

export function useOptimizeTariff(options?: any) {
    return useMutation({
        mutationFn: (payload: {
            tariffId: string;
            consumption: any;
            recommendations: Array<{ type: string; parameters: any }>
        }) => tariffBlueprintApi.optimize(payload),
        onSuccess: (data, variables, context) => {
            console.log('Optimization successful:', data);
            // Call the custom onSuccess if provided
            if (options?.onSuccess) {
                options.onSuccess(data, variables, context);
            }
        },
        onError: (error, variables, context) => {
            console.error('Optimization failed:', error);
            // Call the custom onError if provided
            if (options?.onError) {
                options.onError(error, variables, context);
            }
        },
        // Spread other options but exclude onSuccess and onError since we're handling them above
        ...Object.fromEntries(
            Object.entries(options || {}).filter(([key]) => key !== 'onSuccess' && key !== 'onError')
        )
    });
}