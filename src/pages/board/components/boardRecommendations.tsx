import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import type { BoardContext as BoardContextModel, Insight, Recommendation, Anomaly } from '@src/models/boardModel';
import type { SavedRecommendation, SavedRecommendationCreate, SavedRecommendationUpdate } from '@src/types/savedRecommendation';
import {
    useSavedRecommendations,
    useCreateSavedRecommendation,
    useUpdateSavedRecommendation,
    useDeleteSavedRecommendation
} from '@src/services/boardService';

interface BoardRecommendationsProps {
    context: BoardContextModel;
    boardId: string;
}

/** Green palette from boardContext */
const BOARD_COLORS = {
  grid: '#10B981',   // emerald green
  local: '#22C55E',  // lime green  
  all: '#34D399',    // light green
  mixed: '#059669',  // darker green
  it: '#047857',     // forest green
};

const typeStyles: Record<Insight['type'] | 'neutral' | 'anomaly', { 
    label: string; 
    color: string; 
    bg: string;
    iconBg: string;
    icon: string;
    actionLabel: string;
}> = {
    alert: {
        label: 'Prediction',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50 border-emerald-200',
        iconBg: 'bg-emerald-100',
        icon: 'mdi:crystal-ball',
        actionLabel: 'View forecast'
    },
    tip: {
        label: 'Recommendation',
        color: 'text-green-700',
        bg: 'bg-green-50 border-green-200',
        iconBg: 'bg-green-100',
        icon: 'mdi:lightbulb-on',
        actionLabel: 'Apply tip'
    },
    stat: {
        label: 'Key metric',
        color: 'text-teal-700',
        bg: 'bg-teal-50 border-teal-200',
        iconBg: 'bg-teal-100',
        icon: 'mdi:chart-line',
        actionLabel: 'View details'
    },
    anomaly: {
        label: 'Anomaly',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-200',
        iconBg: 'bg-red-100',
        icon: 'mdi:alert-circle',
        actionLabel: 'View anomaly'
    },
    neutral: {
        label: 'Insight',
        color: 'text-gray-700',
        bg: 'bg-gray-50 border-gray-200',
        iconBg: 'bg-gray-100',
        icon: 'mdi:information',
        actionLabel: 'View more'
    }
};

const anomalySeverityStyles: Record<'low' | 'medium' | 'high', {
    label: string;
    color: string;
    bg: string;
    iconBg: string;
    icon: string;
    actionLabel: string;
}> = {
    low: {
        label: 'Anomaly',
        color: 'text-yellow-700',
        bg: 'bg-yellow-50 border-yellow-200',
        iconBg: 'bg-yellow-100',
        icon: 'mdi:alert',
        actionLabel: 'View anomaly'
    },
    medium: {
        label: 'Anomaly',
        color: 'text-orange-700',
        bg: 'bg-orange-50 border-orange-200',
        iconBg: 'bg-orange-100',
        icon: 'mdi:alert-circle',
        actionLabel: 'View anomaly'
    },
    high: {
        label: 'Anomaly',
        color: 'text-red-700',
        bg: 'bg-red-50 border-red-200',
        iconBg: 'bg-red-100',
        icon: 'mdi:alert-octagon',
        actionLabel: 'View anomaly'
    }
};

const getStyleForSavedRecommendation = (rec: SavedRecommendation) => {
    if (rec.source_type === 'anomaly' && rec.anomaly_severity) {
        return anomalySeverityStyles[rec.anomaly_severity] ?? typeStyles.anomaly;
    }
    // Otherwise, use the item_type style
    return typeStyles[rec.item_type] ?? typeStyles.neutral;
};

const BoardRecommendations = ({ context, boardId }: BoardRecommendationsProps) => {

    const insights = context?.recommendations ?? context?.insights ?? [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [viewMode, setViewMode] = useState<'all' | 'saved'>('all');
    
    const { data: savedRecommendations = [] } = useSavedRecommendations(boardId);
    const createMutation = useCreateSavedRecommendation(boardId);
    const updateMutation = useUpdateSavedRecommendation(boardId);
    const deleteMutation = useDeleteSavedRecommendation(boardId);

    const [activeSavedIndex, setActiveSavedIndex] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.8,
        }),
    };

    if (!insights.length) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <p className="text-sm">Aún no hay recomendaciones disponibles para este board.</p>
            </div>
        );
    }

    const total = insights.length;
    const current = insights[activeIndex];

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setActiveIndex((prev: number) => {
            let next = prev + newDirection;
            if (next >= total) next = 0;
            if (next < 0) next = total - 1;
            return next;
        });
    };

    const goPrev = () => paginate(-1);
    const goNext = () => paginate(1);

    const saveRecommendation = async (insight: Recommendation) => {
        const alreadySaved = savedRecommendations.some(s => s.title === insight.title);
        if (alreadySaved) return;
        
        let priority: 'high' | 'medium' | 'low' = 'medium';
        
        if (insight.type === 'alert') {
            priority = 'low';
        } else if (insight.type === 'tip') {
            priority = 'low';
        } else {
            priority = 'low';
        }
        
        const payload: SavedRecommendationCreate = {
            title: insight.title,
            description: insight.briefDescription,
            item_type: insight.type,
            source_type: 'recommendation',
            priority,
            status: 'pending',
            responsible: '',
            deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: '',
            checklist: [],
        };
        
        await createMutation.mutateAsync(payload);
    };

    const saveAnomaly = async (anomaly: Anomaly) => {
        const alreadySaved = savedRecommendations.some(s => 
            s.source_type === 'anomaly' && s.title === anomaly.title
        );
        if (alreadySaved) return;
        
        let priority: 'high' | 'medium' | 'low' = 'medium';
        if (anomaly.severity === 'high') {
            priority = 'high';
        } else if (anomaly.severity === 'low') {
            priority = 'low';
        }
        
        const payload: SavedRecommendationCreate = {
            title: anomaly.title,
            description: anomaly.description,
            item_type: 'alert',
            source_type: 'anomaly',
            anomaly_type: anomaly.type,
            anomaly_severity: anomaly.severity,
            anomaly_value: anomaly.value,
            anomaly_timestamp: anomaly.timestamp,
            priority,
            status: 'pending',
            responsible: '',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: '',
            checklist: [],
        };
        
        await createMutation.mutateAsync(payload);
    };

    const removeSavedRecommendation = async (recId: number) => {
        await deleteMutation.mutateAsync(recId);
        if (activeSavedIndex >= savedRecommendations.length - 1 && savedRecommendations.length > 1) {
            setActiveSavedIndex(savedRecommendations.length - 2);
        }
    };

    const updateField = async (recId: number, field: keyof SavedRecommendationUpdate, value: any) => {
        const payload: SavedRecommendationUpdate = { [field]: value };
        await updateMutation.mutateAsync({ recId, payload });
    };

    const updateNote = (recId: number, note: string) => {
        updateField(recId, 'note', note);
    };

    const addChecklistItem = (rec: SavedRecommendation) => {
        const newChecklist = [...rec.checklist, {
            id: Date.now().toString(),
            text: '',
            checked: false
        }];
        updateField(rec.id, 'checklist', newChecklist);
    };

    const updateChecklistItem = (rec: SavedRecommendation, itemId: string, text: string) => {
        const newChecklist = rec.checklist.map(item => 
            item.id === itemId ? { ...item, text } : item
        );
        updateField(rec.id, 'checklist', newChecklist);
    };

    const toggleChecklistItem = (rec: SavedRecommendation, itemId: string) => {
        const newChecklist = rec.checklist.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        updateField(rec.id, 'checklist', newChecklist);
    };

    const removeChecklistItem = (rec: SavedRecommendation, itemId: string) => {
        const newChecklist = rec.checklist.filter(i => i.id !== itemId);
        updateField(rec.id, 'checklist', newChecklist);
    };

    const updatePriority = (recId: number, priority: 'high' | 'medium' | 'low') => {
        updateField(recId, 'priority', priority);
    };

    const updateStatus = (recId: number, status: 'pending' | 'in_progress' | 'completed' | 'on_hold') => {
        updateField(recId, 'status', status);
    };

    const updateResponsible = (recId: number, responsible: string) => {
        updateField(recId, 'responsible', responsible);
    };

    const updateDeadline = (recId: number, deadline: string) => {
        updateField(recId, 'deadline', deadline);
    };

    const exportToCSV = () => {
        try {
            console.log('Exporting CSV with', savedRecommendations.length, 'recommendations');
            
            if (!savedRecommendations || savedRecommendations.length === 0) {
                console.warn('No recommendations to export');
                return;
            }

            const headers = [
                'Title',
                'Source Type',
                'Item Type',
                'Anomaly Type',
                'Anomaly Severity',
                'Anomaly Value',
                'Priority',
                'Status',
                'Responsible',
                'Deadline',
                'Tasks Completed',
                'Notes',
                'Description'
            ];
            
            const rows = savedRecommendations.map(rec => {
                const safeToFixed = (value: any, decimals: number) => {
                    const num = Number(value);
                    return isNaN(num) ? '0.00' : num.toFixed(decimals);
                };

                return [
                    rec.title,
                    rec.source_type,
                    rec.item_type,
                    rec.anomaly_type || 'N/A',
                    rec.anomaly_severity || 'N/A',
                    rec.anomaly_value ? safeToFixed(rec.anomaly_value, 4) : 'N/A',
                    rec.priority,
                    rec.status,
                    rec.responsible || 'Unassigned',
                    new Date(rec.deadline).toLocaleDateString('en-US'),
                    `${rec.checklist?.filter(t => t.checked).length || 0}/${rec.checklist?.length || 0}`,
                    (rec.note || '').replace(/\n/g, ' ').substring(0, 200),
                    (rec.description || '').replace(/\n/g, ' ').substring(0, 200)
                ];
            });
            
            const csv = [headers, ...rows]
                .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                .join('\n');
            
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `action_plan_${new Date().toISOString().split('T')[0]}.csv`;
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            }, 100);
            
            console.log('CSV export completed');
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };

    const isRecommendationSaved = (insight: Recommendation) => {
        return savedRecommendations.some(s => s.source_type === 'recommendation' && s.title === insight.title);
    };

    const isAnomalySaved = (anomaly: Anomaly) => {
        return savedRecommendations.some(s => s.source_type === 'anomaly' && s.title === anomaly.title);
    };

    const anomalies = context?.anomalies ?? [];
    const severityStyles = {
        low: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', icon: 'mdi:alert', iconBg: 'bg-yellow-100' },
        medium: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: 'mdi:alert-circle', iconBg: 'bg-orange-100' },
        high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'mdi:alert-octagon', iconBg: 'bg-red-100' }
    };

    return (
        <div className="h-full flex flex-col gap-4 pb-6">
            {/* Header resumen */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-100 p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-1" style={{ color: BOARD_COLORS.local }}>Energy Optimization Recommendations</h2>
                        <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
                            Intelligent analysis based on your consumption patterns. These actions can help you reduce costs and improve efficiency.
                        </p>
                    </div>
                    <div className="shrink-0 bg-white rounded-lg border border-gray-200 px-3 py-2 text-center shadow-sm">
                        <div className="text-xl font-bold" style={{ color: BOARD_COLORS.grid }}>{total}</div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide mt-0.5">Available</div>
                    </div>
                </div>
            </div>

            {/* Layout de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
                {/* Columna izquierda: Catálogo de recomendaciones */}
                <div className="flex flex-col gap-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center gap-2">
                            <Icon icon="mdi:lightbulb-multiple" className="text-xl" style={{ color: BOARD_COLORS.grid }} />
                            <h3 className="text-lg font-bold text-slate-900">Full Catalog</h3>
                        </div>
                    </div>

                    {/* Carrusel de recomendaciones */}
                    <div className="flex flex-col gap-3">
                        <div className="relative overflow-hidden" style={{ minHeight: '450px' }}>
                            <AnimatePresence initial={false} custom={direction} mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    custom={direction}
                                    variants={slideVariants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{
                                        x: { type: 'spring', stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.2 },
                                    }}
                                    className="absolute inset-0"
                                >
                                    {(() => {
                                        const style = typeStyles[current.type] ?? typeStyles.neutral;
                                        return (
                                            <div className={`h-full rounded-2xl border-2 ${style.bg} shadow-lg overflow-hidden`}>
                                                <div className="h-full flex flex-col">
                                                    {/* Header de la tarjeta */}
                                                    <div className="bg-white/50 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className={`shrink-0 w-12 h-12 rounded-xl ${style.iconBg} flex items-center justify-center shadow-sm`}>
                                                                    <Icon icon={style.icon} className={`text-2xl ${style.color}`} />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.color} bg-white shadow-sm`}>
                                                                            {style.label}
                                                                        </span>
                                                                        <span className="text-xs text-gray-500">
                                                                            {activeIndex + 1} of {total}
                                                                        </span>
                                                                    </div>
                                                                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">
                                                                        {current.title}
                                                                    </h3>
                                                                    {current.subtitle && (
                                                                        <p className="text-sm text-gray-600 font-medium">
                                                                            {current.subtitle}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Contenido de la tarjeta */}
                                                    <div className="flex-1 px-6 py-5 flex flex-col justify-between overflow-y-auto">
                                                        <div>
                                                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                                                {current.briefDescription}
                                                            </p>

                                                        {/* Sección de impacto/métricas según tipo */}
                                                        {current.type === 'alert' && (
                                                            <div className="bg-white/70 rounded-xl border border-emerald-200 p-4 mb-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Icon icon="mdi:trending-up" className="text-lg" style={{ color: BOARD_COLORS.grid }} />
                                                                    <h4 className="font-semibold text-slate-900">Future forecast</h4>
                                                                </div>
                                                                <p className="text-sm text-gray-700">
                                                                    This prediction helps you anticipate changes in your consumption and make proactive decisions to optimize costs.
                                                                </p>
                                                            </div>
                                                        )}                                                            {current.type === 'tip' && (
                                                                <div className="bg-white/70 rounded-xl border border-green-200 p-4 mb-4">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Icon icon="mdi:star-shooting" className="text-lg" style={{ color: BOARD_COLORS.local }} />
                                                                        <h4 className="font-semibold text-slate-900">Expected benefits</h4>
                                                                    </div>
                                                                    <ul className="space-y-2 text-sm text-gray-700">
                                                                        <li className="flex items-start gap-2">
                                                                            <span className="text-emerald-600 mt-0.5">✓</span>
                                                                            <span>Estimated consumption reduction: 5-15%</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-2">
                                                                            <span className="text-emerald-600 mt-0.5">✓</span>
                                                                            <span>Improved cost predictability</span>
                                                                        </li>
                                                                        <li className="flex items-start gap-2">
                                                                            <span className="text-emerald-600 mt-0.5">✓</span>
                                                                            <span>Greater operational control</span>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            )}

                                                            {current.type === 'stat' && (
                                                                <div className="bg-white/70 rounded-xl border border-teal-200 p-4 mb-4">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Icon icon="mdi:trending-up" className="text-lg" style={{ color: BOARD_COLORS.mixed }} />
                                                                        <h4 className="font-semibold text-slate-900">Data context</h4>
                                                                    </div>
                                                                    <p className="text-sm text-gray-700">
                                                                        This indicator allows you to compare your current performance with previous periods 
                                                                        and establish measurable improvement targets.
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Botones de acción */}
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                type="button"
                                                                disabled={isRecommendationSaved(current)}
                                                                className={`flex-1 px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                                                                    isRecommendationSaved(current)
                                                                        ? 'text-gray-400 bg-gray-100 border-2 border-gray-200 cursor-not-allowed'
                                                                        : 'text-white hover:shadow-lg'
                                                                }`}
                                                                style={!isRecommendationSaved(current) ? { backgroundColor: BOARD_COLORS.grid } : {}}
                                                                onClick={() => saveRecommendation(current)}
                                                            >
                                                                <Icon icon={isRecommendationSaved(current) ? 'mdi:bookmark-check' : 'mdi:bookmark-plus'} className="text-lg" />
                                                                {isRecommendationSaved(current) ? 'Saved' : 'Save to my plan'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Controles de navegación */}
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={goPrev}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white text-slate-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                                style={{ borderColor: BOARD_COLORS.grid }}
                                aria-label="Previous recommendation"
                            >
                                <span className="text-xl">‹</span>
                            </button>

                            {/* Indicadores del carrusel */}
                            <div className="flex items-center justify-center gap-2">
                                {insights.map((insight, idx) => {
                                    const style = typeStyles[insight.type] ?? typeStyles.neutral;
                                    return (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => {
                                                setDirection(idx > activeIndex ? 1 : -1);
                                                setActiveIndex(idx);
                                            }}
                                            className={`h-3 rounded-full transition-all ${
                                                idx === activeIndex 
                                                    ? `w-10 ${style.color.replace('text-', 'bg-')}` 
                                                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                            aria-label={`Go to recommendation ${idx + 1}`}
                                        />
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={goNext}
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white text-slate-700 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                                style={{ borderColor: BOARD_COLORS.grid }}
                                aria-label="Next recommendation"
                            >
                                <span className="text-xl">›</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Columna derecha: Plan de acción + Anomalías */}
                <div className="flex flex-col gap-4">
                    {/* Plan de acción */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Icon icon="mdi:clipboard-check" className="text-xl" style={{ color: BOARD_COLORS.mixed }} />
                                <h3 className="text-lg font-bold text-slate-900">Action Plan</h3>
                                {savedRecommendations.length > 0 && (
                                    <span className="px-2 py-0.5 text-xs rounded-full text-white font-bold" style={{ backgroundColor: BOARD_COLORS.it }}>
                                        {savedRecommendations.length}
                                    </span>
                                )}
                            </div>
                            {savedRecommendations.length > 0 && (
                                <button
                                    type="button"
                                    onClick={exportToCSV}
                                    className="px-4 py-2 rounded-xl font-medium text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2"
                                >
                                    <Icon icon="mdi:file-export" className="text-lg" />
                                    Export CSV
                                </button>
                            )}
                        </div>

                        {savedRecommendations.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-xl">
                                <Icon icon="mdi:bookmark-outline" className="text-5xl text-gray-300 mb-3" />
                                <h4 className="text-lg font-semibold text-slate-900 mb-2">No saved recommendations</h4>
                                <p className="text-sm text-gray-600 max-w-sm">
                                    Save recommendations from the catalog to create your personalized action plan.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                                {savedRecommendations.map((rec, idx) => {
                                    const style = getStyleForSavedRecommendation(rec);
                                    const completedTasks = rec.checklist.filter(t => t.checked).length;
                                    const totalTasks = rec.checklist.length;
                                    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                                    
                                    return (
                                        <div 
                                            key={rec.id} 
                                            className={`${style.bg} border-2 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer`}
                                            onClick={() => {
                                                setActiveSavedIndex(idx);
                                                setViewMode('saved');
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`shrink-0 w-10 h-10 rounded-lg ${style.iconBg} flex items-center justify-center`}>
                                                    <Icon icon={style.icon} className={`text-xl ${style.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-bold ${style.color} text-sm mb-1`}>
                                                        {rec.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                            rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                                                            rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {rec.priority === 'high' ? '▲ High' : rec.priority === 'medium' ? '■ Medium' : '▼ Low'}
                                                        </span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                                            rec.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                            rec.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                                            rec.status === 'on_hold' ? 'bg-gray-100 text-gray-700' :
                                                            'bg-orange-100 text-orange-700'
                                                        }`}>
                                                            {rec.status === 'completed' ? '● Completed' :
                                                             rec.status === 'in_progress' ? '◐ In progress' :
                                                             rec.status === 'on_hold' ? '◎ On hold' : '○ Pending'}
                                                        </span>
                                                    </div>
                                                    {totalTasks > 0 && (
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                                                <div 
                                                                    className="bg-emerald-500 h-full transition-all"
                                                                    style={{ width: `${progress}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-600 font-medium">
                                                                {completedTasks}/{totalTasks}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Anomalías detectadas */}
                    {anomalies.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                    <Icon icon="mdi:alert-octagon" className="text-xl text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Detected Anomalies</h3>
                                    <p className="text-xs text-gray-600">{anomalies.length} unusual patterns require attention</p>
                                </div>
                            </div>
                            
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {anomalies.map((anomaly, idx) => {
                                    const style = severityStyles[anomaly.severity] || severityStyles.medium;
                                    const isSaved = isAnomalySaved(anomaly);
                                    return (
                                        <div key={idx} className={`${style.bg} ${style.border} rounded-lg p-3 hover:shadow-sm transition-shadow border`}>
                                            <div className="flex items-start gap-2">
                                                <div className={`shrink-0 w-8 h-8 rounded-md ${style.iconBg} flex items-center justify-center`}>
                                                    <Icon icon={style.icon} className={`text-lg ${style.text}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className={`font-semibold ${style.text} text-sm`}>{anomaly.title}</h4>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${style.iconBg} ${style.text} font-bold uppercase`}>
                                                            {anomaly.severity}
                                                        </span>
                                                    </div>
                                                    <p className={`text-xs ${style.text} opacity-90 leading-relaxed mb-2`}>
                                                        {anomaly.description}
                                                    </p>
                                                    <div className="flex items-center justify-between gap-2">
                                                        {anomaly.timestamp && (
                                                            <div className="flex items-center gap-1">
                                                                <Icon icon="mdi:clock-outline" className={`text-xs ${style.text} opacity-70`} />
                                                                <span className={`text-xs ${style.text} opacity-70`}>{anomaly.timestamp}</span>
                                                            </div>
                                                        )}
                                                        <button
                                                            onClick={() => saveAnomaly(anomaly)}
                                                            disabled={isSaved}
                                                            className={`px-3 py-1 rounded-md text-xs font-semibold transition-all flex items-center gap-1 ${
                                                                isSaved
                                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                                    : 'bg-white hover:bg-gray-50 text-red-700 hover:shadow-sm border border-red-300'
                                                            }`}
                                                        >
                                                            <Icon icon={isSaved ? "mdi:check-circle" : "mdi:clipboard-plus"} className="text-sm" />
                                                            {isSaved ? 'Saved' : 'Save'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Vista detallada de recomendación guardada (modal expandido) */}
            {viewMode === 'saved' && savedRecommendations.length > 0 && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setViewMode('all')}>
                    <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-700 px-6 py-4 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Icon icon="mdi:clipboard-check" className="text-2xl text-white" />
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Action Plan Detail</h3>
                                                <p className="text-xs text-slate-300">
                                                    {activeSavedIndex + 1} of {savedRecommendations.length}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('all')}
                                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                                        >
                                            <Icon icon="mdi:close" className="text-xl text-white" />
                                        </button>
                                    </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeSavedIndex}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {(() => {
                                            const currentSaved = savedRecommendations[activeSavedIndex];

                                            if (!currentSaved) {
                                                return null;
                                            }

                                            const style = getStyleForSavedRecommendation(currentSaved);
                                            return (
                                                <div className="space-y-6">
                                                    {/* Header de recomendación */}
                                                    <div className={`${style.bg} border-2 rounded-xl p-4`}>
                                                        <div className="flex items-start gap-3">
                                                            <div className={`shrink-0 w-12 h-12 rounded-lg ${style.iconBg} flex items-center justify-center shadow-sm`}>
                                                                <Icon icon={style.icon} className={`text-2xl ${style.color}`} />
                                                            </div>
                                                            <div className="flex-1">
                                                                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${style.color} bg-white shadow-sm inline-block mb-1`}>
                                                                    {style.label}
                                                                </span>
                                                                <h4 className="text-xl font-bold text-slate-900 mb-1">
                                                                    {currentSaved.title}
                                                                </h4>
                                                                <p className="text-sm text-slate-700 leading-relaxed">
                                                                    {currentSaved.description}
                                                                </p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeSavedRecommendation(currentSaved.id)}
                                                                className="shrink-0 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                                            >
                                                                <Icon icon="mdi:trash-can" className="text-base" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Métricas profesionales */}
                                                    <div className="grid grid-cols-4 gap-3">
                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                                <Icon icon="mdi:flag-variant" className="text-base" />
                                                                Priority
                                                            </label>
                                                            <select
                                                                value={currentSaved.priority}
                                                                onChange={(e) => updatePriority(currentSaved.id, e.target.value as 'high' | 'medium' | 'low')}
                                                                className="w-full px-2 py-1.5 text-sm font-semibold border-0 rounded-lg focus:ring-2 focus:ring-slate-900 cursor-pointer bg-white"
                                                            >
                                                                <option value="high">▲ High</option>
                                                                <option value="medium">■ Medium</option>
                                                                <option value="low">▼ Low</option>
                                                            </select>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                                <Icon icon="mdi:progress-check" className="text-base" />
                                                                Status
                                                            </label>
                                                            <select
                                                                value={currentSaved.status}
                                                                onChange={(e) => updateStatus(currentSaved.id, e.target.value as any)}
                                                                className="w-full px-2 py-1.5 text-sm font-semibold border-0 rounded-lg focus:ring-2 focus:ring-slate-900 cursor-pointer bg-white"
                                                            >
                                                                <option value="pending">○ Pending</option>
                                                                <option value="in_progress">◐ In progress</option>
                                                                <option value="completed">● Completed</option>
                                                                <option value="on_hold">◎ On hold</option>
                                                            </select>
                                                        </div>

                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                                <Icon icon="mdi:calendar-clock" className="text-base" />
                                                                Deadline
                                                            </label>
                                                            <input
                                                                type="date"
                                                                value={currentSaved.deadline}
                                                                onChange={(e) => updateDeadline(currentSaved.id, e.target.value)}
                                                                className="w-full px-2 py-1.5 text-sm border-0 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
                                                            />
                                                        </div>

                                                        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                                                                <Icon icon="mdi:account-tie" className="text-base" />
                                                                Responsible
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={currentSaved.responsible}
                                                                onChange={(e) => updateResponsible(currentSaved.id, e.target.value)}
                                                                placeholder="Assign..."
                                                                className="w-full px-2 py-1.5 text-sm border-0 rounded-lg focus:ring-2 focus:ring-slate-900 bg-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Detalles de anomalía (solo si es una anomalía) */}
                                                    {/* Plan de implementación */}
                                                    <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl border-2 border-slate-200 p-4">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <Icon icon="mdi:clipboard-text" className="text-xl text-slate-700" />
                                                            <h4 className="font-semibold text-slate-900 text-base">Implementation Plan</h4>
                                                        </div>

                                                        <div className="space-y-3">
                                                            {/* Notas */}
                                                            <div>
                                                                <label className="text-sm font-medium text-gray-700 mb-1 block flex items-center gap-2">
                                                                    <Icon icon="mdi:note-text" className="text-sm" />
                                                                    Strategic notes
                                                                </label>
                                                                <textarea
                                                                    value={currentSaved.note}
                                                                    onChange={(e) => updateNote(currentSaved.id, e.target.value)}
                                                                    placeholder="Context, suppliers, stakeholders involved, identified risks..."
                                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none bg-white"
                                                                    rows={3}
                                                                />
                                                            </div>

                                                            {/* Checklist */}
                                                            <div>
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                                        <Icon icon="mdi:format-list-checks" className="text-base" />
                                                                        Implementation milestones ({currentSaved.checklist.filter(i => i.checked).length}/{currentSaved.checklist.length})
                                                                    </label>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => addChecklistItem(currentSaved)}
                                                                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                                                                    >
                                                                        <Icon icon="mdi:plus-circle" className="text-lg" />
                                                                        New milestone
                                                                    </button>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {currentSaved.checklist.map(item => (
                                                                        <div key={item.id} className="flex items-center gap-3 group bg-white rounded-lg border border-gray-200 px-4 py-3 hover:shadow-sm transition-shadow">
                                                                            <input
                                                                                type="text"
                                                                                value={item.text}
                                                                                onChange={(e) => updateChecklistItem(currentSaved, item.id, e.target.value)}
                                                                                placeholder="E.g.: Approve budget, hire supplier, install equipment..."
                                                                                className={`flex-1 px-0 py-0 text-sm border-0 focus:ring-0 bg-transparent ${
                                                                                    item.checked ? 'line-through text-gray-400' : 'text-gray-900'
                                                                                }`}
                                                                            />
                                                                            <div className="flex items-center gap-2 shrink-0">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => toggleChecklistItem(currentSaved, item.id)}
                                                                                    className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                                                                        item.checked 
                                                                                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                                    }`}
                                                                                >
                                                                                    {item.checked ? '✓ Completed' : 'Complete'}
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeChecklistItem(currentSaved, item.id)}
                                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 p-1"
                                                                                >
                                                                                    <Icon icon="mdi:trash-can" className="text-lg" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                    {currentSaved.checklist.length === 0 && (
                                                                        <p className="text-sm text-gray-400 italic py-3 text-center bg-gray-50 rounded-lg">
                                                                            Define key milestones for implementation tracking
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Footer con navegación */}
                            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setActiveSavedIndex((prev: number) => (prev - 1 + savedRecommendations.length) % savedRecommendations.length)}
                                    className="px-4 py-2 rounded-xl font-medium text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2"
                                >
                                    <Icon icon="mdi:chevron-left" className="text-xl" />
                                    Previous
                                </button>
                                <span className="text-sm text-gray-600">
                                    {activeSavedIndex + 1} of {savedRecommendations.length}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setActiveSavedIndex((prev: number) => (prev + 1) % savedRecommendations.length)}
                                    className="px-4 py-2 rounded-xl font-medium text-slate-700 bg-white border border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all flex items-center gap-2"
                                >
                                    Next
                                    <Icon icon="mdi:chevron-right" className="text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardRecommendations;