import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type {
    Board,
    CreateBoardPayload,
    CreateBoardResponse, DataSourcesResponse,
    TestCredentialsPayload,
    TestCredentialsResponse
} from "@src/types/boardModel";
import type {
    SavedRecommendation,
    SavedRecommendationCreate,
    SavedRecommendationUpdate
} from "@src/types/savedRecommendation";
import authenticationService from "@src/services/authentication.ts";
import type {BoardContext} from "@src/models/boardModel.ts";

export const fetchBoardContext = async (id: string, payload: any): Promise<BoardContext> => {
    const { data } = await authenticationService.post(`/boards/${id}/context/`, payload);
    return data;
};


const boardApi = {
    getAll: async (): Promise<Board[]> => {
        const { data } = await authenticationService.get('/boards/');
        return data;
    },

    getById: async (id: string): Promise<Board> => {
        const { data } = await authenticationService.get(`/boards/${id}/`);
        return data;
    },

    getContext: async (id: string, payload: any): Promise<BoardContext> => {
        const { data } = await authenticationService.post(`/boards/${id}/context/`, payload);
        return data;
    },

    getDataSources: async (boardId: string): Promise<DataSourcesResponse> => {
        const { data } = await authenticationService.get(`/boards/${boardId}/data-sources/`);
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
    testCredentials: async (payload: TestCredentialsPayload): Promise<TestCredentialsResponse> => {
        const { data } = await authenticationService.post('boards/credentials/test/', payload);
        return data;
    },

    getSavedRecommendations: async (boardId: string): Promise<SavedRecommendation[]> => {
        const { data } = await authenticationService.get(`/boards/${boardId}/recommendations/saved/`);
        return data;
    },

    createSavedRecommendation: async (boardId: string, payload: SavedRecommendationCreate): Promise<SavedRecommendation> => {
        const { data } = await authenticationService.post(`/boards/${boardId}/recommendations/saved/`, payload);
        return data;
    },

    updateSavedRecommendation: async (boardId: string, recId: number, payload: SavedRecommendationUpdate): Promise<SavedRecommendation> => {
        const { data } = await authenticationService.put(`/boards/${boardId}/recommendations/saved/${recId}/`, payload);
        return data;
    },

    deleteSavedRecommendation: async (boardId: string, recId: number): Promise<void> => {
        await authenticationService.delete(`/boards/${boardId}/recommendations/saved/${recId}/`);
    },
};

export const boardKeys = {
    all: ['boards'] as const,
    lists: () => [...boardKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...boardKeys.lists(), filters] as const,
    details: () => [...boardKeys.all, 'detail'] as const,
    detail: (id: string) => [...boardKeys.details(), id] as const,
    dataSources: (boardId: string) => [...boardKeys.all, 'data-sources', boardId] as const,
    savedRecommendations: (boardId: string) => [...boardKeys.all, 'saved-recommendations', boardId] as const,
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

export function useBoardContext() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => 
            fetchBoardContext(id, data),
        onSuccess: (responseData, variables) => {
            const cacheKey = ['board-context', variables.id, JSON.stringify(variables.data)];
            
            queryClient.setQueryData(cacheKey, responseData);
        },
    });
}

export function useBoardDataSources(boardId: string) {
    return useQuery<DataSourcesResponse>({
        queryKey: boardKeys.dataSources(boardId),
        queryFn: () => boardApi.getDataSources(boardId),
        enabled: !!boardId,
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

export function useTestCredentials() {
    return useMutation({
        mutationFn: boardApi.testCredentials,
    });
}

export function useSavedRecommendations(boardId: string) {
    return useQuery({
        queryKey: boardKeys.savedRecommendations(boardId),
        queryFn: () => boardApi.getSavedRecommendations(boardId),
        enabled: !!boardId,
    });
}

export function useCreateSavedRecommendation(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: SavedRecommendationCreate) => 
            boardApi.createSavedRecommendation(boardId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.savedRecommendations(boardId) });
        },
    });
}

export function useUpdateSavedRecommendation(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recId, payload }: { recId: number; payload: SavedRecommendationUpdate }) =>
            boardApi.updateSavedRecommendation(boardId, recId, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.savedRecommendations(boardId) });
        },
    });
}

export function useDeleteSavedRecommendation(boardId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (recId: number) => 
            boardApi.deleteSavedRecommendation(boardId, recId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: boardKeys.savedRecommendations(boardId) });
        },
    });
}