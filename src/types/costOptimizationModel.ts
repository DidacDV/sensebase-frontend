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
        title: 'Anomalous Peak',
        description: '14:30 - 2.4 kW above average',
        severity: 'medium',
        timeRange: '14:00-15:00',
        impact: 2.4
    },
    {
        id: 'anom-2',
        type: 'ANOMALY_FIX',
        title: 'Nighttime High Consumption',
        description: '02:00-05:00 - Elevated >180%',
        severity: 'high',
        timeRange: '02:00-05:00',
        impact: 3.8
    }
];

export const mockRecommendations: Recommendation[] = [
    {
        id: 'rec-1',
        type: 'LOWER_POWER',
        title: 'Lower Power P1',
        description: 'Reduce P1 from 5.0 kW to 3.5 kW',
        icon: '',
        parameters: {
            period: 'p1',
            newValue: 3.5  // This will reduce fixed power costs
        },
        estimatedSavings: 15
    },
    {
        id: 'rec-2',
        type: 'LOWER_POWER',
        title: 'Lower Power P2',
        description: 'Reduce P2 from 4.0 kW to 2.5 kW',
        icon: '',
        parameters: {
            period: 'p2',
            newValue: 2.5  // Additional power reduction
        },
        estimatedSavings: 12
    },
    {
        id: 'rec-3',
        type: 'SHIFT_CONSUMPTION',
        title: 'Shift Consumption',
        description: 'Move load to off-peak hours',
        icon: '',
        parameters: {
            targetPeriod: 'valley'
        },
        estimatedSavings: 10
    }
];

export const mockPatterns: Pattern[] = [
    {
        id: 'pat-1',
        title: 'Morning',
        timeRange: '08:00-12:00',
        value: '3.2 kW',
        trend: 'up'
    },
    {
        id: 'pat-2',
        title: 'Midday',
        timeRange: '14:00-16:00',
        value: '1.8 kW',
        trend: 'down'
    },
    {
        id: 'pat-3',
        title: 'Evening',
        timeRange: '19:00-21:00',
        value: '3.8 kW',
        trend: 'up'
    }
];