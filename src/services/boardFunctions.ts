import { energyService } from "@src/services/energyIntensity";

class BoardFunctions {
    getProviderService(provider: string) {
        switch (provider) {
            case "schneider":
                return energyService;

            default:
                throw new Error(`Unknown provider: ${provider}`);
        }
    }

    async getContextData(provider: string) {
        const service = this.getProviderService(provider);
        return service.getContextData();
    }
}

export const boardFunctions = new BoardFunctions();