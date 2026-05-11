import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Question {
  id: number;
  subject: string;
  topic: string;
  type: string;
  question_text: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('id, subject, topic, type, question_text, options, correct_answer, explanation')
        .eq('subject', 'social_studies')
        .limit(10);

      if (error) throw error;
      if (data) setQuestions(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQuestion = questions[currentIndex];
    if (option === currentQuestion.correct_answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ged-green"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-ged-red">
        <p className="text-xl font-bold">Error loading questions</p>
        <p>{error}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-bold text-ged-text-muted">No questions found for Social Studies.</p>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-ged border border-ged-border p-8 md:p-12 shadow-xl w-full text-center animate-in zoom-in duration-300">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-ged-green-dark mb-2">Quiz Complete!</h2>
          <p className="text-ged-text-muted font-bold mb-8 text-lg">Great job finishing the Social Studies section.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
            <div className="w-40 h-40 rounded-full bg-ged-green-light border-4 border-ged-green-mid flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-ged-green-dark">{percentage}%</span>
              <span className="text-xs font-bold text-ged-green uppercase tracking-widest">Score</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-ged-bg rounded-ged-sm p-4 text-center border border-ged-border">
                <p className="text-2xl font-black text-ged-green-mid">{score}</p>
                <p className="text-xs font-bold text-ged-text-muted uppercase">Correct</p>
              </div>
              <div className="bg-ged-bg rounded-ged-sm p-4 text-center border border-ged-border">
                <p className="text-2xl font-black text-ged-red">{questions.length - score}</p>
                <p className="text-xs font-bold text-ged-text-muted uppercase">Wrong</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={resetQuiz}
              className="w-full sm:w-auto bg-ged-green-mid hover:bg-ged-green-dark text-white font-black px-10 py-4 rounded-full shadow-lg transition-all"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto bg-white border-2 border-ged-border text-ged-text-muted hover:border-ged-green-mid hover:text-ged-green-dark font-black px-10 py-4 rounded-full transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-ged-green-dark flex items-center gap-2">
          <span className="bg-ged-green-mid p-1.5 rounded-lg text-white text-lg">📚</span>
          GEDReady
        </h1>
        <div className="flex items-center gap-3">
          <span className="bg-ged-amber-light text-ged-amber font-bold px-3 py-1 rounded-full text-sm">
            🌍 Social Studies
          </span>
          <button 
            onClick={() => window.location.href = '/'}
            className="text-ged-text-muted font-bold px-3 py-1 rounded-full border border-ged-border hover:bg-ged-red-light hover:text-ged-red transition-all text-sm"
          >
            ✕ Quit
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-2.5 bg-ged-border rounded-full overflow-hidden">
          <div 
            className="h-full bg-ged-green-mid rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm font-extrabold text-ged-text-muted whitespace-nowrap">
          {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-ged border border-ged-border p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="bg-ged-amber-light text-ged-amber text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4">
          {currentQuestion.topic || 'General'}
        </div>
        
        <h2 className="text-xl font-bold text-ged-text leading-relaxed mb-8">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const isSelected = selectedOption === option;
            const isCorrect = isAnswered && option === currentQuestion.correct_answer;
            const isWrong = isAnswered && isSelected && option !== currentQuestion.correct_answer;

            let buttonClass = "w-full flex items-center gap-4 p-4 rounded-ged-sm border-2 text-left font-bold transition-all duration-200 ";
            let letterClass = "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-colors ";

            if (isCorrect) {
              buttonClass += "border-ged-green-mid bg-ged-green-light text-ged-green-dark";
              letterClass += "bg-ged-green-mid text-white";
            } else if (isWrong) {
              buttonClass += "border-ged-red bg-ged-red-light text-ged-red";
              letterClass += "bg-ged-red text-white";
            } else if (isSelected) {
              buttonClass += "border-ged-green-mid bg-ged-green-light";
              letterClass += "bg-ged-green-mid text-white";
            } else {
              buttonClass += "border-ged-border bg-ged-bg hover:border-ged-green-mid hover:bg-ged-green-light text-ged-text";
              letterClass += "bg-ged-border text-ged-text-muted";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={isAnswered}
                className={buttonClass}
              >
                <span className={letterClass}>{letter}</span>
                {option}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {isAnswered && (
          <div className={`mt-6 p-4 rounded-ged-sm border-2 animate-in fade-in zoom-in-95 duration-300 ${
            selectedOption === currentQuestion.correct_answer 
              ? 'bg-ged-green-light border-ged-green-mid/30 text-ged-green-dark' 
              : 'bg-ged-red-light border-ged-red/30 text-ged-red'
          }`}>
            <div className="flex items-start gap-3">
              <span className="text-xl">
                {selectedOption === currentQuestion.correct_answer ? '✅' : '❌'}
              </span>
              <div>
                <p className="font-black text-sm mb-1">
                  {selectedOption === currentQuestion.correct_answer ? 'Correct!' : 'Not quite.'}
                </p>
                <p className="text-sm font-bold opacity-90 leading-relaxed">
                  {currentQuestion.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
        {isAnswered && (
          <button
            onClick={handleNext}
            className="bg-ged-green-mid hover:bg-ged-green-dark text-white font-black px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz →' : 'Next Question →'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
