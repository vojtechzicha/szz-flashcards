(function () {
  'use strict';

  // === State ===
  const state = {
    currentCards: [],
    currentIndex: 0,
    flipped: false,
    filter: 'all',
    studyMode: null, // 'all' | 'question' | 'subject'
    studyId: null,
  };

  const STORAGE_KEY = 'szz-progress';

  // === Progress (localStorage) ===
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch { return {}; }
  }

  function saveProgress(p) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  function getCardState(cardId) {
    return loadProgress()[cardId] || 'unseen';
  }

  function setCardState(cardId, s) {
    const p = loadProgress();
    p[cardId] = s;
    saveProgress(p);
  }

  function resetProgress() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // === Helpers ===
  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return document.querySelectorAll(sel); }

  function getCardsForQuestion(qId) {
    return FLASHCARD_DATA.cards.filter(c => c.questionId === qId);
  }

  function getCardsForSubject(sId) {
    const subj = FLASHCARD_DATA.subjects.find(s => s.id === sId);
    if (!subj) return [];
    return FLASHCARD_DATA.cards.filter(c => subj.questionIds.includes(c.questionId));
  }

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function progressStats(cards) {
    const p = loadProgress();
    let known = 0, unknown = 0, unseen = 0;
    cards.forEach(c => {
      const s = p[c.id] || 'unseen';
      if (s === 'known') known++;
      else if (s === 'unknown') unknown++;
      else unseen++;
    });
    return { known, unknown, unseen, total: cards.length };
  }

  // === Router ===
  function route() {
    const hash = location.hash || '#/';
    $$('.screen').forEach(s => s.classList.remove('active'));

    if (hash === '#/' || hash === '') {
      renderHome();
      $('#screen-home').classList.add('active');
    } else if (hash === '#/questions') {
      renderQuestionsList();
      $('#screen-questions').classList.add('active');
    } else if (hash === '#/subjects') {
      renderSubjectsList();
      $('#screen-subjects').classList.add('active');
    } else if (hash.startsWith('#/study/')) {
      parseStudyRoute(hash);
      $('#screen-study').classList.add('active');
    } else if (hash === '#/stats') {
      renderStats();
      $('#screen-stats').classList.add('active');
    }
  }

  function parseStudyRoute(hash) {
    const parts = hash.replace('#/study/', '').split('/');
    if (parts[0] === 'all') {
      state.studyMode = 'all';
      state.studyId = null;
      state.currentCards = [...FLASHCARD_DATA.cards];
    } else if (parts[0] === 'question') {
      state.studyMode = 'question';
      state.studyId = parts[1];
      state.currentCards = getCardsForQuestion(parts[1]);
    } else if (parts[0] === 'subject') {
      state.studyMode = 'subject';
      state.studyId = parts[1];
      state.currentCards = getCardsForSubject(parts[1]);
    }
    state.filter = 'all';
    state.currentIndex = 0;
    state.flipped = false;
    applyFilter();
    renderCard();
    updateStudyHeader();
    updateFilterUI();
  }

  // === Rendering ===
  function renderHome() {
    const total = FLASHCARD_DATA.cards.length;
    const stats = progressStats(FLASHCARD_DATA.cards);
    $('#home-count-all').textContent = total + ' kartiček';
    const hp = $('#home-progress');
    hp.innerHTML = `
      <h3>Celkový pokrok</h3>
      <div class="progress-row">
        <span>Vím</span>
        <div class="progress-bar"><div class="progress-bar__fill progress-bar__fill--known" style="width:${pct(stats.known, total)}%"></div></div>
        <span>${stats.known}/${total}</span>
      </div>
      <div class="progress-row">
        <span>Nevím</span>
        <div class="progress-bar"><div class="progress-bar__fill progress-bar__fill--unknown" style="width:${pct(stats.unknown, total)}%"></div></div>
        <span>${stats.unknown}/${total}</span>
      </div>
      <div class="progress-row">
        <span>Neviděné</span>
        <div class="progress-bar"><div class="progress-bar__fill" style="width:${pct(stats.unseen, total)}%;background:var(--text-dim)"></div></div>
        <span>${stats.unseen}/${total}</span>
      </div>
    `;
  }

  function pct(n, total) {
    return total ? Math.round((n / total) * 100) : 0;
  }

  function renderQuestionsList() {
    const el = $('#questions-list');
    el.innerHTML = FLASHCARD_DATA.questions.map(q => {
      const cards = getCardsForQuestion(q.id);
      const stats = progressStats(cards);
      return `
        <a href="#/study/question/${q.id}" class="list-item">
          <div class="list-item__title">${q.title}</div>
          <div class="list-item__sub">${q.subtitle}</div>
          <div class="list-item__bar">
            <div class="progress-bar">
              <div class="progress-bar__fill progress-bar__fill--known" style="width:${pct(stats.known, stats.total)}%"></div>
            </div>
            <span>${stats.known}/${stats.total}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function renderSubjectsList() {
    const el = $('#subjects-list');
    el.innerHTML = FLASHCARD_DATA.subjects.map(s => {
      const cards = getCardsForSubject(s.id);
      const stats = progressStats(cards);
      const qNames = s.questionIds.map(qid => {
        const q = FLASHCARD_DATA.questions.find(qq => qq.id === qid);
        return q ? q.title : '';
      }).join(', ');
      return `
        <a href="#/study/subject/${s.id}" class="list-item">
          <div class="list-item__title">${s.name}</div>
          <div class="list-item__sub">${cards.length} kartiček · ${qNames}</div>
          <div class="list-item__bar">
            <div class="progress-bar">
              <div class="progress-bar__fill progress-bar__fill--known" style="width:${pct(stats.known, stats.total)}%"></div>
            </div>
            <span>${stats.known}/${stats.total}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function updateStudyHeader() {
    let title = 'Všechny kartičky';
    let backHash = '#/';
    if (state.studyMode === 'question') {
      const q = FLASHCARD_DATA.questions.find(q => q.id === state.studyId);
      title = q ? q.title : '';
      backHash = '#/questions';
    } else if (state.studyMode === 'subject') {
      const s = FLASHCARD_DATA.subjects.find(s => s.id === state.studyId);
      title = s ? s.name : '';
      backHash = '#/subjects';
    }
    $('#study-title').textContent = title;
    $('#study-back').href = backHash;
    updateCounter();
  }

  function updateCounter() {
    const total = state.currentCards.length;
    const idx = total > 0 ? state.currentIndex + 1 : 0;
    $('#study-counter').textContent = `${idx} / ${total}`;
    const pctVal = total > 0 ? ((state.currentIndex + 1) / total) * 100 : 0;
    $('#study-progress-fill').style.width = pctVal + '%';
  }

  function renderCard() {
    if (state.currentCards.length === 0) {
      $('#card-front').innerHTML = '<p>Žádné kartičky v tomto filtru.</p>';
      $('#card-back').innerHTML = '';
      $('#flip-hint').textContent = '';
      updateCounter();
      return;
    }
    const card = state.currentCards[state.currentIndex];
    $('#card-front').innerHTML = card.front;
    $('#card-back').innerHTML = card.back;
    state.flipped = false;
    $('#card-inner').classList.remove('flipped');
    $('#flip-hint').textContent = 'Klikni pro otočení · Mezerník';

    // Update button states based on card progress
    const cs = getCardState(card.id);
    $('#btn-known').style.opacity = cs === 'known' ? '1' : '0.7';
    $('#btn-unknown').style.opacity = cs === 'unknown' ? '1' : '0.7';
    updateCounter();
  }

  function flipCard() {
    state.flipped = !state.flipped;
    $('#card-inner').classList.toggle('flipped', state.flipped);
    $('#flip-hint').textContent = state.flipped ? '' : 'Klikni pro otočení · Mezerník';
  }

  function nextCard() {
    if (state.currentCards.length === 0) return;
    state.currentIndex = (state.currentIndex + 1) % state.currentCards.length;
    renderCard();
  }

  function prevCard() {
    if (state.currentCards.length === 0) return;
    state.currentIndex = (state.currentIndex - 1 + state.currentCards.length) % state.currentCards.length;
    renderCard();
  }

  function markKnown() {
    if (state.currentCards.length === 0) return;
    const card = state.currentCards[state.currentIndex];
    setCardState(card.id, 'known');
    renderCard();
    setTimeout(nextCard, 200);
  }

  function markUnknown() {
    if (state.currentCards.length === 0) return;
    const card = state.currentCards[state.currentIndex];
    setCardState(card.id, 'unknown');
    renderCard();
    setTimeout(nextCard, 200);
  }

  function applyFilter() {
    let base;
    if (state.studyMode === 'all') base = [...FLASHCARD_DATA.cards];
    else if (state.studyMode === 'question') base = getCardsForQuestion(state.studyId);
    else if (state.studyMode === 'subject') base = getCardsForSubject(state.studyId);
    else base = [];

    const p = loadProgress();
    if (state.filter === 'unseen') {
      state.currentCards = base.filter(c => !p[c.id] || p[c.id] === 'unseen');
    } else if (state.filter === 'known') {
      state.currentCards = base.filter(c => p[c.id] === 'known');
    } else if (state.filter === 'unknown') {
      state.currentCards = base.filter(c => p[c.id] === 'unknown');
    } else {
      state.currentCards = base;
    }
    state.currentIndex = 0;
  }

  function updateFilterUI() {
    $$('.filter-opt').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === state.filter);
    });
  }

  // === Stats Screen ===
  function renderStats() {
    const allStats = progressStats(FLASHCARD_DATA.cards);
    const el = $('#stats-container');

    let questionsHtml = FLASHCARD_DATA.questions.map(q => {
      const cards = getCardsForQuestion(q.id);
      const s = progressStats(cards);
      return `
        <div class="stats-question">
          <div class="stats-question__title">${q.title}</div>
          <div class="stats-question__bar">
            <div class="sq-known" style="width:${pct(s.known, s.total)}%"></div>
            <div class="sq-unknown" style="width:${pct(s.unknown, s.total)}%"></div>
          </div>
          <div class="stats-question__nums">
            <span>✓ ${s.known}</span>
            <span>✗ ${s.unknown}</span>
            <span>○ ${s.unseen}</span>
          </div>
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="stats-section">
        <h3>Celkový přehled</h3>
        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-box__num stat-box__num--green">${allStats.known}</div>
            <div class="stat-box__label">Vím</div>
          </div>
          <div class="stat-box">
            <div class="stat-box__num stat-box__num--red">${allStats.unknown}</div>
            <div class="stat-box__label">Nevím</div>
          </div>
          <div class="stat-box">
            <div class="stat-box__num stat-box__num--dim">${allStats.unseen}</div>
            <div class="stat-box__label">Neviděné</div>
          </div>
        </div>
        <div class="progress-row">
          <span>Pokrok</span>
          <div class="progress-bar"><div class="progress-bar__fill progress-bar__fill--known" style="width:${pct(allStats.known, allStats.total)}%"></div></div>
          <span>${pct(allStats.known, allStats.total)}%</span>
        </div>
      </div>
      <div class="stats-section">
        <h3>Podle otázek</h3>
        ${questionsHtml}
      </div>
      <button class="reset-btn" id="btn-reset">Resetovat pokrok</button>
    `;

    $('#btn-reset').addEventListener('click', () => {
      if (confirm('Opravdu chceš smazat veškerý pokrok?')) {
        resetProgress();
        renderStats();
      }
    });
  }

  // === Swipe gestures ===
  function initSwipe() {
    let startX = 0, startY = 0, tracking = false;
    const area = $('#card-area');

    area.addEventListener('touchstart', e => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }
    }, { passive: true });

    area.addEventListener('touchend', e => {
      if (!tracking) return;
      tracking = false;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) nextCard();
        else prevCard();
      }
    }, { passive: true });
  }

  // === Keyboard ===
  function initKeyboard() {
    document.addEventListener('keydown', e => {
      if (!$('#screen-study').classList.contains('active')) return;
      switch (e.key) {
        case ' ':
          e.preventDefault();
          flipCard();
          break;
        case 'ArrowRight':
          nextCard();
          break;
        case 'ArrowLeft':
          prevCard();
          break;
        case '1':
          markKnown();
          break;
        case '2':
          markUnknown();
          break;
      }
    });
  }

  // === Event bindings ===
  function initEvents() {
    $('#card').addEventListener('click', flipCard);
    $('#btn-prev').addEventListener('click', prevCard);
    $('#btn-next').addEventListener('click', nextCard);
    $('#btn-known').addEventListener('click', markKnown);
    $('#btn-unknown').addEventListener('click', markUnknown);

    $('#btn-shuffle').addEventListener('click', () => {
      state.currentCards = shuffle(state.currentCards);
      state.currentIndex = 0;
      renderCard();
    });

    $('#btn-filter').addEventListener('click', () => {
      $('#filter-menu').classList.toggle('hidden');
    });

    $$('.filter-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        state.filter = btn.dataset.filter;
        applyFilter();
        renderCard();
        updateFilterUI();
      });
    });

    window.addEventListener('hashchange', route);
  }

  // === Service Worker ===
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  // === Init ===
  function init() {
    registerSW();
    initEvents();
    initSwipe();
    initKeyboard();
    route();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
