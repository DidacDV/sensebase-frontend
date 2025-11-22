import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {Board, CreateBoardPayload, CreateBoardResponse} from "@src/types/boardModel";
import authenticationService from "@src/services/authentication.ts";

const boardApi = {
    getAll: async (): Promise<Board[]> => {
        const { data } = await authenticationService.get('/boards/');
        return data;
    },

    getById: async (id: string): Promise<Board> => {
        const { data } = await authenticationService.get(`/boards/${id}/`);
        return data;
    },

    create: async (payload: CreateBoardPayload): Promise<CreateBoardResponse> => {
        const { data } = await authenticationService.post('/boards/create/', payload);
        return data;
    },

    update: async (id: string, payload: Partial<CreateBoardPayload>): Promise<Board> => {
        const { data } = await authenticationService.patch(`/boards/${id}/`, payload);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await authenticationService.delete(`/boards/${id}/`);
    },
};

export const boardKeys = {
    all: ['boards'] as const,
    lists: () => [...boardKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...boardKeys.lists(), filters] as const,
    details: () => [...boardKeys.all, 'detail'] as const,
    detail: (id: string) => [...boardKeys.details(), id] as const,
};

export function useBoards() {
    return useQuery({
        queryKey: boardKeys.lists(),
        queryFn: boardApi.getAll,
    });
}

export function useBoard(id: string) {
    return useQuery({
        queryKey: boardKeys.detail(id),
        queryFn: () => boardApi.getById(id),
        enabled: !!id,
    });
}

export function useCreateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: boardApi.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
            queryClient.setQueryData(boardKeys.detail(data.board.id), data.board);
        },
    });
}

export function useUpdateBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateBoardPayload> }) =>
            boardApi.update(id, payload),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
            queryClient.setQueryData(boardKeys.detail(id), data);
        },
    });
}

export function useDeleteBoard() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: boardApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: boardKeys.lists() });
            queryClient.removeQueries({ queryKey: boardKeys.detail(id) });
        },
    });
}