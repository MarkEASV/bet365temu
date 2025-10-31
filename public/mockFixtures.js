const todayStr = new Date().toISOString().slice(0, 10)
export const mockFixtures = Array.from({ length: 5 }).map((_, i) => ({
  id: `mock-${i + 1}`,
  localteam_id: i + 1,
  visitorteam_id: i + 11,
  localteam: { name: `Mockupkamp ${i + 1}A` },
  visitorteam: { name: `Mockupkamp ${i + 1}B` },
  league_id: 271,
  time: { starting_at: `${todayStr}T15:00:00Z` }
}))

export function getFixtures() {
  return { data: mockFixtures }
}
