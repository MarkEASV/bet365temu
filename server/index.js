import express from 'express'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'

dotenv.config({ path: path.resolve('./server/.env') })

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

console.log('Backend running – free-plan safe fixtures ready')

const generateMockFixtures = () => {
  const todayStr = new Date().toISOString().slice(0, 10)
  const fixtures = []
  for (let i = 1; i <= 5; i++) {
    fixtures.push({
      id: `mock-${i}`,
      localteam_id: i,
      visitorteam_id: i + 10,
      localteam: { name: `Mockupkamp ${i}A` },
      visitorteam: { name: `Mockupkamp ${i}B` },
      league_id: 271, 
      time: { starting_at: `${todayStr}T15:00:00Z` }
    })
  }
  return fixtures
}

app.get('/api/fixtures', async (req, res) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  let fixtures = []

  try {
    // superliga
    const response = await fetch(
      `https://soccer.sportmonks.com/api/v3/football/fixtures?leagues=271&date=${todayStr}&api_token=${process.env.SPORTSMONKS_TOKEN}`
    )
    const json = await response.json()

    if (json.data && json.data.length > 0) {
      fixtures = json.data
      console.log('Fundet kampe fra Superliga!')
    } else {
      fixtures = generateMockFixtures()
      console.log('Ingen kampe fundet, bruger mockup fixtures')
    }
  } catch (err) {
    console.log('Fejl ved hentning af Superliga:', err.message)
    fixtures = generateMockFixtures()
    console.log('Bruger mockup fixtures pga. fejl')
  }

  res.json({ data: fixtures })
})

app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`))
