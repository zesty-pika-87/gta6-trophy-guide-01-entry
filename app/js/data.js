// Trophy data: loads app/data/trophies.json (same-origin, offline) and labels it.
export const SOURCE_URLS = {
  exophase: 'https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/',
  psnprofiles: 'https://psnprofiles.com/trophies/43531-grand-theft-auto-vi',
  powerpyx: 'https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/',
};

export async function loadTrophyData() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('trophies.json did not load');
  const doc = await response.json();
  return doc;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', other: 'Other', hidden: 'Hidden' };
  return labels[kind] ?? kind;
}

export function trophyById(doc, id) {
  return doc.trophies.find((t) => t.id === Number(id)) ?? doc.trophies[0];
}

export function gradeCounts(doc) {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of doc.trophies) counts[t.grade] = (counts[t.grade] ?? 0) + 1;
  return counts;
}

export function hiddenCount(doc) {
  return doc.trophies.filter((t) => t.hidden).length;
}

export function isUnknownGuide(trophy) {
  return /not yet known/i.test(trophy.guide) || /not yet verified/i.test(trophy.guide);
}
