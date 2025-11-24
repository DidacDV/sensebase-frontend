export interface Provider {
    id: number;
    code: string;
    name: string;
    description: string;
    provider_type: 'analytics' | 'payment' | 'energy' | 'iot' | 'custom';
    base_url: string;
    documentation_url: string;
    required_credentials: string[];
    optional_credentials: string[];
    credential_help_text: Record<string, string>;
    supports_oauth: boolean;
    supports_api_key: boolean;
}

export interface TestConnectionPayload {
    provider: string;
    credentials: Record<string, string>;
}

export interface TestConnectionResponse {
    success: boolean;
    message: string;
}
