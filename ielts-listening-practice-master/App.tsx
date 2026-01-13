
import React, { useState, useCallback } from 'react';
import { 
  MCQ_OPTIONS, 
  CORRECT_MCQ, 
  GAP_FILL_QUESTIONS, 
  CORRECT_GAP_FILL, 
  AUDIO_LINK 
} from './data';
import { Answers, ValidationResults } from './types';

const App: React.FC = () => {
  const [answers, setAnswers] = useState<Answers>({
    mcq: [],
    gapFill: {
      16: '',
      17: '',
      18: '',
      19: '',
      20: '',
    },
  });

  const [results, setResults] = useState<ValidationResults | null>(null);

  const handleMCQChange = (letter: string) => {
    if (results) return; // Prevent change after submission
    setAnswers(prev => {
      const newMcq = prev.mcq.includes(letter)
        ? prev.mcq.filter(l => l !== letter)
        : [...prev.mcq, letter];
      
      // Limit to 5 selections as per instructions
      if (newMcq.length > 5 && !prev.mcq.includes(letter)) return prev;
      return { ...prev, mcq: newMcq };
    });
  };

  const handleGapFillChange = (id: number, value: string) => {
    if (results) return;
    setAnswers(prev => ({
      ...prev,
      gapFill: { ...prev.gapFill, [id]: value }
    }));
  };

  const handleSubmit = useCallback(() => {
    let correctCount = 0;
    
    // Validate MCQ (Each correct letter selected counts as 1 correct answer)
    // Note: IELTS "Choose 5" usually gives marks for each correct letter identified.
    const mcqResults: Record<string, boolean> = {};
    MCQ_OPTIONS.forEach(opt => {
      if (answers.mcq.includes(opt.letter)) {
        const isCorrect = CORRECT_MCQ.includes(opt.letter);
        mcqResults[opt.letter] = isCorrect;
        if (isCorrect) correctCount++;
      }
    });

    // Validate Gap Fill
    const gapFillResults: Record<number, boolean> = {};
    GAP_FILL_QUESTIONS.forEach(q => {
      const userAnswer = answers.gapFill[q.id].trim().toLowerCase();
      const correctAnswer = CORRECT_GAP_FILL[q.id].toLowerCase();
      const isCorrect = userAnswer === correctAnswer;
      gapFillResults[q.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    // Score on scale of 10 (Total questions = 5 MCQ selections + 5 Gap fills = 10)
    const finalScore = (correctCount / 10) * 10;

    setResults({
      mcqResults,
      gapFillResults,
      score: finalScore,
      isSubmitted: true,
    });

    // Scroll to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [answers]);

  const resetQuiz = () => {
    setAnswers({
      mcq: [],
      gapFill: { 16: '', 17: '', 18: '', 19: '', 20: '' },
    });
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">IELTS Listening Practice</h1>
          <p className="text-slate-500 mb-6">Exercise: Fitness Land Group Programs & Schedule</p>
          
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
              <span className="font-medium text-blue-900">Audio Recording</span>
            </div>
            <a 
              href={AUDIO_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              Download Audio Link
            </a>
          </div>
        </header>

        {/* Results Toast */}
        {results && (
          <div className={`mb-8 p-6 rounded-2xl shadow-lg border animate-bounce-short ${results.score >= 7 ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Final Score: {results.score.toFixed(1)} / 10</h2>
                <p className="text-slate-600">
                  {results.score >= 7 ? 'Great job! Keep practicing.' : 'Keep trying, you can improve!'}
                </p>
              </div>
              <button 
                onClick={resetQuiz}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Section 1: MCQ */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Questions 11-15</h3>
          <p className="text-slate-600 mb-6 italic underline">Choose FIVE letters, A—I. Which FIVE group fitness programs are available at Fitness Land?</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MCQ_OPTIONS.map((opt) => (
              <label 
                key={opt.letter}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  answers.mcq.includes(opt.letter) 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-100 bg-slate-50 hover:border-slate-300'
                } ${
                  results && results.mcqResults[opt.letter] === true ? 'border-green-500 bg-green-50' : 
                  results && results.mcqResults[opt.letter] === false ? 'border-red-500 bg-red-50' : ''
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={answers.mcq.includes(opt.letter)}
                    onChange={() => handleMCQChange(opt.letter)}
                    disabled={!!results}
                  />
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    answers.mcq.includes(opt.letter) ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'
                  }`}>
                    {answers.mcq.includes(opt.letter) && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Letter {opt.letter}</span>
                  <span className="font-semibold text-slate-800 capitalize">{opt.label}</span>
                </div>
                {results && answers.mcq.includes(opt.letter) && (
                  <div className="ml-auto">
                    {results.mcqResults[opt.letter] ? (
                      <span className="text-green-600 font-bold">✓</span>
                    ) : (
                      <span className="text-red-600 font-bold">✕</span>
                    )}
                  </div>
                )}
              </label>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400">Selected: {answers.mcq.length} / 5</p>
        </section>

        {/* Section 2: Gap Fill */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Questions 16-20</h3>
          <p className="text-slate-600 mb-6 italic underline">Complete the timetable of group activities below. Write NO MORE THAN TWO WORDS for each answer.</p>
          
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 border-b border-slate-200">Day</th>
                  <th className="px-6 py-4 text-sm font-bold text-slate-900 border-b border-slate-200">Activity Name</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GAP_FILL_QUESTIONS.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{q.day}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-grow">
                          <input 
                            type="text"
                            placeholder={`Answer ${q.id}...`}
                            value={answers.gapFill[q.id]}
                            onChange={(e) => handleGapFillChange(q.id, e.target.value)}
                            disabled={!!results}
                            className={`w-full px-4 py-2 bg-slate-50 border-2 rounded-lg outline-none transition-all placeholder:text-slate-400 font-medium ${
                              results && results.gapFillResults[q.id] === true 
                                ? 'border-green-500 bg-green-50 text-green-700' 
                                : results && results.gapFillResults[q.id] === false
                                ? 'border-red-500 bg-red-50 text-red-700'
                                : 'border-slate-100 focus:border-blue-500'
                            }`}
                          />
                        </div>
                        {results && (
                          <div className="flex-shrink-0">
                            {results.gapFillResults[q.id] ? (
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Correct</span>
                            ) : (
                              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Incorrect</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer & Actions */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-20">
          {!results ? (
            <button 
              onClick={handleSubmit}
              disabled={answers.mcq.length < 5 && Object.values(answers.gapFill).every(v => v === '')}
              className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Answers
            </button>
          ) : (
            <button 
              onClick={resetQuiz}
              className="w-full sm:w-auto px-12 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              Restart Exercise
            </button>
          )}
          <p className="text-slate-400 text-sm">© 2025 IELTS Practice Platform</p>
        </footer>
      </div>

      <style>{`
        @keyframes bounce-short {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-short {
          animation: bounce-short 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
