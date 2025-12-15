import { AlertTriangle, CheckCircle, Save } from 'lucide-react';

interface BlueprintModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    blueprintName: string;
    setBlueprintName: (name: string) => void;
    blueprintDescription: string;
    setBlueprintDescription: (description: string) => void;
    saveStatus: 'idle' | 'success' | 'error';
    saveMessage: string;
    isPending: boolean;
}

const BlueprintModal = ({
                            isOpen,
                            onClose,
                            onConfirm,
                            blueprintName,
                            setBlueprintName,
                            blueprintDescription,
                            setBlueprintDescription,
                            saveStatus,
                            saveMessage,
                            isPending
                        }: BlueprintModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
            onClick={(e) => {
                // Close modal if clicking the backdrop
                if (e.target === e.currentTarget && saveStatus !== 'idle') {
                    onClose();
                }
            }}
        >
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Conditional Rendering based on saveStatus */}
                {saveStatus !== 'idle' ? (
                    // STATUS DISPLAY (Success/Error)
                    <div className="text-center">
                        <div className={`p-4 rounded-full inline-block mb-4 ${saveStatus === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {saveStatus === 'success' ? (
                                <CheckCircle size={32} className="text-green-600" />
                            ) : (
                                <AlertTriangle size={32} className="text-red-600" />
                            )}
                        </div>
                        <h4 className={`text-xl font-bold ${saveStatus === 'success' ? 'text-green-800' : 'text-red-800'} mb-2`}>
                            {saveStatus === 'success' ? 'Success!' : 'Save Failed'}
                        </h4>
                        <p className="text-sm text-gray-700 mb-6">
                            {saveMessage}
                        </p>
                        <button
                            onClick={onClose}
                            className={`px-6 py-2 text-sm font-semibold text-white rounded-md transition-colors ${saveStatus === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            OK
                        </button>
                    </div>
                ) : (
                    // FORM INPUTS (Idle/Loading)
                    <>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Save size={20} className="text-yellow-600" /> Save New Blueprint
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Enter a descriptive name and summary for the tariff configuration you are saving.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="blueprint-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Blueprint Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="blueprint-name"
                                    type="text"
                                    value={blueprintName}
                                    onChange={(e) => setBlueprintName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="e.g., Optimized 3.0TD Winter"
                                    disabled={isPending}
                                />
                            </div>
                            <div>
                                <label htmlFor="blueprint-description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="blueprint-description"
                                    value={blueprintDescription}
                                    onChange={(e) => setBlueprintDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 resize-none"
                                    placeholder="Detailed notes on the settings or source bill."
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isPending}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isPending || !blueprintName.trim()}
                                className="px-4 py-2 text-sm font-semibold text-gray-900 bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors flex items-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isPending ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} /> Confirm Save
                                    </>
                                )}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default BlueprintModal;