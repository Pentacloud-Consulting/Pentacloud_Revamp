'use client';

import { useState, useEffect } from 'react';
import { FileCode2 } from 'lucide-react';
import { ViewXML } from './View XML';

export function SitemapViewer() {
  // Supabase is the single source of truth. Always fetch fresh to avoid showing outdated/mocked caches.
  const [sitemapData, setSitemapData] = useState<Array<{ url: string, lastMod: string, changeFreq: string, priority: string }>>([]);
  const [rawXml, setRawXml] = useState<string>('');
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [loading, setLoading] = useState(false); // false = no blocking spinner on mount
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    fetch('/sitemap.xml')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sitemap');
        return res.text();
      })
      .then(text => {
        setRawXml(text);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        const urls = Array.from(xmlDoc.getElementsByTagName('url')).map(node => {
          return {
            url: node.getElementsByTagName('loc')[0]?.textContent || '',
            lastMod: node.getElementsByTagName('lastmod')[0]?.textContent || '-',
            changeFreq: node.getElementsByTagName('changefreq')[0]?.textContent || '-',
            priority: node.getElementsByTagName('priority')[0]?.textContent || '-'
          };
        });
        setSitemapData(urls);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error loading sitemap. Make sure the site is running and sitemap.ts is compiling.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Sitemap Viewer</h2>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-gray-600 border-b pb-4">
          <FileCode2 size={20} />
          <span>This view shows the live output of your auto-generated <code>sitemap.xml</code>. Static routes and published blogs are automatically included.</span>
        </div>
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p>Scanning live sitemap...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">URL Path</th>
                  <th className="px-4 py-3 font-semibold">Last Modified</th>
                  <th className="px-4 py-3 font-semibold">Change Freq</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sitemapData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-blue-600">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {item.url.replace(/^https?:\/\/[^\/]+/, '')}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {item.lastMod !== '-' ? new Date(item.lastMod).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">{item.changeFreq}</td>
                    <td className="px-4 py-3 text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        Number(item.priority) >= 0.8 ? 'bg-green-100 text-green-700' :
                        Number(item.priority) >= 0.5 ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
              <p>Total indexed pages: <strong className="text-gray-900">{sitemapData.length}</strong></p>
              <button 
                onClick={() => setIsViewerOpen(true)}
                className="text-blue-600 hover:underline font-medium"
              >
                View Raw XML &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      <ViewXML 
        isOpen={isViewerOpen} 
        onClose={() => setIsViewerOpen(false)} 
        xmlContent={rawXml} 
      />
    </div>
  );
}
