import './App.css'

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
  return (
    <div className="app-container">
      <header className="header">
        <a href="/" className="logo-text">GED Study Assist</a>
        <nav className="nav-links">
          <a href="#">Subjects</a>
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
              <button onClick={() => alert(`Starting ${subject.title}...`)}>
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

