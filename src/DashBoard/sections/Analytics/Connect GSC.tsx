'use client';
import { useState } from 'react';
import { LineChart, BarChart2, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConnectGSCProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function ConnectGSCModal({ isOpen, onClose, onConnect }: ConnectGSCProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isOpen) return null;

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate OAuth and API connection delay
    setTimeout(() => {
      setIsConnecting(false);
      onConnect();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm mx-auto">
            <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h4l3-9 5 18 3-9h5"/>
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Connect Search Console</h3>
          <p className="text-gray-500 text-sm text-center mb-8">
            Link your Google Search Console account to unlock live organic traffic data and real-time SEO insights.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5">
                <LineChart size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Real Organic Traffic</h4>
                <p className="text-xs text-gray-500 mt-1">See actual clicks, impressions, and CTR directly from Google Search instead of estimates.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg shrink-0 mt-0.5">
                <BarChart2 size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Live Keyword Rankings</h4>
                <p className="text-xs text-gray-500 mt-1">Track the exact position of your keywords on Google search results pages automatically.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5">
                <AlertCircle size={18} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Index & Crawl Errors</h4>
                <p className="text-xs text-gray-500 mt-1">Instantly detect if Google is having trouble finding or reading your blog posts.</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                isConnecting ? 'bg-blue-100 text-blue-500 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
              }`}
            >
              {isConnecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Connecting to Google...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              disabled={isConnecting}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-gray-500 text-sm hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
