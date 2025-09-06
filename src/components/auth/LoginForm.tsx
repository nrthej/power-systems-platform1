'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    
    // Simulate login success and redirect
    // In a real app, you'd validate credentials here
    if (formData.email && formData.password) {
      // For now, just redirect by changing the page
      window.location.href = '/dashboard';
    } else {
      alert('Please enter both email and password');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-slate-100/50"></div>
      
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Power Systems</h1>
          <p className="text-slate-600">Project Management Platform</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-2">Welcome back</h2>
            <p className="text-slate-600 text-sm">Please sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-500">or</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="space-y-3">
            <button type="button" className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700">
              <span className="w-5 h-5 mr-3 text-blue-600">G</span>
              Continue with Google
            </button>

            <button type="button" className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-slate-700">
              <span className="w-5 h-5 mr-3 text-blue-600">M</span>
              Continue with Microsoft
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Need an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact your administratorto
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}