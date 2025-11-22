import {useProviders} from "@src/services/providerService.ts";
import {useBoardForm} from "@src/context/boardFormContext.tsx";
import {Loader2} from "lucide-react";

function SelectProviderStep() {
    const { state, setProvider, setProviderConfig } = useBoardForm();
    const { data: providers = [], isLoading, error } = useProviders();

    const selectedProvider = providers.find(p => p.code === state.selectedProvider);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin text-slate-400" size={32} />
                <span className="ml-3 text-slate-500">Loading providers...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12 text-red-500">
                Failed to load providers. Please try again.
            </div>
        );
    }


    return (
        <div className="grid grid-cols-3 gap-8">
            {/* Left Column - Available Providers */}
            <div className="col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Available providers</h3>
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">?</div>
                </div>

                <div className="space-y-3 mb-6">
                    {providers.map((provider) => (
                        <button
                            key={provider.id}
                            onClick={() => setProvider(provider.code)}
                            className={`w-full p-4 rounded-xl text-left transition-all font-medium
                                ${state.selectedProvider === provider.code
                                ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg'
                                : 'bg-white border-2 border-slate-200 hover:border-blue-300'}`}
                            >
                            <div className="font-semibold">{provider.name}</div>
                            {provider.description && (
                                <div className={`text-sm mt-1 ${state.selectedProvider === provider.code ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {provider.description}
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                <button className="w-full p-4 bg-slate-800 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors">
                    <span className="text-2xl">+</span>
                    <span className="font-medium">Add Custom Provider</span>
                </button>
            </div>

            {/* Right Column - Adjust Connection */}
            <div className="col-span-2">
                {selectedProvider ? (
                    <div>
                        <h3 className="text-xl font-semibold text-slate-800 mb-6">
                            Configure {selectedProvider.name} connection
                        </h3>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Environment
                                </label>
                                <select
                                    value={state.providerConfig.environment}
                                    onChange={(e) => setProviderConfig({ environment: e.target.value as any })}
                                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white"
                                >
                                    <option value="production">Production</option>
                                    <option value="development">Development</option>
                                    <option value="staging">Staging</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Update frequency
                                </label>
                                <select
                                    value={state.providerConfig.updateFrequency}
                                    onChange={(e) => setProviderConfig({ updateFrequency: e.target.value as any })}
                                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white"
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Max data read
                                </label>
                                <select
                                    value={state.providerConfig.maxDataRead}
                                    onChange={(e) => setProviderConfig({ maxDataRead: e.target.value as any })}
                                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white"
                                >
                                    <option value="20GB">20GB</option>
                                    <option value="50GB">50GB</option>
                                    <option value="100GB">100GB</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Permissions
                                </label>
                                <select
                                    value={state.providerConfig.permissions}
                                    onChange={(e) => setProviderConfig({ permissions: e.target.value as any })}
                                    className="w-full p-3 border-2 border-slate-200 rounded-lg bg-white"
                                >
                                    <option value="read-only">Read-only</option>
                                    <option value="read-write">Read-write</option>
                                    <option value="full-access">Full access</option>
                                </select>
                            </div>
                        </div>

                        <p className="text-center text-sm text-slate-500 mt-8">
                            You can change this later in your board settings
                        </p>
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-slate-400 text-lg">Select a provider to configure connection</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SelectProviderStep;