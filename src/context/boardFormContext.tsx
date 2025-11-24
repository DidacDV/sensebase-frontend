import type {BoardFormState, ProviderConfig, UIConfig, VisualizationSettings} from '@src/types/boardFormModel.ts';
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import type {AIModelKey} from "@src/types/boardModel.ts";

const initialState: BoardFormState = {
    selectedProvider: null,
    providerConfig: {
        environment: 'production',
        updateFrequency: 'weekly',
        maxDataRead: '20GB',
        permissions: 'read-only',
    },
    credentials: {},
    connectionTested: false,
    aiModel: null,
    uiConfig: {
        font: 'Inter',
        colorPalette: 'slate-900',
    },
    visualizationSettings: {
        visualizationTypes: ['line-charts', 'heat-maps'],
        activeRecommendations: ['anomalies', 'improve-metrics'],
        benchmarks: ['historical', 'average'],
    },
    boardName: '',
    boardDescription: '',
};

interface BoardFormContextValue {
    state: BoardFormState;
    setProvider: (code: string) => void;
    setProviderConfig: (updates: Partial<ProviderConfig>) => void;
    setCredential: (field: string, value: string) => void;
    setConnectionTested: (tested: boolean) => void;
    setAiModel: (model: AIModelKey) => void;
    setBoardName: (name: string) => void;
    setBoardDescription: (description: string) => void;
    canProceedToStep: (step: number) => boolean;
    areCredentialsComplete: (requiredFields: string[]) => boolean;
    reset: () => void;
}

const BoardFormContext = createContext<BoardFormContextValue | null>(null);

export function BoardFormProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<BoardFormState>(initialState);

    const update = useCallback((updates: Partial<BoardFormState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const setProvider = useCallback((code: string) => {
        setState(prev => ({
            ...prev,
            selectedProvider: code,
            credentials: {},
            connectionTested: false,
        }));
    }, []);

    const setProviderConfig = useCallback((updates: Partial<ProviderConfig>) => {
        setState(prev => ({
            ...prev,
            providerConfig: { ...prev.providerConfig, ...updates },
        }));
    }, []);

    const setCredential = useCallback((field: string, value: string) => {
        setState(prev => ({
            ...prev,
            credentials: { ...prev.credentials, [field]: value },
            connectionTested: false,
        }));
    }, []);

    const setConnectionTested = useCallback((tested: boolean) => {
        update({ connectionTested: tested });
    }, [update]);

    const setAiModel = useCallback((model: AIModelKey) => {
        update({ aiModel: model });
    }, [update]);

    const setUIConfig = useCallback((updates: Partial<UIConfig>) => {
        setState(prev => ({
            ...prev,
            uiConfig: { ...prev.uiConfig, ...updates },
        }));
    }, []);

    const setVisualization = useCallback((updates: Partial<VisualizationSettings>) => {
        setState(prev => ({
            ...prev,
            visualizationSettings: { ...prev.visualizationSettings, ...updates },
        }));
    }, []);

    const setBoardName = useCallback((name: string) => {
        update({ boardName: name });
    }, [update]);

    const setBoardDescription = useCallback((desc: string) => {
        update({ boardDescription: desc });
    }, [update]);

    const reset = useCallback(() => {
        setState(initialState);
    }, []);

    const canProceedToStep = useCallback((step: number): boolean => {
        if (step === 2) return !!state.selectedProvider;
        if (step === 3) return !!state.selectedProvider && state.connectionTested;
        return true;
    }, [state.selectedProvider, state.connectionTested]);

    const areCredentialsComplete = useCallback((requiredFields: string[]): boolean => {
        return requiredFields.every(f => state.credentials[f]?.trim());
    }, [state.credentials]);



    const value = useMemo(() => ({
        state,
        setProvider,
        setProviderConfig,
        setCredential,
        setConnectionTested,
        setAiModel,
        setUIConfig,
        setVisualization,
        setBoardName,
        setBoardDescription,
        reset,
        canProceedToStep,
        areCredentialsComplete,
    }), [
        state, setProvider, setProviderConfig, setCredential, setConnectionTested,
        setAiModel, setUIConfig, setVisualization, setBoardName, setBoardDescription,
        reset, canProceedToStep, areCredentialsComplete
    ]);

    return (
        <BoardFormContext.Provider value={value}>
            {children}
        </BoardFormContext.Provider>
    );
}

export function useBoardForm() {
    const ctx = useContext(BoardFormContext);
    if (!ctx) {
        throw new Error('useBoardForm must be used within BoardFormProvider');
    }
    return ctx;
}