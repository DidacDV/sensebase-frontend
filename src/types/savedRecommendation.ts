export interface SavedRecommendation {
    id: number;
    board: number;
    board_name: string;
    user: number;
    user_email: string;
    title: string;
    description: string;
    item_type: 'alert' | 'tip' | 'stat';
    source_type: 'recommendation' | 'anomaly';
    anomaly_type?: 'peak' | 'nighttime' | 'irregular' | 'trend';
    anomaly_severity?: 'low' | 'medium' | 'high';
    anomaly_value?: number;
    anomaly_timestamp?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
    responsible: string;
    deadline: string; // ISO date
    note: string;
    checklist: Array<{id: string; text: string; checked: boolean}>;
    saved_at: string; // ISO timestamp
    implementation_started: string | null;
    implementation_completed: string | null;
    updated_at: string;
}

export interface SavedRecommendationCreate {
    title: string;
    description: string;
    item_type: 'alert' | 'tip' | 'stat';
    source_type: 'recommendation' | 'anomaly';
    anomaly_type?: 'peak' | 'nighttime' | 'irregular' | 'trend';
    anomaly_severity?: 'low' | 'medium' | 'high';
    anomaly_value?: number;
    anomaly_timestamp?: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed' | 'on_hold';
    responsible: string;
    deadline: string;
    note: string;
    checklist: Array<{id: string; text: string; checked: boolean}>;
}

export interface SavedRecommendationUpdate {
    priority?: 'high' | 'medium' | 'low';
    status?: 'pending' | 'in_progress' | 'completed' | 'on_hold';
    responsible?: string;
    deadline?: string;
    note?: string;
    checklist?: Array<{id: string; text: string; checked: boolean}>;
}
