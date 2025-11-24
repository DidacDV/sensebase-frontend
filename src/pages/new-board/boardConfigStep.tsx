import { useBoardForm } from "@src/context/boardFormContext";
import type {AIModelKey} from "@src/types/boardModel.ts";


const AI_MODELS = [
    {
        id: 'gpt4' as AIModelKey,
        name: 'Sensebase Core',
        description: 'The essential AI engine behind Sensebase. It interprets your data, identifies trends, and surfaces the most relevant insights.',
        color: 'from-slate-600 to-slate-800'
    },
    {
        id: 'claude_sonnet' as AIModelKey,
        name: 'Sensebase Predict',
        description: 'Uses historical and real-time data to forecast consumption, detect anomalies, and highlight potential risks.',
        color: 'from-slate-700 to-slate-900'
    },
    {
        id: 'claude_opus' as AIModelKey,
        name: 'Sensebase Quantum',
        description: 'Our most advanced AI model. Learns continuously from multiple data sources with self-improving predictions.',
        color: 'from-blue-500 to-cyan-400',
        note: '*Only for Enterprise Users'
    }
];

export default function BoardConfigStep() {
    const { state, setAiModel, setBoardName, setBoardDescription } = useBoardForm();

    return (
        <div className="space-y-8">
            {/* Board Name & Description */}
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Board Name *</label>
                    <input
                        type="text"
                        value={state.boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        placeholder="My Analytics Board"
                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <input
                        type="text"
                        value={state.boardDescription}
                        onChange={(e) => setBoardDescription(e.target.value)}
                        placeholder="Optional description..."
                        className="w-full p-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                </div>
            </div>

            {/* AI Model Selection */}
            <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Choose AI Model *</h3>
                <div className="grid grid-cols-3 gap-4">
                    {AI_MODELS.map(model => (
                        <button
                            key={model.id}
                            onClick={() => setAiModel(model.id)}
                            className={`p-4 rounded-xl text-left transition-all ${
                                state.aiModel === model.id
                                    ? `bg-gradient-to-r ${model.color} text-white shadow-lg`
                                    : 'bg-slate-100 border-2 border-slate-200 hover:border-blue-300'
                            }`}
                        >
                            <h4 className={`font-semibold mb-1 ${state.aiModel === model.id ? 'text-white' : 'text-slate-800'}`}>
                                {model.name}
                            </h4>
                            <p className={`text-sm ${state.aiModel === model.id ? 'text-white/90' : 'text-slate-600'}`}>
                                {model.description}
                            </p>
                            {model.note && (
                                <p className={`text-xs mt-2 ${state.aiModel === model.id ? 'text-white/80' : 'text-slate-500'}`}>
                                    {model.note}
                                </p>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}