import React from 'react';
import type { LeanCanvasDimension, Answer } from '../types';

interface QuestionCardProps {
  dimension: LeanCanvasDimension;
  answer: Answer;
  onUpdate: (id: string, answer: Answer) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ dimension, answer, onUpdate }) => {
  const handleChoiceChange = (index: number) => {
    onUpdate(dimension.id, { ...answer, selectedChoiceIndex: index });
  };

  const handleRatingChange = (rating: number) => {
    onUpdate(dimension.id, { ...answer, rating });
  };

  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="bg-white p-6 rounded-lg animate-fade-in">
      <div className="mb-6">
        <span className="text-sm font-semibold text-blue-600 bg-blue-100 py-1 px-3 rounded-full">{dimension.pFactor}</span>
        <h2 className="text-2xl font-bold text-slate-800 mt-2">{dimension.name}</h2>
        <p className="text-slate-600 mt-1">{dimension.question}</p>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Answer (Choose the best fit)
        </label>
        <div className="space-y-3">
            {dimension.choices.map((choice, index) => (
                <div key={index}>
                    <input
                        type="radio"
                        id={`choice-${dimension.id}-${index}`}
                        name={`choice-${dimension.id}`}
                        value={index}
                        checked={answer.selectedChoiceIndex === index}
                        onChange={() => handleChoiceChange(index)}
                        className="sr-only peer"
                    />
                    <label
                        htmlFor={`choice-${dimension.id}-${index}`}
                        className="block w-full p-4 text-sm text-slate-700 bg-slate-50 border-2 border-slate-200 rounded-lg cursor-pointer transition-all hover:border-blue-400 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:font-semibold peer-checked:text-blue-800"
                    >
                        {choice}
                    </label>
                </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800">{dimension.ratingPrompt}</h3>
        <p className="text-sm text-slate-500 mb-4">(1 = Excellent, 5 = Poor / High Risk)</p>
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          {ratingOptions.map((rating) => (
            <div key={rating} className="flex-1">
              <input
                type="radio"
                id={`rating-${dimension.id}-${rating}`}
                name={`rating-${dimension.id}`}
                value={rating}
                checked={answer.rating === rating}
                onChange={() => handleRatingChange(rating)}
                className="sr-only"
              />
              <label
                htmlFor={`rating-${dimension.id}-${rating}`}
                className={`w-full block text-center p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  answer.rating === rating
                    ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-md'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                }`}
              >
                <span className="block text-xl">{rating}</span>
                <span className="block text-xs mt-1">{dimension.ratingLabels[rating]}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;