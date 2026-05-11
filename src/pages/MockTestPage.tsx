import React, { useState, useEffect, useCallback } from 'react';
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

interface ResultSummary {
  subject: string;
  total: number;
  correct: number;
}

const MockTestPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .limit(40);

      if (error) throw error;
      if (data) {
        setQuestions(data);
        setAnswers(new Array(data.length).fill(null));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, timeLeft]);

  const handleAnswer = (option: string) => {
    if (isFinished) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = option;
    setAnswers(newAnswers);
  };

  const handleFinish = () => {
    if (window.confirm('Are you sure you want to submit the test?')) {
      setIsFinished(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = (): ResultSummary[] => {
    const subjects = ['math', 'science', 'social_studies', 'rla'];
    return subjects.map(sub => {
      const subQs = questions.filter(q => q.subject === sub);
      const subCorrect = subQs.filter((q, i) => {
        const qIndex = questions.findIndex(item => item.id === q.id);
        return answers[qIndex] === q.correct_answer;
      }).length;
      return {
        subject: sub,
        total: subQs.length,
        correct: subCorrect
      };
    }).filter(r => r.total > 0);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ged-green"></div></div>;
  if (error) return <div className="p-8 text-ged-red">Error: {error}</div>;

  if (isFinished) {
    const results = calculateResults();
    const totalCorrect = results.reduce((acc, curr) => acc + curr.correct, 0);
    const totalQuestions = questions.length;
    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-ged border border-ged-border p-8 md:p-12 shadow-xl animate-in zoom-in duration-500">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-ged-green-dark mb-4">Exam Results Analysis</h1>
            <p className="text-ged-text-muted font-bold text-lg">Detailed breakdown of your performance across all GED subjects.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="md:col-span-1 bg-ged-bg rounded-ged p-8 flex flex-col items-center justify-center border-2 border-ged-green-mid/20">
              <div className="text-6xl font-black text-ged-green-dark mb-2">{overallPercentage}%</div>
              <div className="text-sm font-black text-ged-green uppercase tracking-widest">Overall Score</div>
            </div>
            
            <div className="md:col-span-2 space-y-4">
              {results.map(res => (
                <div key={res.subject} className="bg-white border border-ged-border rounded-ged-sm p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-ged-text uppercase text-xs tracking-wider">{res.subject.replace('_', ' ')}</span>
                    <span className="font-bold text-sm">{res.correct} / {res.total}</span>
                  </div>
                  <div className="w-full h-2.5 bg-ged-bg rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-ged-green-mid rounded-full transition-all duration-1000"
                      style={{ width: `${(res.correct / res.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => window.location.reload()} className="bg-ged-green-mid text-white font-black px-8 py-4 rounded-full shadow-lg hover:bg-ged-green-dark transition-all">Retake Exam</button>
            <button onClick={() => window.location.href = '/'} className="border-2 border-ged-border text-ged-text-muted font-black px-8 py-4 rounded-full hover:border-ged-green-mid transition-all">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-ged-bg flex flex-col">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-white border-b border-ged-border z-50 px-4 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-ged-green-dark hidden sm:block">GED Mock Exam</h2>
            <div className={`px-4 py-1.5 rounded-full font-black text-sm flex items-center gap-2 ${timeLeft < 300 ? 'bg-ged-red-light text-ged-red animate-pulse' : 'bg-ged-bg text-ged-text'}`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>
          
          <div className="flex-1 max-w-xs mx-8 hidden md:block">
            <div className="w-full h-2 bg-ged-border rounded-full overflow-hidden">
              <div className="h-full bg-ged-green-mid transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <button 
            onClick={handleFinish}
            className="bg-ged-red text-white text-xs font-black px-5 py-2 rounded-full hover:bg-red-700 transition-all shadow-md"
          >
            Submit Test
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-3xl w-full mx-auto px-4 py-12">
        {/* Question Area */}
        <div className="bg-white rounded-ged border border-ged-border p-8 md:p-10 shadow-lg min-h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <span className="bg-ged-purple-light text-ged-purple font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
              {currentQuestion.subject.replace('_', ' ')} · {currentQuestion.topic}
            </span>
            <span className="text-xs font-bold text-ged-text-muted">Question {currentIndex + 1} of {questions.length}</span>
          </div>

          <h3 className="text-xl font-bold text-ged-text leading-relaxed mb-8 flex-1">
            {currentQuestion.question_text}
          </h3>

          <div className="grid gap-3 mb-8">
            {currentQuestion.options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = answers[currentIndex] === option;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`w-full flex items-center gap-4 p-4 rounded-ged-sm border-2 text-left font-bold transition-all ${
                    isSelected 
                      ? 'border-ged-green-mid bg-ged-green-light text-ged-green-dark' 
                      : 'border-ged-border bg-ged-bg hover:border-ged-green-mid/40'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                    isSelected ? 'bg-ged-green-mid text-white' : 'bg-ged-border text-ged-text-muted'
                  }`}>{letter}</span>
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-auto pt-8 border-t border-ged-border">
            <button 
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(prev => prev - 1)}
              className="font-black text-ged-text-muted hover:text-ged-green-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>
            <button 
              disabled={currentIndex === questions.length - 1}
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="font-black text-ged-green-mid hover:text-ged-green-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next Question →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockTestPage;
