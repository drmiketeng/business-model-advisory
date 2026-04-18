import React from 'react';
import { LEAN_CANVAS_DIMENSIONS } from '../constants';

interface WeightingEditorProps {
  weights: Record<string, number>;
  onUpdate: (weights: Record<string, number>) => void;
}

const WeightingEditor: React.FC<WeightingEditorProps> = ({ weights, onUpdate }) => {
    
  const handleWeightChange = (pFactor: string, value: number) => {
    const newWeights: Record<string, number> = { ...weights, [pFactor]: value };
    // FIX: Explicitly type accumulator and value in reduce to avoid type inference issues.
    const total = Object.values(newWeights).reduce((sum: number, w: number) => sum + w, 0);

    // Normalize to 100
    if (total !== 100) {
        const factor = 100 / total;
        for (const key in newWeights) {
            newWeights[key] = Math.round(newWeights[key] * factor);
        }
        // Due to rounding, there might be a small difference. Adjust the last item.
        // FIX: Explicitly type accumulator and value in reduce to avoid type inference issues.
        const finalTotal = Object.values(newWeights).reduce((sum: number, w: number) => sum + w, 0);
        if (finalTotal !== 100) {
            const lastKey = Object.keys(newWeights)[Object.keys(newWeights).length - 1];
            newWeights[lastKey] = newWeights[lastKey] + (100 - finalTotal);
        }
    }
    
    onUpdate(newWeights);
  };
  
  // FIX: Explicitly type accumulator and value in reduce to fix "Operator '+' cannot be applied to types 'unknown' and 'number'" error.
  const totalWeight = Object.values(weights).reduce((sum: number, w: number) => sum + w, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Assign Importance Weights</h2>
      <p className="text-slate-600 mb-6">
        Adjust the importance of each factor for your specific business. The total must equal 100%.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEAN_CANVAS_DIMENSIONS.map(dim => {
          const pFactorKey = dim.pFactor.toLowerCase();
          return (
            <div key={dim.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <label htmlFor={`weight-${dim.id}`} className="block text-md font-semibold text-slate-700">
                {dim.pFactor}
              </label>
              <p className="text-xs text-slate-500 mb-3">{dim.name}</p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id={`weight-${dim.id}`}
                  min="1"
                  max="50"
                  value={weights[pFactorKey] || 11}
                  onChange={(e) => handleWeightChange(pFactorKey, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                />
                <span className="font-bold text-blue-600 text-lg w-12 text-center">
                  {weights[pFactorKey] || 11}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className={`mt-6 text-center font-bold text-lg ${totalWeight === 100 ? 'text-green-600' : 'text-red-600'}`}>
        Total Weight: {totalWeight}%
      </div>
    </div>
  );
};

export default WeightingEditor;
