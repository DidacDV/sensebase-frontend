import { useState } from "react";
import { useNavigate } from 'react-router';
import { ChevronLeft, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreateBoard } from "@src/services/boardService";
import { useProvider } from "@src/services/providerService";
import SelectProviderStep from "@src/pages/new-board/selectProvider.tsx";
import CredentialsStep from "@src/pages/new-board/credentialsStep.tsx";
import BoardConfigStep from "@src/pages/new-board/boardConfigStep.tsx";
import {BoardFormProvider, useBoardForm} from "@src/context/boardFormContext.tsx";
import type {CreateBoardPayload} from "@src/types/boardModel.ts";



function NewBoardContent() {
    const [currentStep, setCurrentStep] = useState(1);
    const navigate = useNavigate();
    const { state, canProceedToStep, areCredentialsComplete, reset } = useBoardForm();
    const createBoard = useCreateBoard();

    const { data: provider } = useProvider(state.selectedProvider || '');

    const steps = [
        { number: 1, name: 'Select Provider', component: <SelectProviderStep /> },
        { number: 2, name: 'Credentials', component: <CredentialsStep /> },
        { number: 3, name: 'Configuration', component: <BoardConfigStep /> }
    ];

    const canSubmit = () => {
        if (!state.selectedProvider) return false;
        if (!state.connectionTested) return false;
        if (!state.aiModel) return false;
        if (!state.boardName.trim()) return false;
        return !(provider && !areCredentialsComplete(provider.required_credentials));
    };

    const goToNextStep = () => {
        if (currentStep < steps.length && canProceedToStep(currentStep + 1)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const goToPrevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1);
    };

    const handleCreateBoard = async () => {
        if (!canSubmit()) return;

        const payload: CreateBoardPayload = {
            name: state.boardName.trim(),
            description: state.boardDescription.trim(),
            data_provider: state.selectedProvider!,
            ai_model: state.aiModel!,
            ui_config: {
                font: state.uiConfig.font,
                colorPalette: state.uiConfig.colorPalette,
                providerConfig: state.providerConfig,
            },
            visualization_settings: {
                types: state.visualizationSettings.visualizationTypes,
                recommendations: state.visualizationSettings.activeRecommendations,
                benchmarks: state.visualizationSettings.benchmarks,
            },
            credentials: state.credentials,
        };

        createBoard.mutate(payload, {
            onSuccess: (data) => {
                reset();
                navigate(`/boards/${data.board.id}`);
            },
        });
    };

    const getNextButtonText = () => {
        if (currentStep === 1) return 'Continue to credentials';
        if (currentStep === 2) return 'Continue to configuration';
        return 'Create board';
    };

    const getBackButtonText = () => {
        if (currentStep === 2) return 'Back to Providers';
        if (currentStep === 3) return 'Back to Credentials';
        return '';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        {currentStep === 1 && 'Select your data provider'}
                        {currentStep === 2 && 'Configure credentials'}
                        {currentStep === 3 && 'Board configuration'}
                    </h1>
                    <p className="text-slate-600">
                        {currentStep === 1 && 'Choose the data source for your board'}
                        {currentStep === 2 && 'Enter your credentials and test the connection'}
                        {currentStep === 3 && 'Name your board and choose AI settings'}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {steps.map((step, idx) => (
                        <div key={step.number} className="flex items-center">
                            <div className="flex items-center gap-3">
                                <motion.div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold
                    ${currentStep > step.number ? 'bg-green-500 text-white' :
                                        currentStep === step.number ? 'bg-blue-600 text-white' :
                                            'bg-slate-300 text-slate-600'}`}
                                    animate={{ scale: currentStep === step.number ? [1, 1.05, 1] : 1 }}
                                >
                                    {currentStep > step.number ? <Check size={20} /> : step.number}
                                </motion.div>
                                <span className={`font-medium ${currentStep >= step.number ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.name}
                </span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className="h-1 mx-4 bg-slate-300 relative overflow-hidden" style={{ width: 96 }}>
                                    <motion.div
                                        className="absolute inset-0 bg-green-500"
                                        initial={{ width: '0%' }}
                                        animate={{ width: currentStep > step.number ? '100%' : '0%' }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    {steps[currentStep - 1].component}
                </div>

                {/* Error */}
                {createBoard.isError && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {createBoard.error?.message || 'Failed to create board'}
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={goToPrevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium
              ${currentStep === 1 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' :
                            'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                    >
                        <ChevronLeft size={20} />
                        {getBackButtonText()}
                    </button>

                    <div className="flex gap-3">
                        <button
                            onClick={currentStep === steps.length ? handleCreateBoard : goToNextStep}
                            disabled={
                                createBoard.isPending ||
                                (currentStep < steps.length && !canProceedToStep(currentStep + 1)) ||
                                (currentStep === steps.length && !canSubmit())
                            }
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {createBoard.isPending && <Loader2 size={18} className="animate-spin" />}
                            {getNextButtonText()}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function NewBoard() {
    return (
        <BoardFormProvider>
            <NewBoardContent />
        </BoardFormProvider>
    );
}