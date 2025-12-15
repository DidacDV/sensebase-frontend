import { useQuery } from '@tanstack/react-query';
import authenticationService from "@src/services/authentication.ts";
import type {TariffBlueprint} from "@src/types/tariffModel.ts";

const tariffBlueprintApi = {
    getByBoard: async (boardId: string): Promise<TariffBlueprint[]> => {
        const { data } = await authenticationService.get(`/boards/${boardId}/tariff-blueprints/`);
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