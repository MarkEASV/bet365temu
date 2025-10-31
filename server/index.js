import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config({ path: path.resolve('./server/.env') })

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

console.log('Backend starting — fixtures service')

let fetchFn = null
if (typeof fetch === 'function') {
  fetchFn = fetch
} else {
  try {
    const nodeFetch = await import('node-fetch')
    fetchFn = nodeFetch.default || nodeFetch
  } catch (err) {
    console.error(
      'No fetch available. Install node-fetch or run Node 18+.\nError:',
      err.message
    )
    process.exit(1)
  }
}

// MOCKUP fixtures
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
      time: { starting_at: `${todayStr}T15:00:00Z` },
    })
  }
  return fixtures
}

app.get('/api/fixtures', async (req, res) => {
  const todayStr = new Date().toISOString().slice(0, 10)
  let fixtures = []

  try {
    const response = await fetchFn(
      `https://soccer.sportmonks.com/api/v3/football/fixtures?leagues=271&date=${todayStr}&api_token=${process.env.SPORTSMONKS_TOKEN}`
    )
    const json = await response.json()

    if (json.data && json.data.length > 0) {
      fixtures = json.data
      console.log('Found fixtures from Superliga')
    } else {
      fixtures = generateMockFixtures()
      console.log('No fixtures found — using mock fixtures')
    }
  } catch (err) {
    console.log('Error fetching Superliga:', err.message)
    fixtures = generateMockFixtures()
    console.log('Using mock fixtures due to error')
  }

  res.json({ data: fixtures })
})

app.get('/api/rounds/:roundId', async (req, res) => {
  const { roundId } = req.params
  try {
    const response = await fetchFn(
      `https://api.sportmonks.com/v3/football/rounds/${roundId}?include=fixtures.odds.market;fixtures.odds.bookmaker;fixtures.participants;league.country&filters=markets:1;bookmakers:2&api_token=${process.env.SPORTSMONKS_TOKEN}`
    )
    const json = await response.json()
    res.json(json)
  } catch (err) {
    console.error('Error fetching round data:', err.message)
    res.status(500).json({ error: 'Failed to fetch data' })
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.join(__dirname, '../dist')

app.use(
  express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css')
      } else if (filePath.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript')
      } else if (filePath.match(/\.(map)$/)) {
        res.setHeader('Content-Type', 'application/json')
      } else if (filePath.match(/\.(woff2?|ttf|eot|svg)$/)) {
        res.setHeader('Content-Type', 'font/woff2')
      }
      console.log('Serving static file:', filePath)
    },
    fallthrough: true,
  })
)

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' })
  }
  if (path.extname(req.path)) {
    return res.status(404).end()
  }
  if (!req.accepts || !req.accepts('html')) {
    return res.status(404).end()
  }
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err)
      res.status(err.status || 500).end()
    }
  })
})

export const api = app

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
