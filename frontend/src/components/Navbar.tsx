"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500">
                Atelier Rayner
              </span>
              <span className="text-xs bg-zinc-800 text-amber-400 px-2 py-0.5 rounded-full font-mono group-hover:bg-amber-500 group-hover:text-black transition-colors">
                Chef Suite
              </span>
            </Link>
          </div>
          <div className="hidden sm:block">
            <div className="flex space-x-8">
              <Link 
                href="/" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Portfolio
              </Link>
              <Link 
                href="/recipes" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/recipes') ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Recipes
              </Link>
              <Link 
                href="/ingredients" 
                className={`text-sm font-medium transition-colors ${
                  isActive('/ingredients') ? 'text-amber-400 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ingredients
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900 px-2.5 py-1 rounded-full hidden sm:inline-block font-mono">
                  ● Admin Session
                </span>
                <button
                  onClick={logout}
                  className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 px-3.5 py-1.5 rounded-full font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black px-4 py-2 rounded-full font-bold transition-all shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-105"
              >
                Chef Login
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation links */}
      <div className="sm:hidden border-t border-zinc-900 bg-zinc-950 px-4 py-2 flex justify-around">
        <Link 
          href="/" 
          className={`text-xs font-medium transition-colors ${
            isActive('/') ? 'text-amber-400' : 'text-zinc-500'
          }`}
        >
          Portfolio
        </Link>
        <Link 
          href="/recipes" 
          className={`text-xs font-medium transition-colors ${
            isActive('/recipes') ? 'text-amber-400' : 'text-zinc-500'
          }`}
        >
          Recipes
        </Link>
        <Link 
          href="/ingredients" 
          className={`text-xs font-medium transition-colors ${
            isActive('/ingredients') ? 'text-amber-400' : 'text-zinc-500'
          }`}
        >
          Ingredients
        </Link>
      </div>
    </nav>
  );
}
