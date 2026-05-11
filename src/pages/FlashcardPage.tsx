import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Flashcard {
  id: number;
  subject: string;
  topic: string;
  front: string;
  back: string;
}

const FlashcardPage: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subject, setSubject] = useState('social_studies');

  useEffect(() => {
    fetchFlashcards();
  }, [subject]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('flashcards')
        .select('id, subject, topic, front, back')
        .eq('subject', subject);

      if (error) throw error;
      if (data) setFlashcards(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    }, isFlipped ? 150 : 0);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    }, isFlipped ? 150 : 0);
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
        <p className="text-xl font-bold">Error loading flashcards</p>
        <p>{error}</p>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <p className="text-xl font-bold text-ged-text-muted mb-4">No flashcards found for this subject.</p>
        <div className="flex gap-2">
          {['math', 'science', 'social_studies', 'rla'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSubject(sub)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                subject === sub ? 'bg-ged-green text-white' : 'bg-ged-bg text-ged-text-muted border border-ged-border'
              }`}
            >
              {sub.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-ged-green-dark flex items-center gap-2 mb-2">
            <span className="bg-ged-green-mid p-1.5 rounded-lg text-white text-lg">🗂️</span>
            Study Flashcards
          </h1>
          <p className="text-ged-text-muted font-bold">Master key concepts with active recall.</p>
        </div>

        {/* Subject Filter */}
        <div className="flex flex-wrap gap-2">
          {['math', 'science', 'social_studies', 'rla'].map((sub) => (
            <button
              key={sub}
              onClick={() => {
                setSubject(sub);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all ${
                subject === sub 
                  ? 'bg-ged-green-mid text-white shadow-md' 
                  : 'bg-white text-ged-text-muted border border-ged-border hover:border-ged-green-mid'
              }`}
            >
              {sub.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Card Area */}
      <div className="flex flex-col items-center">
        {/* The Card */}
        <div 
          className="group w-full max-w-lg aspect-[4/3] cursor-pointer perspective-1000"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* Front */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-ged border-4 border-ged-border shadow-xl flex flex-col items-center justify-center p-10 text-center">
              <span className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-widest text-ged-amber bg-ged-amber-light px-3 py-1 rounded-full">
                {currentCard.topic}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-ged-text leading-tight">
                {currentCard.front}
              </h2>
              <p className="mt-8 text-sm font-black text-ged-green-mid animate-pulse uppercase tracking-widest">
                Tap to reveal answer
              </p>
            </div>

            {/* Back */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-ged-green-light rounded-ged border-4 border-ged-green-mid shadow-xl flex flex-col items-center justify-center p-10 text-center rotate-y-180">
              <span className="absolute top-6 left-6 text-[10px] font-black uppercase tracking-widest text-ged-green-dark bg-white px-3 py-1 rounded-full">
                Definition / Answer
              </span>
              <p className="text-xl md:text-2xl font-bold text-ged-green-dark leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="mt-12 flex items-center gap-8">
          <button 
            onClick={handlePrev}
            className="w-14 h-14 rounded-full bg-white border-2 border-ged-border flex items-center justify-center text-2xl hover:border-ged-green-mid hover:text-ged-green-mid transition-all shadow-md active:scale-95"
          >
            ←
          </button>
          
          <div className="text-center">
            <span className="block text-2xl font-black text-ged-green-dark">
              {currentIndex + 1} <span className="text-ged-text-muted text-lg">/ {flashcards.length}</span>
            </span>
            <span className="text-[10px] font-bold text-ged-text-muted uppercase tracking-widest">Progress</span>
          </div>

          <button 
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-white border-2 border-ged-border flex items-center justify-center text-2xl hover:border-ged-green-mid hover:text-ged-green-mid transition-all shadow-md active:scale-95"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
