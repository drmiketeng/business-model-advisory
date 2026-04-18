import React, { useState, useMemo, useCallback } from 'react';
import { LEAN_CANVAS_DIMENSIONS, DEFAULT_WEIGHTS } from './constants';
import QuestionCard from './components/QuestionCard';
import WeightingEditor from './components/WeightingEditor';
import ResultsDashboard from './components/ResultsDashboard';
import VirtualAssistant from './components/VirtualAssistant';
import Disclaimer from './components/Disclaimer';
import { generateReport } from './services/geminiService';
import type { Answer, Score } from './types';
import { BusinessIcon, StartIcon, HomeIcon, ChatIcon, FeedbackIcon, PlayIcon } from './components/icons';

const sampleData = {
  businessModel: "Our business, 'Green Bean Box', is a monthly subscription service delivering ethically sourced, single-origin coffee beans to environmentally conscious consumers. Our unique value is our 100% compostable packaging and direct-trade relationship with small farms, ensuring freshness and sustainability.",
  answers: {
    'problem': { selectedChoiceIndex: 2, rating: 2 },
    'customer-segments': { selectedChoiceIndex: 2, rating: 1 },
    'unique-value-proposition': { selectedChoiceIndex: 2, rating: 1 },
    'solution': { selectedChoiceIndex: 2, rating: 2 },
    'channels': { selectedChoiceIndex: 1, rating: 3 },
    'revenue-streams': { selectedChoiceIndex: 2, rating: 2 },
    'cost-structure': { selectedChoiceIndex: 0, rating: 4 },
    'key-metrics': { selectedChoiceIndex: 1, rating: 3 },
    'unfair-advantage': { selectedChoiceIndex: 2, rating: 2 },
  },
  additionalInfo: "We've recently secured a seed funding round of $500,000 which we plan to use for marketing and expanding our roaster partnerships. However, we're facing increased competition from larger coffee subscription services that are starting to offer 'ethical' lines."
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [businessModel, setBusinessModel] = useState('');
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [weights, setWeights] = useState<Record<string, number>>(DEFAULT_WEIGHTS);
  const [reportType, setReportType] = useState<'faith' | 'non-faith' | null>(null);
  const [report, setReport] = useState<string>('');
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const totalSteps = LEAN_CANVAS_DIMENSIONS.length;

  const handleUpdateAnswer = (id: string, answer: Answer) => {
    setAnswers((prev) => ({ ...prev, [id]: answer }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps + 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setCurrentStep(-1); // Start at the welcome screen
  };

  const goToHome = () => {
    setBusinessModel('');
    setAnswers({});
    setAdditionalInfo('');
    setWeights(DEFAULT_WEIGHTS);
    setReport('');
    setScores([]);
    setReportType(null);
    setCurrentStep(-1);
  }

  const loadSampleData = () => {
    setBusinessModel(sampleData.businessModel);
    setAnswers(sampleData.answers as Record<string, Answer>);
    setAdditionalInfo(sampleData.additionalInfo);
    setCurrentStep(0);
  };

  const handleGenerateReport = useCallback(async (selectedReportType: 'faith' | 'non-faith') => {
    if (!businessModel.trim()) {
      setError("Please describe your business model before generating a report.");
      setCurrentStep(0);
      return;
    }
    setReportType(selectedReportType);
    setCurrentStep(totalSteps + 4);
    setIsLoading(true);
    setError(null);

    const calculatedScores = LEAN_CANVAS_DIMENSIONS.map(dim => {
        const answer = answers[dim.id] || { selectedChoiceIndex: null, rating: 3 };
        const weight = weights[dim.pFactor.toLowerCase()] || 11;
        const weightedScore = answer.rating * (weight / 100) * 5;
        const choiceText = answer.selectedChoiceIndex !== null && dim.choices[answer.selectedChoiceIndex]
          ? dim.choices[answer.selectedChoiceIndex]
          : "No answer provided.";

        return {
            name: dim.name,
            score: answer.rating,
            weightedScore: parseFloat(weightedScore.toFixed(2)),
            pFactor: dim.pFactor,
            qualitative: choiceText,
        };
    });
    setScores(calculatedScores);

    try {
        const generatedReport = await generateReport(businessModel, calculatedScores, selectedReportType, additionalInfo);
        setReport(generatedReport);
    } catch (e) {
        console.error(e);
        setError('Failed to generate report. The AI service may be temporarily unavailable. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  }, [answers, weights, businessModel, totalSteps, additionalInfo]);

  const progress = useMemo(() => {
    if (currentStep <= 0) return 0;
    if (currentStep > totalSteps + 2) return 100;
    return ((currentStep) / (totalSteps + 3)) * 100;
  }, [currentStep, totalSteps]);
  
  const currentDimension = LEAN_CANVAS_DIMENSIONS[currentStep - 1];
  
  const isNextDisabled = () => {
      if (currentStep === 0 && !businessModel.trim()) return true;
      return false;
  }

  const renderContent = () => {
    if (currentStep === -1) {
      return (
        <div className="text-center p-8 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-slate-800 mb-4">Welcome to the Business Model Advisory</h1>
             <div className="text-slate-600 mb-8 text-lg text-left space-y-6">
                <p>This tool offers a comprehensive diagnostic for your business, built upon two synergistic, industry-proven frameworks:</p>
                
                <div>
                    <h2 className="font-bold text-xl text-slate-700 mb-2">1. The Lean Canvas</h2>
                    <p>We begin with the Lean Canvas, a powerful one-page business plan created by Ash Maurya. It provides a concise, actionable snapshot of your entire business model. By mapping out the nine essential building blocks—from your customer segments and their core problems to your revenue streams and unique value proposition—we establish a clear and holistic baseline of your current strategy. This step ensures we see the complete picture before diving deeper.</p>
                </div>

                <div>
                    <h2 className="font-bold text-xl text-slate-700 mb-2">2. Dr. Teng's 9 P-Factors Diagnostic</h2>
                    <p className="mb-3">Once the baseline is set, we apply Dr. Michael Teng's proprietary 9 P-Factors framework (developed from the original 8Ps) to assess the underlying robustness and health of your model. This diagnostic toolkit goes beyond the surface to pressure-test your strategy against the nine critical dimensions essential for sustainable success:</p>
                    <ul className="list-disc list-outside space-y-2 pl-6 text-slate-500 text-base">
                        <li><strong>Pain:</strong> How well do you understand the critical problem you're solving?</li>
                        <li><strong>People:</strong> How clearly defined are your customer segments?</li>
                        <li><strong>Proposition:</strong> How unique and compelling is your value proposition?</li>
                        <li><strong>Product:</strong> How effectively does your solution solve the customer's pain?</li>
                        <li><strong>Place:</strong> How efficient are your channels for reaching customers?</li>
                        <li><strong>Profit:</strong> How viable and scalable is your revenue model?</li>
                        <li><strong>Processes:</strong> How optimized is your cost structure and internal operations?</li>
                        <li><strong>Performance:</strong> How relevant and actionable are your key metrics?</li>
                        <li><strong>Protection:</strong> How defensible is your unfair advantage against competition?</li>
                    </ul>
                </div>
                
                <p>By integrating the strategic overview of the Lean Canvas with the deep diagnostic power of the 9 P-Factors, our AI can provide a nuanced, multi-layered analysis, complete with actionable recommendations to drive your corporate transformation.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={() => setCurrentStep(0)}
                    className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                    <StartIcon />
                    Start Self-Assessment
                </button>
                <button
                    onClick={loadSampleData}
                    className="bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-lg hover:bg-slate-300 transition-colors flex items-center gap-2 w-full sm:w-auto"
                >
                    <PlayIcon />
                    Play Demo
                </button>
            </div>
        </div>
      );
    }
    
    if (currentStep === 0) {
        return (
            <div className="p-4 sm:p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Business Model Statement</h2>
                <p className="text-slate-600 mb-4">Describe your overall business model in 2-3 sentences, highlighting your value proposition and key customer segments.</p>
                <textarea
                    value={businessModel}
                    onChange={(e) => setBusinessModel(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={4}
                    placeholder="e.g., We provide a subscription-based SaaS platform for small businesses to manage their finances, targeting freelance creatives and consultants..."
                />
            </div>
        )
    }

    if (currentStep > 0 && currentStep <= totalSteps) {
      return (
        <QuestionCard
          dimension={currentDimension}
          answer={answers[currentDimension.id] || { selectedChoiceIndex: null, rating: 3 }}
          onUpdate={handleUpdateAnswer}
        />
      );
    }

    if (currentStep === totalSteps + 1) {
        return (
            <div className="p-4 sm:p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Additional Information (Optional)</h2>
                <p className="text-slate-600 mb-4">Provide any other relevant information or context about your business model that the AI should consider in its analysis (e.g., recent funding, competitive landscape, specific challenges).</p>
                <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={6}
                    placeholder="e.g., We recently secured a seed funding round and are facing new competition..."
                />
            </div>
        )
    }

    if (currentStep === totalSteps + 2) {
        return <WeightingEditor weights={weights} onUpdate={setWeights} />;
    }
    
    if (currentStep === totalSteps + 3) {
        return (
            <div className="p-6 text-center max-w-2xl mx-auto">
                 <h2 className="text-2xl font-bold text-slate-800 mb-3">Choose Your Report Type</h2>
                 <p className="text-slate-600 mb-6">
                    You can generate the report even if you haven't answered all questions. However, please note that the more information provided, the more accurate the solution and recommendations will be.
                 </p>
                 <div className="flex flex-col md:flex-row gap-4 justify-center">
                     <button
                        onClick={() => handleGenerateReport('non-faith')}
                        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex-1 shadow-md"
                    >
                        Generate Standard Business Advisory
                    </button>
                    <button
                        onClick={() => handleGenerateReport('faith')}
                        className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex-1 shadow-md"
                    >
                        Generate Faith-Based Advisory
                    </button>
                 </div>
            </div>
        );
    }

    if (currentStep === totalSteps + 4) {
      return <ResultsDashboard scores={scores} report={report} isLoading={isLoading} error={error} reportType={reportType} />;
    }
  };

  if (!isAuthenticated) {
    return <Disclaimer onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden my-4">
        <header className="p-4 sm:p-6 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <BusinessIcon />
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Business Model Advisory</h1>
            </div>
            {currentStep > -1 && (
                <button onClick={goToHome} className="text-slate-500 hover:text-blue-600 transition-colors" aria-label="Go to Home">
                    <HomeIcon />
                </button>
            )}
          </div>
          {currentStep >= 0 && currentStep <= totalSteps + 3 && (
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-slate-600">Progress</span>
                     <span className="text-sm font-bold text-blue-600">{currentStep > totalSteps + 2 ? 'Complete' : `${Math.round(progress)}%`}</span>
                </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.3s' }}></div>
              </div>
            </div>
          )}
        </header>
        
        <main className="p-4 sm:p-6 md:p-8 min-h-[500px]">
          {renderContent()}
        </main>
        
        {currentStep >= 0 && currentStep <= totalSteps + 3 && (
          <footer className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
             <button
                onClick={handlePrev}
                className={`bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors ${currentStep <= 0 ? 'invisible' : ''}`}
             >
                Previous
            </button>
            <button
                onClick={handleNext}
                disabled={isNextDisabled()}
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
               {currentStep === totalSteps + 3 ? 'Generate Report' : currentStep === totalSteps + 2 ? 'Choose Report Type' : currentStep === totalSteps + 1 ? 'Adjust Weights' : 'Next'}
            </button>
          </footer>
        )}
      </div>
       <div className="fixed bottom-4 right-4 flex flex-col gap-3">
         <button onClick={() => setIsAssistantOpen(true)} className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-transform hover:scale-110" aria-label="Open Business Model Assistant">
            <ChatIcon />
         </button>
         <button onClick={() => window.location.href = "mailto:admin@corporateturnaroundcentre.com?subject=Feedback on Business Model Advisory"} className="bg-slate-700 text-white rounded-full p-4 shadow-lg hover:bg-slate-800 transition-transform hover:scale-110" aria-label="Provide Feedback">
            <FeedbackIcon />
         </button>
      </div>
      <VirtualAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      <footer className="w-full max-w-4xl mx-auto px-4 py-8 mt-8 border-t border-slate-200 text-slate-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-800">Corporate Turnaround Centre Pte Ltd</h3>
              <p className="mt-1 text-slate-500 text-xs leading-relaxed">
                An AI Powerhouse democratizing elite turnaround strategy anywhere, anytime. Incorporated in 2008. 
                Corporate Turnaround Centre and all its associated platforms provide management consultancy information 
                for educational use only and are not a licensed financial advisor.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800">Support the Mission</h4>
              <p className="mt-1 text-slate-500 text-xs">
                Sustaining this legacy requires ongoing server costs. We invite your support through a Sustainability Contribution:
              </p>
              <a 
                href="https://www.paypal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:underline font-medium"
              >
                Make a Contribution via PayPal
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-slate-800">Contact & Websites</h4>
              <div className="mt-1 space-y-1 text-xs text-slate-500">
                <p>Email: <a href="mailto:admin@corporateturnaroundcentre.com" className="text-blue-600 hover:underline">admin@corporateturnaroundcentre.com</a></p>
                <div className="flex flex-col mt-2">
                  <span className="font-medium text-slate-700">Websites:</span>
                  <a href="https://www.corporateturnaroundcentre.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.corporateturnaroundcentre.com</a>
                  <a href="https://www.miketeng.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.miketeng.com</a>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 italic">Disclaimer:</h4>
              <p className="mt-1 text-slate-500 text-xs leading-relaxed">
                AI is subject to “hallucinations.” Verified strategic decisions and outcomes remain your sole responsibility. 
                We disclaim all liability for financial losses.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400">
          Copyright © 2025 Corporate Turnaround Centre. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;