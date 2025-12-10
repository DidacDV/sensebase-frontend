import type {SidebarNode} from "@src/types/sidebar.ts";

export const AI_MODELS = {
    gpt4: 'GPT-4',
    gpt35: 'GPT-3.5',
    claude_sonnet: 'Claude Sonnet',
    claude_opus: 'Claude Opus',
    gemini: 'Gemini',
} as const;

export type AIModelKey = keyof typeof AI_MODELS;

export interface Board {
    id: string;
    name: string;
    description: string;
    owner: string;
    data_provider: string; // provider code
    ai_model: AIModelKey;
    ui_config: Record<string, unknown>;
    visualization_settings: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

export interface Credential {
    id: string;
    name: string;
    provider_name: string;
    provider_code: string;
    board_name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    last_used_at: string | null;
}

export interface TestCredentialsPayload {
    provider_code: string;
    credentials: Record<string, string>;
}

export interface TestCredentialsResponse {
    valid: boolean;
    message: string;
    provider: string;
    details?: Record<string, string>;
    error_type?: string;
}


export interface CreateBoardPayload {
    name: string;
    description?: string;
    data_provider: string;
    ai_model: AIModelKey;
    ui_config?: Record<string, unknown>;
    visualization_settings?: Record<string, unknown>;
    credentials: Record<string, string>;
    credential_name?: string;
}

export interface CreateBoardResponse {
    message: string;
    board: Board;
    credential: Credential;
}

export interface DataSourcesResponse {
    tenantId: number;
    dataSources: SidebarNode[];
}

