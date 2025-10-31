const todayStr = new Date().toISOString().slice(0, 10)

export const mockFixtures = [
  {
    id: 'mock-1',
    localteam_id: 1,
    visitorteam_id: 11,
    localteam: { name: 'Mockupkamp 1A' },
    visitorteam: { name: 'Mockupkamp 1B' },
    league_id: 271,
    time: { starting_at: `${todayStr}T15:00:00Z` }
  },
  {
    id: 'mock-2',
    localteam_id: 2,
    visitorteam_id: 12,
    localteam: { name: 'Mockupkamp 2A' },
    visitorteam: { name: 'Mockupkamp 2B' },
    league_id: 271,
    time: { starting_at: `${todayStr}T16:00:00Z` }
  },
  {
    id: 'mock-3',
    localteam_id: 3,
    visitorteam_id: 13,
    localteam: { name: 'Mockupkamp 3A' },
    visitorteam: { name: 'Mockupkamp 3B' },
    league_id: 271,
    time: { starting_at: `${todayStr}T17:00:00Z` }
  },
  {
    id: 'mock-4',
    localteam_id: 4,
    visitorteam_id: 14,
    localteam: { name: 'Mockupkamp 4A' },
    visitorteam: { name: 'Mockupkamp 4B' },
    league_id: 271,
    time: { starting_at: `${todayStr}T18:00:00Z` }
  },
  {
    id: 'mock-5',
    localteam_id: 5,
    visitorteam_id: 15,
    localteam: { name: 'Mockupkamp 5A' },
    visitorteam: { name: 'Mockupkamp 5B' },
    league_id: 271,
    time: { starting_at: `${todayStr}T19:00:00Z` }
  }
]
