'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, Check } from 'lucide-react';

export function RankTracking({ lineData = [], pieData = [], stats = {}, timeRange = '30d', onTimeRangeChange }: any) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const timeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '3m', label: 'Last 3 months' },
    { value: '6m', label: 'Last 6 months' },
  ];

  const currentLabel = timeOptions.find(o => o.value === timeRange)?.label || 'Last 30 days';
  const diffAvg = (stats.oldAvg - stats.currentAvg) || 0;
  const isUp = diffAvg > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full w-full">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-200 bg-gray-50/50 gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-gray-800 uppercase">Showing Rankings For:</span>
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center justify-between w-36 px-3 py-1.5 bg-white border rounded text-sm transition-all shadow-sm ${
                isDropdownOpen 
                  ? 'border-blue-500 ring-2 ring-blue-500/30 text-blue-700' 
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {currentLabel}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-500' : 'text-gray-400'}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-40 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                {timeOptions.map((opt) => (
                  <div 
                    key={opt.value}
                    onClick={() => {
                      if (onTimeRangeChange) onTimeRangeChange(opt.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                      timeRange === opt.value 
                        ? 'bg-blue-50 text-blue-700 font-bold' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                    {timeRange === opt.value && <Check size={14} className="text-blue-600" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Dynamic SEO Tracker</span>
        </div>
      </div>

      {/* Stats Blocks */}
      <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4">
        <div className="px-6 py-4 bg-white border border-gray-100 rounded shadow-sm text-center flex-1 sm:flex-none">
          <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
            {stats.up || 0} {stats.up > 0 && <span className="text-emerald-400 text-lg">▲</span>}
          </div>
          <div className="text-xs text-gray-500 mt-1">Keywords<br/>moved up</div>
        </div>
        <div className="px-6 py-4 bg-white border border-gray-100 rounded shadow-sm text-center flex-1 sm:flex-none">
          <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
            {stats.down || 0} {stats.down > 0 && <span className="text-red-400 text-lg">▼</span>}
          </div>
          <div className="text-xs text-gray-500 mt-1">Keywords<br/>moved down</div>
        </div>
        <div className="px-6 py-4 bg-white border border-gray-100 rounded shadow-sm text-center flex-1 sm:flex-none">
          <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
            {stats.unchanged || 0}
          </div>
          <div className="text-xs text-gray-500 mt-1">Keywords<br/>unchanged</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        {/* Line Chart */}
        <div>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-sm font-bold text-gray-800 uppercase flex items-center gap-2">
              Average Position 
              <span className="text-gray-400 text-xs bg-gray-100 rounded-full w-4 h-4 inline-flex items-center justify-center">?</span>
            </h3>
            <div className="text-right flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-400">
                {stats.oldAvg?.toFixed(2) || '0.00'} <span className="text-sm font-normal">→</span>
              </span>
              <span className="text-4xl font-black text-gray-900">
                {stats.currentAvg?.toFixed(2) || '0.00'}
              </span>
              <span className={`text-sm font-bold ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                {isUp ? '▲' : '▼'}{Math.abs(diffAvg).toFixed(2)}
              </span>
            </div>
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 5, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                <YAxis reversed axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={{ r: 3, fill: '#fff', stroke: '#2563EB', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div>
          <h3 className="text-sm font-bold text-gray-800 uppercase mb-6 flex items-center gap-2">
            Current Search Result Rankings 
            <span className="text-gray-400 text-xs bg-gray-100 rounded-full w-4 h-4 inline-flex items-center justify-center">?</span>
          </h3>
          <div className="flex items-center">
            <div className="w-[150px] h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 ml-8 space-y-4">
              {pieData.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 pb-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-gray-400">
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
