const fetch = require('node-fetch')
const cheerio = require('cheerio')

const GENIUS_URL = 'https://genius.com'

const getLyrics = async (artist, title) => {
  const query = encodeURIComponent(`${artist} ${title}`)

  const geniusURL = `${GENIUS_URL}/api/search/multi?q=${query}`

  const response = await fetch(geniusURL)
  const data = await response.json()

  const songPath = getSongPath(data.response)
  const lyrics = await fetchLyrics(songPath)

  return lyrics
}

const getSongPath = (response) => {
  try {
    const songSection = response.sections.find(section => section.type == 'song')
    const firstHit = songSection.hits[0]

    return firstHit.result.path
  } catch (exception) {
    throw new Error('Lyrics not found :(')
  }
}

const fetchLyrics = async (path) => {
  const geniusTrackURL = `${GENIUS_URL}${path}`

  const response = await fetch(geniusTrackURL)
  const responseHTML = await response.text()

  const $ = cheerio.load(responseHTML)

  const title = $('h1.header_with_cover_art-primary_info-title').text().trim()
  const artist = $('a.header_with_cover_art-primary_info-primary_artist').text().trim()

  const lyrics = $('.lyrics').text().trim()

  if (!title || !artist || !lyrics) {
    throw new Error('Error while parsing lyrics. Please, try again.')
  }

  return { artist, title, lyrics }
}

module.exports = getLyrics
