import React, { useState, useEffect } from 'react';
import type { Score } from '../types';
import { generateTargetedPrayerAudio } from '../services/geminiService';
import AudioPlayer from './AudioPlayer';

interface ResultsDashboardProps {
  scores: Score[];
  report: string;
  isLoading: boolean;
  error: string | null;
  reportType: 'faith' | 'non-faith' | null;
}

const formatReportToHtml = (markdown: string) => {
    if (!markdown) return '';

    // Clean up raw markdown symbols and ensure standard spacing
    let cleanMarkdown = markdown
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold Italics replacement
        .replace(/###\s/g, '') // Remove ### text markers if they persist
        .replace(/##\s/g, '') // Remove ## text markers if they persist
        .replace(/#\s/g, ''); // Remove # text markers if they persist

    // Split into paragraphs/blocks by one or more empty lines
    const blocks = markdown.split(/\n\s*\n/);

    const htmlBlocks = blocks.map(block => {
        let trimmedBlock = block.trim();
        if (!trimmedBlock) return '';

        // Headings (handle with and without space)
        if (trimmedBlock.startsWith('###')) {
            const content = trimmedBlock.startsWith('### ') ? trimmedBlock.substring(4) : trimmedBlock.substring(3);
            return `<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3 border-b-0">${content.replace(/\*/g, '')}</h3>`;
        }
        if (trimmedBlock.startsWith('##')) {
            const content = trimmedBlock.startsWith('## ') ? trimmedBlock.substring(3) : trimmedBlock.substring(2);
            return `<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4 border-b border-slate-300 pb-2">${content.replace(/\*/g, '')}</h2>`;
        }
        if (trimmedBlock.startsWith('#')) {
            const content = trimmedBlock.startsWith('# ') ? trimmedBlock.substring(2) : trimmedBlock.substring(1);
            return `<h1 class="text-3xl font-extrabold text-slate-900 mb-8 text-center">${content.replace(/\*/g, '')}</h1>`;
        }

        // Lists (Handle numbered 1. and bullet * or -)
        if (trimmedBlock.match(/^(\d+\.|[\*\-])\s/)) {
            const lines = trimmedBlock.split('\n');
            const listItems = lines.map(item => {
                // Remove the marker (1., *, -)
                const content = item.replace(/^(\d+\.|[\*\-])\s+/, '').trim();
                if (!content) return '';
                // Handle bolding within list items
                const formattedContent = content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>')
                    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
                return `<li class="ml-4 mb-3 pl-2 border-l-2 border-slate-200 text-slate-700">${formattedContent}</li>`;
            }).join('');
            
            // Detect if it's numbered or unordered
            const isOrdered = trimmedBlock.match(/^\d+\./);
            return isOrdered 
                ? `<ol class="list-decimal pl-5 space-y-2 mb-6">${listItems}</ol>` 
                : `<ul class="list-disc pl-5 space-y-2 mb-6">${listItems}</ul>`;
        }

        // Paragraphs
        const pContent = trimmedBlock
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900">$1</strong>') // Bold with darker color
            .replace(/\n/g, '<br />'); // Line breaks within paragraph

        return `<p class="mb-5 text-slate-700 leading-relaxed text-lg">${pContent}</p>`;
    });

    return htmlBlocks.join('');
};


const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ scores, report, isLoading, error, reportType }) => {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [prayerScript, setPrayerScript] = useState<string>('');
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    // Logic to generate prayer audio if it's a faith report and report is done
    if (reportType === 'faith' && report && !isLoading) {
        // Unique key for caching based on report length and first score
        const cacheKey = `prayer_cache_${report.length}_${scores[0]?.score || 0}`;
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            try {
                const { audio, script } = JSON.parse(cachedData);
                if (audio && script) {
                    setAudioUrl(audio);
                    setPrayerScript(script);
                    return;
                }
            } catch (e) {
                console.error("Error reading cache", e);
            }
        }

        // If not in cache, generate it
        setIsAudioLoading(true);
        generateTargetedPrayerAudio(scores, report)
            .then(({ audio, script }) => {
                setAudioUrl(audio);
                setPrayerScript(script);
                localStorage.setItem(cacheKey, JSON.stringify({ audio, script }));
            })
            .catch(err => {
                console.error("Failed to generate prayer audio:", err);
            })
            .finally(() => {
                setIsAudioLoading(false);
            });
    }
  }, [report, reportType, scores, isLoading]);


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-800">Generating Your Report...</h2>
        <p className="text-slate-600 mt-2">Our AI is analyzing your business model. This may take a moment.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border-2 border-red-200 rounded-lg min-h-[400px]">
        <h2 className="text-2xl font-bold text-red-700">An Error Occurred</h2>
        <p className="text-red-600 mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6">
      
       {reportType === 'faith' && (
        <div className="mb-8 transition-all duration-500 ease-in-out">
            <AudioPlayer 
              base64Audio={audioUrl}
              script={prayerScript}
              isLoading={isAudioLoading}
            />
        </div>
      )}

      <div className="prose prose-slate max-w-4xl mx-auto p-6 sm:p-10 bg-white rounded-xl border border-slate-200 shadow-lg">
        <div dangerouslySetInnerHTML={{ __html: formatReportToHtml(report) }} />
      </div>
    </div>
  );
};

export default ResultsDashboard;