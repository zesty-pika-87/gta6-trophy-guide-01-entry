// Filters: kind, grade, search text and the spoiler rule for story trophies.
export function visibleTrophies(doc, state, filters) {
  const query = (filters.search ?? '').trim().toLowerCase();
  return doc.trophies.filter((t) => {
    if (filters.kind === 'story' && t.kind !== 'story') return false;
    if (filters.kind === 'missable' && t.missable !== 'potential') return false;
    if (filters.kind === 'collectibles' && t.kind !== 'collectibles') return false;
    if (filters.kind === 'activities' && t.kind !== 'activities') return false;
    if (filters.kind === 'hidden' && !t.hidden) return false;
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (query && !(t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query) || t.guide.toLowerCase().includes(query))) return false;
    return true;
  });
}

export function spoilerHides(trophy, state) {
  // Spoiler setting hides the name and description of story trophies until earned.
  if (!state.spoiler) return false;
  if (trophy.kind !== 'story') return false;
  return !state.earned.includes(trophy.id);
}

export function stageProgress(doc, state, stage) {
  const inStage = doc.trophies.filter((t) => t.stage === stage);
  const done = inStage.filter((t) => state.earned.includes(t.id)).length;
  return { done, total: inStage.length };
}

export function nextUpList(doc, state) {
  // Unearned first, in roadmap order (stage, then kind, then id); earned sink to the end.
  return [...doc.trophies].sort((a, b) => {
    const ea = state.earned.includes(a.id) ? 1 : 0;
    const eb = state.earned.includes(b.id) ? 1 : 0;
    if (ea !== eb) return ea - eb;
    if (a.stage !== b.stage) return a.stage - b.stage;
    return a.id - b.id;
  });
}
