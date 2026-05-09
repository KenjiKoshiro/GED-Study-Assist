// ── INJECT CSS ACCENT VARS FROM CONFIG ──
(function () {
  const c = QUIZ_CONFIG;
  const root = document.documentElement;
  root.style.setProperty('--accent',        c.accentColor);
  root.style.setProperty('--accent-light',  c.accentLight);
  root.style.setProperty('--accent-dark',   c.accentDark);
  root.style.setProperty('--accent-border', c.accentBorder);
})();

// ── BUILD PAGE SHELL ──
document.body.innerHTML = `
<nav class="topnav">
  <a href="index.html" class="logo"><div class="logo-icon">📚</div>GEDReady</a>
  <div class="nav-meta">
    <span class="nav-subject-tag">${QUIZ_CONFIG.icon} ${QUIZ_CONFIG.subjectShort}</span>
    <a href="${QUIZ_CONFIG.backLink}" class="nav-back">← All Subjects</a>
  </div>
</nav>

<div class="quiz-wrap">
  <div class="progress-header" id="progress-header">
    <div class="progress-track"><div class="progress-fill" id="progress-fill" style="width:0%"></div></div>
    <div class="progress-label" id="progress-label">1 of ${QUIZ_CONFIG.questions.length}</div>
  </div>

  <div id="quiz-area">
    <div class="question-card" id="question-card"></div>
    <div class="quiz-nav">
      <span class="q-counter" id="q-counter"></span>
      <button class="btn-next" id="btn-next" onclick="nextQuestion()">Next →</button>
      <button class="btn-submit" id="btn-submit" onclick="showResults()">Submit Quiz →</button>
    </div>
  </div>

  <div class="results-screen" id="results-screen">
    <div class="results-card">
      <div class="results-top">
        <h2>Quiz Complete! 🎉</h2>
        <p>Sign in to unlock your score and save your progress.</p>
      </div>
      <div class="score-blur-wrap">
        <div class="score-content" id="score-content">
          <div class="score-circle">
            <div class="score-pct" id="result-pct">—</div>
            <div class="score-lbl">Score</div>
          </div>
          <div class="score-breakdown">
            <div class="score-stat"><div class="score-stat-num" id="result-correct" style="color:var(--green-mid)">—</div><div class="score-stat-lbl">Correct</div></div>
            <div class="score-stat"><div class="score-stat-num" id="result-wrong" style="color:#D85A30">—</div><div class="score-stat-lbl">Wrong</div></div>
            <div class="score-stat"><div class="score-stat-num" style="color:var(--accent)">${QUIZ_CONFIG.questions.length}</div><div class="score-stat-lbl">Questions</div></div>
          </div>
        </div>
        <div class="lock-overlay">
          <div class="lock-icon">🔒</div>
          <div class="lock-title">Your results are ready!</div>
          <div class="lock-sub">Create a free account to see your score and track your progress.</div>
        </div>
      </div>
      <div class="auth-gate">
        <h3>Unlock your results</h3>
        <p>Free forever — no credit card needed.</p>
        <div class="gate-toggle">
          <button class="gate-tab active" id="gtab-signup" onclick="gateTab('signup')">Sign Up Free</button>
          <button class="gate-tab" id="gtab-login" onclick="gateTab('login')">Log In</button>
        </div>
        <input class="gate-input" type="email" placeholder="Email address" id="gate-email">
        <input class="gate-input" type="password" placeholder="Password (min. 8 characters)" id="gate-pass">
        <button class="gate-submit" onclick="gateSubmit()"><span id="gate-submit-label">Create Free Account & See Results</span></button>
        <div class="gate-divider"><div class="gate-divider-line"></div><span>or</span><div class="gate-divider-line"></div></div>
        <button class="gate-google" onclick="gateGoogle()">
          <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Continue with Google
        </button>
      </div>
    </div>
  </div>
</div>
` + document.body.innerHTML;

// ── STATE ──
const questions = QUIZ_CONFIG.questions;
let current  = 0;
let answers  = new Array(questions.length).fill(null);
let answered = false;

// ── RENDER ──
function renderQuestion(idx) {
  answered = false;
  const q = questions[idx];
  const pct = Math.round((idx / questions.length) * 100);

  document.getElementById('progress-fill').style.width  = pct + '%';
  document.getElementById('progress-label').textContent = (idx + 1) + ' of ' + questions.length;
  document.getElementById('q-counter').textContent      = 'Question ' + (idx + 1) + ' of ' + questions.length;
  document.getElementById('btn-next').classList.remove('show');
  document.getElementById('btn-submit').classList.remove('show');

  let html = `<div class="q-type-tag">${QUIZ_CONFIG.icon} ${QUIZ_CONFIG.subjectShort} · ${q.topic}</div>`;
  if (q.context) html += `<div class="q-context">${q.context.replace(/\n/g,'<br>')}</div>`;

  if (q.type === 'multiple-choice') {
    html += `<div class="q-text">${q.text}</div><div class="options-list">`;
    q.options.forEach((opt, i) => {
      const letter = ['A','B','C','D'][i];
      html += `<button class="option-btn" id="opt-${i}" onclick="selectOption(${i})">
        <span class="opt-letter">${letter}</span>${opt}</button>`;
    });
    html += `</div>`;
  }

  else if (q.type === 'dropdown') {
    html += `<div class="dropdown-sentence">${q.textBefore}
      <select class="inline-select" id="dd-blank" onchange="checkDropdown(this)">
        <option value="">— choose —</option>
        ${q.blank.map(o => `<option value="${o}">${o}</option>`).join('')}
      </select> ${q.textAfter}</div>`;
  }

  else if (q.type === 'fill-in-the-blank') {
    html += `<div class="fitb-sentence">${q.textBefore}
      <input class="blank-input" id="fitb-input" type="text" placeholder="${q.hint}" maxlength="20">
      ${q.textAfter}</div>
      <div style="margin-top:14px;">
        <button class="btn-check" onclick="checkFITB()">Check Answer →</button>
      </div>`;
  }

  html += `<div class="feedback-box" id="feedback-box"></div>`;

  const card = document.getElementById('question-card');
  card.innerHTML = html;
  card.style.animation = 'none';
  void card.offsetWidth;
  card.style.animation = '';
}

// ── HANDLERS ──
function selectOption(idx) {
  if (answered) return;
  answered = true;
  const q = questions[current];
  document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  document.getElementById('opt-' + idx).classList.add(idx === q.correct ? 'correct' : 'wrong');
  if (idx !== q.correct) document.getElementById('opt-' + q.correct).classList.add('correct');
  answers[current] = idx === q.correct;
  showFeedback(idx === q.correct, q);
  showNavBtn();
}

function checkDropdown(sel) {
  if (answered || !sel.value) return;
  answered = true;
  const q = questions[current];
  sel.disabled = true;
  const ok = sel.value === q.correctBlank;
  answers[current] = ok;
  sel.classList.add(ok ? 'correct-sel' : 'wrong-sel');
  showFeedback(ok, q, q.correctBlank);
  showNavBtn();
}

function checkFITB() {
  if (answered) return;
  const input = document.getElementById('fitb-input');
  const val = input.value.trim();
  if (!val) { input.focus(); return; }
  answered = true;
  const q = questions[current];
  const ok = val.toLowerCase() === q.correctAnswer.toLowerCase();
  answers[current] = ok;
  input.disabled = true;
  input.classList.add(ok ? 'correct-input' : 'wrong-input');
  document.querySelector('.btn-check').style.display = 'none';
  showFeedback(ok, q, q.correctAnswer);
  showNavBtn();
}

function showFeedback(ok, q, correctLabel) {
  const fb = document.getElementById('feedback-box');
  if (ok) {
    fb.className = 'feedback-box correct-fb';
    fb.innerHTML = `<span class="fb-icon">✅</span> ${q.explanation}`;
  } else {
    const label = correctLabel || q.options[q.correct];
    fb.className = 'feedback-box wrong-fb';
    fb.innerHTML = `<span class="fb-icon">❌</span> Not quite. Correct answer: <strong>${label}</strong>. ${q.explanation}`;
  }
}

function showNavBtn() {
  if (current < questions.length - 1) {
    document.getElementById('btn-next').classList.add('show');
  } else {
    document.getElementById('btn-submit').classList.add('show');
  }
}

function nextQuestion() {
  current++;
  renderQuestion(current);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showResults() {
  const correct = answers.filter(a => a === true).length;
  const wrong   = answers.filter(a => a === false).length;
  const pct     = Math.round((correct / questions.length) * 100);
  document.getElementById('result-pct').textContent     = pct + '%';
  document.getElementById('result-correct').textContent = correct;
  document.getElementById('result-wrong').textContent   = wrong;
  document.getElementById('progress-fill').style.width  = '100%';
  document.getElementById('progress-label').textContent = 'Complete! ✅';
  document.getElementById('quiz-area').style.display    = 'none';
  document.getElementById('results-screen').classList.add('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── AUTH GATE ──
function gateTab(tab) {
  const s = tab === 'signup';
  document.getElementById('gtab-signup').classList.toggle('active', s);
  document.getElementById('gtab-login').classList.toggle('active', !s);
  document.getElementById('gate-submit-label').textContent = s
    ? 'Create Free Account & See Results'
    : 'Log In & See Results';
}

function gateSubmit() {
  const e = document.getElementById('gate-email').value.trim();
  const p = document.getElementById('gate-pass').value.trim();
  if (!e || !p) { alert('Please fill in both fields.'); return; }
  unlockResults();
}

function gateGoogle() { unlockResults(); }

function unlockResults() {
  document.getElementById('score-content').style.filter     = 'none';
  document.getElementById('score-content').style.userSelect = 'auto';
  document.querySelector('.lock-overlay').style.display     = 'none';
  document.querySelector('.auth-gate').innerHTML = `
    <div style="text-align:center;padding:14px 0;">
      <div style="font-size:2rem;margin-bottom:8px;">🎉</div>
      <div style="font-size:1rem;font-weight:900;margin-bottom:6px;color:var(--green-dark);">Account created!</div>
      <div style="font-size:0.87rem;color:var(--text-muted);font-weight:600;margin-bottom:18px;">Your score is saved. Keep studying!</div>
      <a href="subjects.html" style="display:inline-block;background:var(--accent);color:#fff;padding:10px 22px;border-radius:50px;font-weight:800;font-size:0.92rem;text-decoration:none;margin-right:8px;">Try Another Subject →</a>
      <a href="dashboard.html" style="display:inline-block;background:var(--white);color:var(--green-dark);padding:10px 22px;border-radius:50px;font-weight:800;font-size:0.92rem;text-decoration:none;border:1.5px solid var(--border);">Dashboard</a>
    </div>`;
}

// ── INIT ──
renderQuestion(0);
