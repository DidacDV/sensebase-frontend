import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { Plus, LayoutDashboard, Calendar, Cpu, Loader2, AlertCircle } from 'lucide-react';
import { useBoards } from '@src/services/boardService';

export default function BoardsListPage() {
    const navigate = useNavigate();
    const { data: boards, isLoading, isError, error } = useBoards();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                    <div className="flex items-center gap-3 text-red-600 mb-4">
                        <AlertCircle size={24} />
                        <h2 className="text-lg font-semibold">Error loading boards</h2>
                    </div>
                    <p className="text-slate-600">{error?.message || 'Something went wrong'}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
            <div className="max-w-7xl mx-auto px-8 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Boards</h1>
                        <p className="text-slate-600">Manage and view your analytics dashboards</p>
                    </div>
                    <button
                        onClick={() => navigate('/boards/new')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Plus size={20} />
                        New Board
                    </button>
                </div>

                {/* Boards Grid */}
                {boards && boards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {boards.map((board, idx) => (
                            <motion.div
                                key={board.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                onClick={() => navigate(`/boards/${board.id}`)}
                                className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <LayoutDashboard size={24} className="text-blue-600" />
                                    </div>
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                        {board.data_provider}
                                    </span>
                                </div>

                                <h3 className="text-lg font-semibold text-slate-800 mb-2">{board.name}</h3>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                    {board.description || 'No description'}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <Cpu size={14} />
                                        <span>{board.ai_model}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        <span>{new Date(board.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg p-12 text-center"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LayoutDashboard size={32} className="text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">No boards yet</h3>
                        <p className="text-slate-600 mb-6">Create your first board to get started</p>
                        <button
                            onClick={() => navigate('/boards/new')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                        >
                            Create Board
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}