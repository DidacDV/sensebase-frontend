import { useState } from "react";
import { useNavigate } from 'react-router';
import {AnimatePresence, motion } from 'framer-motion';
import {Loader2, Mail, Lock, AlertCircle, CheckCircle, Check} from 'lucide-react';
import { authApi } from "@src/services/authentication.ts";
import type {RegisterCredentials} from "@src/types/authenticationModel.ts";

export default function RegisterPage() {
    const [formData, setFormData] = useState<RegisterCredentials>({
        email: '',
        password: '',
        password_confirm: ''
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const isLengthValid = formData.password.length >= 8;
    const isMatchValid = formData.password.length > 0 && formData.password === formData.password_confirm;
    const canSubmit = formData.email && isLengthValid && isMatchValid;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!canSubmit) {
            return;
        }

        setIsLoading(true);

        try {
            await authApi.register(formData);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Create Account
                    </h1>
                    <p className="text-slate-600">
                        Join SenseBase today
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {/* Error Message */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 overflow-hidden"
                            >
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                                    <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                Email address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                                        formData.password && !isLengthValid
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="password_confirm" className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <CheckCircle size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="password_confirm"
                                    type="password"
                                    value={formData.password_confirm}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                                        formData.password_confirm && !isMatchValid
                                            ? 'border-red-300 focus:ring-red-200 focus:border-red-500'
                                            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Visual Validators */}
                        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                Password Requirements
                            </p>

                            {/* Length Validator */}
                            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                                isLengthValid ? 'text-green-600' : 'text-slate-500'
                            }`}>
                                {isLengthValid ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                )}
                                <span>At least 8 characters</span>
                            </div>

                            {/* Match Validator */}
                            <div className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                                isMatchValid ? 'text-green-600' : 'text-slate-500'
                            }`}>
                                {isMatchValid ? (
                                    <Check size={16} className="text-green-600" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                                )}
                                <span>Passwords match</span>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || !canSubmit}
                            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                        >
                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                            {isLoading ? 'Creating account...' : 'Sign up'}
                        </button>
                    </form>

                    {/* Forgot Password Link */}
                    <div className="mt-6 text-center">
                        <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                            Forgot your password?
                        </a>
                    </div>
                </div>

                {/* Login Link */}
                <p className="text-center mt-6 text-slate-600">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign in
                    </a>
                </p>
            </motion.div>
        </div>
    );
}