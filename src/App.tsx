import { useState } from 'react'
import './App.css'
import QuizPage from './pages/QuizPage'
import FlashcardPage from './pages/FlashcardPage'
import MockTestPage from './pages/MockTestPage'

interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const subjects: Subject[] = [
  {
    id: 'math',
    title: 'Mathematical Reasoning',
    description: 'Master arithmetic, algebra, geometry, and data analysis.',
    icon: '🧮'
  },
  {
    id: 'language-arts',
    title: 'Reasoning Through Language Arts',
    description: 'Enhance your reading comprehension and writing skills.',
    icon: '📚'
  },
  {
    id: 'science',
    title: 'Science',
    description: 'Explore life science, physical science, and earth & space.',
    icon: '🧪'
  },
  {
    id: 'social-studies',
    title: 'Social Studies',
    description: 'Learn about civics, government, U.S. history, and economics.',
    icon: '🌍'
  }
];

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'quiz' | 'flashcards' | 'mock-test'>('home');

  if (currentView === 'quiz') {
    return <QuizPage />;
  }

  if (currentView === 'flashcards') {
    return <FlashcardPage />;
  }

  if (currentView === 'mock-test') {
    return <MockTestPage />;
  }

  return (
    <div className="app-container">
      <header className="header">
        <button 
          onClick={() => setCurrentView('home')} 
          className="logo-text bg-transparent border-none p-0 text-inherit cursor-pointer hover:opacity-80"
        >
          GED Study Assist
        </button>
        <nav className="nav-links">
          <button onClick={() => setCurrentView('home')} className="nav-btn">Subjects</button>
          <button onClick={() => setCurrentView('flashcards')} className="nav-btn">Flashcards</button>
          <button onClick={() => setCurrentView('mock-test')} className="nav-btn font-bold text-ged-red">Mock Test</button>
          <a href="#">Resources</a>
          <a href="#">Profile</a>
        </nav>
      </header>

      <main>
        <section className="hero-section">
          <h1>Ready to pass your GED?</h1>
          <p>Select a subject below to start your study session and track your progress toward your diploma.</p>
        </section>

        <section className="subjects-grid">
          {subjects.map((subject) => (
            <div key={subject.id} className="subject-card">
              <span className="subject-icon">{subject.icon}</span>
              <h3>{subject.title}</h3>
              <p>{subject.description}</p>
              <button onClick={() => {
                if (subject.id === 'social-studies') {
                  setCurrentView('quiz');
                } else {
                  alert(`Starting ${subject.title}...`);
                }
              }}>
                Start Learning
              </button>
            </div>
          ))}
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} GED Study Assist. Empowering students everywhere.</p>
      </footer>
    </div>
  )
}

export default App

