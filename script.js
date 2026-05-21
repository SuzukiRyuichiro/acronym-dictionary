const acronyms = [];
let currentLang = 'en';
let filtered = [];

async function loadData() {
  try {
    const res = await fetch('acronyms.json');
    if (!res.ok) throw new Error('Failed to load acronyms.json');
    const data = await res.json();
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
    const li = document.createElement('li');
    li.textContent = 'No results';
    resultEl.appendChild(li);
    return;
  }
  list.forEach(item => {
    const li = document.createElement('li');
    const meaningKey = `meaning_${currentLang}`;
    const meaning = item[meaningKey] || item.meaning_en || '';
    li.textContent = `${item.acronym} - ${item.stands_for ?? ''} - ${meaning}`;
    resultEl.appendChild(li);
  });
}

loadData();
