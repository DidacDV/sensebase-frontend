export type AIModelKey = 'gpt4' | 'gpt35' | 'claude_sonnet' | 'claude_opus' | 'gemini';

export const AI_MODEL_LABELS: Record<AIModelKey, string> = {
    gpt4: 'GPT-4',
    gpt35: 'GPT-3.5',
    claude_sonnet: 'Claude Sonnet',
    claude_opus: 'Claude Opus',
    gemini: 'Gemini',
};

export interface ProviderConfig {
    environment: 'production' | 'development' | 'staging';
    updateFrequency: 'daily' | 'weekly' | 'monthly';
    maxDataRead: '20GB' | '50GB' | '100GB';
    permissions: 'read-only' | 'read-write' | 'full-access';
}

export interface UIConfig {
    font: string;
    colorPalette: string;
}

export interface VisualizationSettings {
    visualizationTypes: string[];
    activeRecommendations: string[];
    benchmarks: string[];
}

export interface BoardFormState {
    selectedProvider: string | null;
    providerConfig: ProviderConfig;
    credentials: Record<string, string>;
    connectionTested: boolean;
    aiModel: AIModelKey | null;
    uiConfig: UIConfig;
    visualizationSettings: VisualizationSettings;
    boardName: string;
    boardDescription: string;
}
