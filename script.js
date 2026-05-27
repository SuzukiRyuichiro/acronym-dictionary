// Theme handling
let currentTheme = 'dark';
const storedTheme = localStorage.getItem('preferredTheme');
if (storedTheme) currentTheme = storedTheme;
function setTheme(theme) {
  if (theme === 'light') {
    document.documentElement.dataset.theme = 'light';
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('preferredTheme', theme);
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.checked = theme === 'light';
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  if (sunIcon && moonIcon) {
    if (theme === 'light') { sunIcon.style.display='inline'; moonIcon.style.display='none'; }
    else { sunIcon.style.display='none'; moonIcon.style.display='inline'; }
  }
}
setTheme(currentTheme);
// End theme handling
const acronyms = [];
let currentLang = 'en';
// Override with stored preference if available
const storedLang = localStorage.getItem('preferredLanguage');
if (storedLang) currentLang = storedLang;
let filtered = [];

async function loadData() {
  try {
    const res = await fetch('acronyms.json');
    if (!res.ok) throw new Error('Failed to load acronyms.json');
    const data = await res.json();
    data.sort((a, b) => a.acronym.localeCompare(b.acronym));
    acronyms.push(...data);
    initLangSelect();
    filtered = acronyms;
    renderList(filtered);
  } catch (e) {
    console.error(e);
  }
}

function initLangSelect() {
  const select = document.getElementById('lang-select');
  const langs = new Set();
  acronyms.forEach(item => {
    Object.keys(item).forEach(k => {
      if (k.startsWith('meaning_')) {
        langs.add(k.slice('meaning_'.length));
      }
    });
  });
  Array.from(langs).sort().forEach(l => {
    const opt = document.createElement('option');
    opt.value = l;
    opt.textContent = l.toUpperCase();
    select.appendChild(opt);
  });
  select.value = currentLang;
  select.addEventListener('change', e => {
    currentLang = e.target.value;
    localStorage.setItem('preferredLanguage', currentLang);
    renderList(filtered);
  });
}

const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', e => {
  const term = e.target.value.trim().toLowerCase();
  filtered = acronyms.filter(item =>
    item.acronym?.toLowerCase().includes(term) ||
    item.stands_for?.toLowerCase().includes(term)
  );
  renderList(filtered);
});

function renderList(list) {
  const resultEl = document.getElementById('results');
  resultEl.innerHTML = '';
  if (list.length === 0) {
    const card = document.createElement('article');
    card.textContent = 'No results';
    resultEl.appendChild(card);
    return;
  }
  list.forEach(item => {
    const card = document.createElement('article');

    const header = document.createElement('header');
    header.textContent = currentLang === 'en' ? `${item.acronym}` : `${item.acronym} (${item.stands_for ?? ''})`;
    card.appendChild(header);

    const meaningKey = `meaning_${currentLang}`;
    const meaning = item[meaningKey] || item.meaning_en || '';
    const pMeaning = document.createElement('p');
    pMeaning.textContent = meaning;
    card.appendChild(pMeaning);

    const explanationKey = `explanation_${currentLang}`;
    const explanation = item[explanationKey] || '';
    if (explanation) {
      const explanationP = document.createElement('p');
      explanationP.textContent = explanation;
      card.appendChild(explanationP);
    }

    resultEl.appendChild(card);
  });
}

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('change', e => {
    const theme = e.target.checked ? 'light' : 'dark';
    setTheme(theme);
  });
}

loadData();
