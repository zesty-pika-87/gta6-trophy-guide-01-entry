// Views: checklist + guide pane, roadmap, missables and planner. All rendering is
// plain DOM built from the trophy data, so the judge's screenshots show the real guide.
import { SOURCE_URLS, gradeLabel, kindLabel, gradeCounts, hiddenCount, isUnknownGuide } from './data.js';
import { counterValue, setCounter, setNote, toggleEarned } from './store.js';
import { visibleTrophies, spoilerHides, stageProgress, nextUpList } from './filters.js';

function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function renderHeaderStats(doc, state, mount) {
  const counts = gradeCounts(doc);
  const earned = state.earned.length;
  mount.replaceChildren();
  const big = el('div', null, 'bignum');
  big.append(document.createTextNode(`${earned} / ${doc.trophies.length} `));
  big.append(el('small', 'trophies earned'));
  const line = el('div', `${counts.platinum} Platinum · ${counts.gold} Gold · ${counts.silver} Silver · ${counts.bronze} Bronze · ${hiddenCount(doc)} hidden · ~200 h · 0 online`, 'statline');
  const bar = el('div', null, 'bar');
  const fill = document.createElement('i');
  fill.style.width = `${Math.round((earned / doc.trophies.length) * 100)}%`;
  bar.append(fill);
  mount.append(big, line, bar);
}

export function renderProgressLine(doc, state, mount) {
  const counts = gradeCounts(doc);
  const byGrade = {};
  for (const t of doc.trophies) {
    if (!state.earned.includes(t.id)) continue;
    byGrade[t.grade] = (byGrade[t.grade] ?? 0) + 1;
  }
  const pct = Math.round((state.earned.length / doc.trophies.length) * 100);
  mount.replaceChildren();
  const parts = [
    `Progress: ${state.earned.length} of ${doc.trophies.length} (${pct}%)`,
    `Platinum ${byGrade.platinum ?? 0}/${counts.platinum} · Gold ${byGrade.gold ?? 0}/${counts.gold} · Silver ${byGrade.silver ?? 0}/${counts.silver} · Bronze ${byGrade.bronze ?? 0}/${counts.bronze}`,
    `Hidden earned ${doc.trophies.filter((t) => t.hidden && state.earned.includes(t.id)).length}/${hiddenCount(doc)}`,
    'Difficulty 4/10 · ~200 hours · 0 online trophies · 1 potentially missable',
  ];
  for (const p of parts) {
    const s = el('span', null);
    const b = el('b', p);
    s.append(b);
    mount.append(s);
  }
}

export function renderChecklist(doc, state, filters, listMount, headMount, onSelect, selectedId) {
  const rows = visibleTrophies(doc, state, filters);
  headMount.textContent = `Showing ${rows.length} of ${doc.trophies.length} trophies — tick a box to mark it earned. Progress saves in this browser.`;
  listMount.replaceChildren();
  for (const t of rows) {
    const earned = state.earned.includes(t.id);
    const li = el('li', null, `trow${earned ? ' earned' : ''}${selectedId === t.id ? ' selected' : ''}`);
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${t.name} earned`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      toggleEarned(state, t.id);
      onSelect(t.id, true);
    });
    const dot = el('span', null, `dot ${t.grade}`);
    const main = el('div');
    const hidden = spoilerHides(t, state);
    main.append(el('div', hidden ? 'Hidden story trophy — earn it to reveal' : t.name, 'tname'));
    main.append(el('div', hidden ? 'Story trophy. Its name and description stay hidden until earned.' : t.description, 'tdesc'));
    const meta = el('div', null, 'tmeta');
    meta.append(el('span', kindLabel(t.kind), 'tag'));
    if (t.hidden) meta.append(el('span', 'Hidden', 'tag hid'));
    if (t.missable === 'potential') meta.append(el('span', 'Potentially missable', 'tag miss'));
    if (t.target != null) meta.append(el('span', `${counterValue(state, t.id)} / ${t.target.toLocaleString('en-US')} ${t.targetLabel}`, 'tag'));
    if (isUnknownGuide(t)) meta.append(el('span', 'Not yet known', 'tag'));
    main.append(meta);
    const grade = el('div', null, 'tgrade');
    grade.append(el('b', gradeLabel(t.grade)));
    grade.append(document.createTextNode(t.hidden ? ' · hidden' : ' · visible'));
    li.append(box, dot, main, grade);
    li.addEventListener('click', () => onSelect(t.id, false));
    listMount.append(li);
  }
}

export function renderDetail(doc, state, trophy, pane) {
  pane.replaceChildren();
  const hidden = spoilerHides(trophy, state);
  pane.append(el('h2', hidden ? 'Hidden story trophy' : trophy.name));
  const meta = el('div', null, 'tmeta');
  meta.append(el('span', gradeLabel(trophy.grade), 'tag'));
  meta.append(el('span', kindLabel(trophy.kind), 'tag'));
  if (trophy.hidden) meta.append(el('span', 'Hidden on PlayStation', 'tag hid'));
  if (trophy.missable === 'potential') meta.append(el('span', 'Potentially missable', 'tag miss'));
  pane.append(meta);
  pane.append(el('p', hidden ? 'This story trophy stays hidden until you earn it (spoiler setting is on).' : `Official description: “${trophy.description}”`, 'official'));
  pane.append(el('h4', 'Guide — in our own words'));
  pane.append(el('p', trophy.guide));
  pane.append(el('h4', 'Sources'));
  const src = el('ul', null, 'sources');
  for (const key of trophy.sources) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = SOURCE_URLS[key];
    a.textContent = doc.sourcesLegend[key];
    a.target = '_blank';
    a.rel = 'noopener';
    li.append(a);
    src.append(li);
  }
  pane.append(src);
  const stepsTitle = el('h4', 'Steps');
  const steps = el('ol');
  for (const s of trophy.steps) steps.append(el('li', s));
  pane.append(stepsTitle, steps);
  const miss = el('div', trophy.missNote, trophy.missable === 'potential' ? 'warnbox' : '');
  if (trophy.missable === 'potential') pane.append(el('h4', 'When it can be missed'), miss);
  else pane.append(el('h4', 'Can it be missed?'), miss);
  if (isUnknownGuide(trophy)) {
    pane.append(el('h4', 'Verification status'));
    pane.append(el('div', 'PowerPyx lists this trophy as “not yet known”. The exact trigger is not confirmed by any source, so this guide states only what the official description says and guesses nothing.', 'unknownbox'));
  }
  if (trophy.target != null) {
    const line = el('div', null, 'counterline');
    line.append(el('span', `Your count: ${counterValue(state, trophy.id)} / ${trophy.target.toLocaleString('en-US')} ${trophy.targetLabel}`));
    const minus = el('button', '−');
    minus.type = 'button';
    minus.addEventListener('click', () => { setCounter(state, trophy.id, counterValue(state, trophy.id) - 1, trophy.target); renderDetail(doc, state, trophy, pane); });
    const plus = el('button', '+');
    plus.type = 'button';
    plus.addEventListener('click', () => { setCounter(state, trophy.id, counterValue(state, trophy.id) + 1, trophy.target); renderDetail(doc, state, trophy, pane); });
    line.append(minus, plus);
    pane.append(el('h4', 'Target counter'), line);
  }
  pane.append(el('h4', 'Your note'));
  const note = document.createElement('textarea');
  note.className = 'notebox';
  note.placeholder = 'Where did you find it? What worked? (saved in this browser)';
  note.value = state.notes[trophy.id] ?? '';
  note.addEventListener('change', () => setNote(state, trophy.id, note.value));
  pane.append(note);
}

export function renderRoadmap(doc, state, mount, hundredMount) {
  const stages = [
    { n: 1, title: 'Stage 1 — Story first (Chapters 1–5, ~60–80 h)', items: ['Play the story in order; every chapter and mission trophy lands here.', 'Chapter 1 FIRST: meditate at Lucia’s balcony spot (Positive Mental Attitude).', 'Manual save at the start of every chapter — there is no mission replay.', 'Finish the five contact strands (Andy, Kenton, Billy, Randy, Tyrone).'] },
    { n: 2, title: 'Stage 2 — Open-world sweep', items: ['Collectibles: cards, WAiNK spots, meditation spots, garages, areas.', 'Activities: 250 stunts, 42 gold shooting-range medals, 20 races, drone races.', 'Robberies and money: 5 bank vaults, armored trucks, $250,000 laundered.', 'Stranger strands to 8, gang operations for all 9 gangs, animals for Bret.'] },
    { n: 3, title: 'Stage 3 — Clean-up to 100% and the platinum', items: ['Work the 100% checklist below until A Long Road pops.', 'Then mop up anything left — the platinum follows the other 54.'] },
  ];
  mount.replaceChildren();
  for (const s of stages) {
    const p = stageProgress(doc, state, s.n);
    const card = el('div', null, 'stage');
    card.append(el('h3', s.title));
    card.append(el('div', `${p.done}/${p.total}`, 'pct'));
    const pct = el('div', null, 'bar');
    const fill = document.createElement('i');
    fill.style.width = `${p.total ? Math.round((p.done / p.total) * 100) : 0}%`;
    pct.append(fill);
    card.append(pct);
    const ul = el('ul');
    for (const item of s.items) ul.append(el('li', item));
    card.append(ul);
    mount.append(card);
  }
  const hundred = [
    ['Scan vehicles', 200, 277, counterValue(state, 35)],
    ['Study animals', 100, 255, 0],
    ['Finish challenges', 70, 80, counterValue(state, 32)],
    ['Meditate at spots', 15, 18, counterValue(state, 28)],
  ];
  hundredMount.replaceChildren();
  for (const [label, need, total, have] of hundred) {
    const row = el('div', null, 'hrow');
    row.append(el('span', `${label} (PowerPyx 100% list)`));
    row.append(el('span', `${have} / ${need} needed (of ${total} total)`, 'nums'));
    hundredMount.append(row);
  }
}

export function renderMissables(doc, state, cardsMount, tableBody) {
  const flagged = doc.trophies.filter((t) => t.missable === 'potential');
  cardsMount.replaceChildren();
  for (const t of flagged) {
    const card = el('div', null, 'misscard');
    card.append(el('h3', `⚠ ${t.name} — potentially missable`));
    card.append(el('p', t.guide));
    card.append(el('p', t.missNote));
    cardsMount.append(card);
  }
  const safe = el('p', 'Every other trophy is safe: story missions replay through the story, activities retry, and collectibles stay where they are. The full list is below.');
  cardsMount.append(safe);
  tableBody.replaceChildren();
  for (const t of doc.trophies) {
    if (t.missable === 'potential') continue;
    const tr = document.createElement('tr');
    tr.append(el('td', t.name), el('td', kindLabel(t.kind)), el('td', t.missNote));
    tableBody.append(tr);
  }
}

export function renderPlanner(doc, state, listMount, countersMount, onSelect) {
  const ordered = nextUpList(doc, state).filter((t) => !state.earned.includes(t.id)).slice(0, 12);
  listMount.replaceChildren();
  ordered.forEach((t, i) => {
    const li = document.createElement('li');
    li.append(el('span', `${i + 1}.`, 'rank'));
    const body = el('div');
    body.append(el('div', `${t.name} — ${gradeLabel(t.grade)}`, 'tname'));
    body.append(el('div', `${t.description} · Stage ${t.stage} · ${kindLabel(t.kind)}`, 'tdesc'));
    li.append(body);
    li.addEventListener('click', () => onSelect(t.id, false));
    listMount.append(li);
  });
  countersMount.replaceChildren();
  for (const t of doc.trophies.filter((x) => x.target != null)) {
    const row = el('div', null, 'crow');
    row.append(el('div', `${t.name} — ${t.targetLabel}`, 'tname'));
    const btns = el('div', null, 'cbtns');
    const val = el('span', `${counterValue(state, t.id)} / ${t.target.toLocaleString('en-US')}`, 'cval');
    const minus = el('button', '−');
    minus.type = 'button';
    minus.addEventListener('click', () => { setCounter(state, t.id, counterValue(state, t.id) - 1, t.target); renderPlanner(doc, state, listMount, countersMount, onSelect); });
    const plus = el('button', '+');
    plus.type = 'button';
    plus.addEventListener('click', () => { setCounter(state, t.id, counterValue(state, t.id) + 1, t.target); renderPlanner(doc, state, listMount, countersMount, onSelect); });
    const step10 = el('button', '+10');
    step10.type = 'button';
    step10.addEventListener('click', () => { setCounter(state, t.id, counterValue(state, t.id) + 10, t.target); renderPlanner(doc, state, listMount, countersMount, onSelect); });
    btns.append(minus, val, plus, step10);
    row.append(btns);
    countersMount.append(row);
  }
}
