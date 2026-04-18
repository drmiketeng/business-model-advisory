import React, { useState, useEffect, useRef } from 'react';
import { decode, decodeAudioData } from '../utils';
import { PlayIcon, PauseIcon } from './icons';

interface AudioPlayerProps {
    base64Audio: string | null;
    script: string;
    isLoading: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ base64Audio, script, isLoading }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [generationProgress, setGenerationProgress] = useState(0);

    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioBufferRef = useRef<AudioBuffer | null>(null);
    const startTimeRef = useRef<number>(0);
    const animationFrameRef = useRef<number>(0);
    const generationIntervalRef = useRef<number>(0);

    // Simulated generation progress bar
    useEffect(() => {
        if (isLoading) {
            setGenerationProgress(0);
            generationIntervalRef.current = window.setInterval(() => {
                setGenerationProgress(prev => {
                    // Slow down as it approaches 90%
                    if (prev >= 90) return prev;
                    return prev + (Math.random() * 5);
                });
            }, 500);
        } else {
            if (generationIntervalRef.current) {
                clearInterval(generationIntervalRef.current);
            }
            setGenerationProgress(100);
        }

        return () => {
            if (generationIntervalRef.current) {
                clearInterval(generationIntervalRef.current);
            }
        };
    }, [isLoading]);
    
    useEffect(() => {
        if (base64Audio) {
            const setupAudio = async () => {
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                }
                const ctx = audioContextRef.current;
                const decodedData = decode(base64Audio);
                const buffer = await decodeAudioData(decodedData, ctx, 24000, 1);
                audioBufferRef.current = buffer;
            };
            setupAudio();
        }

        return () => {
          // Cleanup on component unmount or when audio changes
          sourceRef.current?.stop();
          cancelAnimationFrame(animationFrameRef.current);
        };
    }, [base64Audio]);

    const updateProgress = () => {
        if (isPlaying && audioContextRef.current && audioBufferRef.current) {
            const elapsedTime = audioContextRef.current.currentTime - startTimeRef.current;
            const newProgress = (elapsedTime / audioBufferRef.current.duration) * 100;
            setProgress(newProgress > 100 ? 100 : newProgress);
            if (newProgress < 100) {
              animationFrameRef.current = requestAnimationFrame(updateProgress);
            } else {
              setIsPlaying(false);
              setProgress(0);
            }
        }
    };

    const handlePlayPause = () => {
        if (!audioBufferRef.current || !audioContextRef.current) return;
        
        if (isPlaying) {
            sourceRef.current?.stop();
            cancelAnimationFrame(animationFrameRef.current);
            setIsPlaying(false);
        } else {
            const ctx = audioContextRef.current;
            const source = ctx.createBufferSource();
            source.buffer = audioBufferRef.current;
            source.connect(ctx.destination);
            
            source.onended = () => {
                setIsPlaying(false);
                setProgress(0);
                cancelAnimationFrame(animationFrameRef.current);
            };

            source.start(0);
            sourceRef.current = source;
            startTimeRef.current = ctx.currentTime;
            
            setIsPlaying(true);
            animationFrameRef.current = requestAnimationFrame(updateProgress);
        }
    };
    
    if (isLoading) {
        return (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-lg text-purple-800">Generating Prayer...</h4>
                    <span className="text-xs font-semibold text-purple-600">{Math.round(generationProgress)}%</span>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out" 
                        style={{ width: `${generationProgress}%` }}
                    ></div>
                </div>
                 <p className="text-sm text-purple-700">Creating a personalized audio prayer based on your report.</p>
            </div>
        )
    }

    if (!base64Audio) {
        return null;
    }

    return (
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h4 className="font-bold text-lg text-purple-800 mb-3">A Prayer for Guidance</h4>
            <div className="flex items-center gap-4">
                <button onClick={handlePlayPause} className="text-purple-600 hover:text-purple-800">
                    {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>
                <div className="w-full bg-purple-200 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <p className="text-sm text-purple-700 mt-3 italic">{script}</p>
        </div>
    );
};

export default AudioPlayer;