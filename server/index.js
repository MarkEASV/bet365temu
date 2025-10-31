import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
app.use(cors())
app.use(express.json())

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')

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
  try {
    const response = await fetch(
      `https://soccer.sportmonks.com/api/v3/football/fixtures?leagues=271&date=${todayStr}&api_token=${process.env.SPORTSMONKS_TOKEN}`
    )
    const json = await response.json()
    if (json.data && json.data.length > 0) {
      return res.json({ data: json.data })
    }
    return res.json({ data: generateMockFixtures() })
  } catch {
    return res.json({ data: generateMockFixtures() })
  }
})

app.use(express.static(distPath))
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
)
