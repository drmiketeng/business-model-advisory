import React, { useState } from 'react';
import { BusinessIcon } from './icons';

interface DisclaimerProps {
  onAuthenticated: () => void;
}

const Disclaimer: React.FC<DisclaimerProps> = ({ onAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [hasAgreed, setHasAgreed] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError('Email is required.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    validateEmail(e.target.value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasAgreed(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email) && hasAgreed) {
      onAuthenticated();
    }
  };

  const isButtonDisabled = !email || !!emailError || !hasAgreed;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans bg-slate-50">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden my-4">
        <header className="p-6 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <BusinessIcon />
            <h1 className="text-2xl font-bold text-slate-800">Business Model Advisory</h1>
          </div>
        </header>

        <main className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Welcome to Business Model Advisory</h2>
          <div className="text-slate-600 space-y-4">
            <p>
              <a href="http://www.businessmodeladvisory.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.businessmodeladvisory.org</a> is an AI-powered, quick business model assessment platform designed to help entrepreneurs and SMEs validate and refine their business models and ideas effectively. Using a proprietary 8 Ps framework—covering Pain, Proposition, Process, People, Productivity, Pliability, Platform, and Pitfalls—mapped onto the 9 key dimensions of the Lean Canvas, it offers a structured self-assessment experience.
            </p>
            <p>
              Users input their business model details, answer targeted questions, and receive weighted scores that highlight strengths and gaps across critical business model areas. The platform generates actionable insights and visual dashboards to guide strategic improvements and innovation.
            </p>
            <p>
              Many start-ups fail because they do not do a detailed analysis of their business idea or model. This platform will provide a quick assessment of your business model or idea. For a more thorough and robust evaluation, users are encouraged to use our Business Model Centre, <a href="http://www.businessmodelcentre.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.businessmodelcentre.com</a>.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8">
             <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Enter your email to begin
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 transition ${emailError ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-blue-500'}`}
                    placeholder="you@company.com"
                    aria-describedby="email-error"
                />
                {emailError && <p id="email-error" className="text-red-600 text-sm mt-1">{emailError}</p>}
             </div>
             
             <div className="mb-6">
                <label htmlFor="terms" className="flex items-center">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={hasAgreed}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-600">I agree to the terms and conditions.</span>
                </label>
             </div>
             
             <button
                type="submit"
                disabled={isButtonDisabled}
                className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
             >
                Proceed to Assessment
             </button>
          </form>

        </main>
      </div>
       <footer className="text-center text-xs text-slate-500 py-4">
        Copyright © 2025 The Business Model Advisory. All rights reserved.
      </footer>
    </div>
  );
};

export default Disclaimer;
