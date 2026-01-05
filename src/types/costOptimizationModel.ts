export interface Anomaly {
    id: string;
    title: string;
    description: string;
    severity: 'high' | 'medium' | 'low';
    timeRange: string;
    impact: number;
    // Agregamos el type para mapearlo a ANOMALY_FIX en el backend
    type: 'ANOMALY_FIX';
}

export interface Recommendation {
    id: string;
    type: 'LOWER_POWER' | 'SHIFT_CONSUMPTION' | 'STORAGE'; // Alineado con Python
    title: string;
    description: string;
    icon: string;
    parameters: Record<string, any>;
    estimatedSavings: number;
}

export interface Pattern {
    id: string;
    title: string;
    timeRange: string;
    value: string;
    trend: 'up' | 'down' | 'stable';
}

export interface TariffBlueprint {
    id: string;
    name: string;
    description?: string;
}

export interface FormState {
    tariffId: string;
    selectedAnomalies: string[];
    selectedRecommendations: string[];
    consumption: Record<string, any>;
}

export interface OptimizationPayload {
    tariffId: string;
    consumption: Record<string, any>;
    recommendations: Array<{
        type: string;
        parameters: Record<string, any>;
    }>;
}

export const mockAnomalies: Anomaly[] = [
    {
        id: 'anom-1',
        type: 'ANOMALY_FIX',
        title: 'Pico anómalo',
        description: '14:30h - 2.4 kW sobre media',
        severity: 'medium',
        timeRange: '14:00-15:00',
        impact: 2.4
    },
    {
        id: 'anom-2',
        type: 'ANOMALY_FIX',
        title: 'Consumo nocturno',
        description: '02:00-05:00h - Elevado >180%',
        severity: 'high',
        timeRange: '02:00-05:00',
        impact: 3.8
    }
];

export const mockRecommendations: Recommendation[] = [
    {
        id: 'rec-1',
        type: 'LOWER_POWER',
        title: 'Reducir Potencia',
        description: 'Optimizar P1 a 3.5kW',
        icon: '📉',
        parameters: {
            period: 'p1',
            newValue: 3.5
        },
        estimatedSavings: 15
    },
    {
        id: 'rec-2',
        type: 'SHIFT_CONSUMPTION',
        title: 'Desplazar consumo',
        description: 'Mover carga a horas valle',
        icon: '⚡',
        parameters: {
            targetPeriod: 'valley'
        },
        estimatedSavings: 45
    }
];

export const mockPatterns: Pattern[] = [
    {
        id: 'pat-1',
        title: 'Mañana',
        timeRange: '08:00-12:00h',
        value: '3.2 kW',
        trend: 'up'
    },
    {
        id: 'pat-2',
        title: 'Mediodía',
        timeRange: '14:00-16:00h',
        value: '1.8 kW',
        trend: 'down'
    },
    {
        id: 'pat-3',
        title: 'Tarde',
        timeRange: '19:00-21:00h',
        value: '3.8 kW',
        trend: 'up'
    }
];