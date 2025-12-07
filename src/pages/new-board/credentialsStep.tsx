import { useState } from "react";
import { FileText, Key, RotateCcw, Upload, Loader2, CheckCircle, XCircle, HelpCircle } from "lucide-react";
import { useProvider  } from "@src/services/providerService";
import {useBoardForm} from "@src/context/boardFormContext.tsx";
import {useTestCredentials} from "@src/services/boardService.ts";
import type {TestCredentialsResponse} from "@src/types/boardModel.ts";

function formatLabel(field: string): string {
    return field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getInputType(field: string): string {
    const sensitive = ['secret', 'password', 'token', 'key'];
    if (sensitive.some(s => field.toLowerCase().includes(s))) return 'password';
    if (field.toLowerCase().includes('url') || field.toLowerCase().includes('endpoint')) return 'url';
    return 'text';
}

function CredentialsStep() {
    const { state, setCredential, setConnectionTested, areCredentialsComplete } = useBoardForm();
    const [testResult, setTestResult] = useState<TestCredentialsResponse | null>(null);

    const { data: provider, isLoading } = useProvider(state.selectedProvider || '');
    const testMutation = useTestCredentials();

    const handleTestConnection = () => {
        if (!state.selectedProvider) return;
        setTestResult(null);
        testMutation.mutate(
            { provider_code: state.selectedProvider, credentials: state.credentials },
            {
                onSuccess: (data) => {
                    setTestResult(data);
                    setConnectionTested(data.valid);
                },
                onError: (error: Error) => {
                    setTestResult({
                        valid: false,
                        message: error.message,
                        provider: state.selectedProvider ?? ''
                    });
                    setConnectionTested(false);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={32} />
                <span className="ml-3 text-slate-500">Loading provider configuration...</span>
            </div>
        );
    }

    if (!provider) {
        return (
            <div className="text-center py-12 text-slate-500">
                Please select a provider first
            </div>
        );
    }

    const requiredFields = provider.required_credentials || [];
    const optionalFields = provider.optional_credentials || [];
    const helpTexts = provider.credential_help_text || {};
    const isFormValid = areCredentialsComplete(requiredFields);

    return (
        <div className="grid grid-cols-3 gap-8">
            {/* CREDENTIALS FORM COL */}
            <div className="col-span-2">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                        <Key className="text-white" size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800">
                            Introduce your credentials for {provider.name}
                        </h3>
                        <p className="text-sm text-slate-600">
                            {provider.description || 'Set up your credentials, configure your board & start using it'}
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Dynamic Required Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        {requiredFields.map((field) => (
                            <div key={field}>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                                    {formatLabel(field)}
                                    <span className="text-red-500">*</span>
                                    {helpTexts[field] && (
                                        <div className="group relative">
                                            <HelpCircle size={14} className="text-slate-400 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                {helpTexts[field]}
                                            </div>
                                        </div>
                                    )}
                                </label>
                                <input
                                    type={getInputType(field)}
                                    value={state.credentials[field] || ''}
                                    onChange={(e) => setCredential(field, e.target.value)}
                                    placeholder="Value"
                                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Dynamic Optional Fields */}
                    {optionalFields.length > 0 && (
                        <div className="border-t pt-4">
                            <p className="text-sm text-slate-500 mb-4">Optional fields</p>
                            <div className="grid grid-cols-2 gap-4">
                                {optionalFields.map((field) => (
                                    <div key={field}>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">
                                            {formatLabel(field)}
                                        </label>
                                        <input
                                            type={getInputType(field)}
                                            value={state.credentials[field] || ''}
                                            onChange={(e) => setCredential(field, e.target.value)}
                                            placeholder="Value"
                                            className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Test Connection Button */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleTestConnection}
                            disabled={!isFormValid || testMutation.isPending}
                            className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {testMutation.isPending && <Loader2 size={18} className="animate-spin" />}
                            Test connection
                        </button>

                        {testResult && (
                            <div className={`flex items-center gap-2 ${testResult.valid ? 'text-green-600' : 'text-red-600'}`}>
                                {testResult.valid ? <CheckCircle size={20} /> : <XCircle size={20} />}
                                <span className="font-medium">{testResult.message}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* QUICK ACTIONS COL */}
            <div className="col-span-1">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick actions</h3>

                <div className="space-y-3">
                    <button className="w-full p-3 bg-white border-2 border-slate-200 rounded-lg flex items-center gap-3 hover:border-blue-300 transition-colors text-left">
                        <Upload size={20} className="text-slate-600" />
                        <span className="text-slate-700 font-medium">Import credentials</span>
                    </button>

                    <button className="w-full p-3 bg-white border-2 border-slate-200 rounded-lg flex items-center gap-3 hover:border-blue-300 transition-colors text-left">
                        <FileText size={20} className="text-slate-600" />
                        {provider?.documentation_url ? (
                            <a
                                href={provider.documentation_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-700 font-medium hover:text-blue-600 transition-colors"
                            >
                                View documentation
                            </a>
                        ) : (
                            <span className="text-slate-400 font-medium">No documentation available</span>
                        )}
                    </button>

                    <button className="w-full p-3 bg-white border-2 border-slate-200 rounded-lg flex items-center gap-3 hover:border-blue-300 transition-colors text-left">
                        <RotateCcw size={20} className="text-slate-600" />
                        <span className="text-slate-700 font-medium">Load previous</span>
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="mt-6 p-4 bg-slate-50 rounded-lg border-2 border-slate-200">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Required fields</h4>
                    <ul className="space-y-2">
                        {requiredFields.map(field => (
                            <li key={field} className="flex items-center gap-2 text-sm text-slate-600">
                                {state.credentials[field]?.trim() ? (
                                    <CheckCircle size={14} className="text-green-500" />
                                ) : (
                                    <div className="w-3.5 h-3.5 border-2 border-slate-300 rounded-full" />
                                )}
                                {formatLabel(field)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CredentialsStep;