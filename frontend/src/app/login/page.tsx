"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/recipes');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    try {
      const success = await login(password);
      if (success) {
        router.push('/recipes');
      } else {
        setError('Invalid admin password.');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 font-sans text-zinc-100 items-center justify-center p-4">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03),transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-900 rounded-3xl p-8 backdrop-blur-md relative shadow-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="text-sm font-semibold text-zinc-500 hover:text-zinc-300 transition-colors">
            &larr; Back to Portfolio
          </Link>
          <h2 className="mt-4 text-3xl font-extrabold text-white tracking-tight">
            Chef Administration
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Please enter your API Key/Password to manage your portfolio recipes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-2">
              Password / API Key
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3.5 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {error && (
            <div className="text-sm bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold py-3.5 px-4 rounded-2xl transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
