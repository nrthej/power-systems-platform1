'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Zap, Mail, Lock } from 'lucide-react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ErrorAlert, SuccessAlert } from '@/components/ui/Alert';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: 'admin@powertech.com',
    password: 'PowerAdmin2024!'
  });
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false
      });

      if (result?.error) {
        // Handle different types of authentication errors
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Invalid email or password. Please check your credentials and try again.');
            break;
          case 'CallbackRouteError':
            setError('Authentication failed. Please try again.');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      } else if (result?.ok) {
        // Successful login
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Small delay to show success message
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError('Unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
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

          {/* Error Alert */}
          {error && (
            <div className="mb-4">
              <ErrorAlert 
                message={error}
                closable={true}
                onClose={() => setError('')}
              />
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="mb-4">
              <SuccessAlert 
                message={success}
              />
            </div>
          )}

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
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 ${
                    error ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="admin@powertech.com"
                  required
                  disabled={isLoading}
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
                  className={`w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-800 placeholder-slate-500 ${
                    error ? 'border-red-300 bg-red-50' : ''
                  }`}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-slate-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-lg disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-sm text-slate-500">Test Credentials</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-600 mb-2">For testing:</p>
            <div className="space-y-1">
              <p className="text-sm font-mono text-slate-700">admin@powertech.com</p>
              <p className="text-sm font-mono text-slate-700">PowerAdmin2024!</p>
            </div>
            <p className="text-xs text-slate-500 mt-2">Try wrong credentials to see error handling</p>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-500">
            Need an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              Contact your administrator
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}