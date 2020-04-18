const fetch = require('node-fetch')
const jsdom = require('jsdom').JSDOM
const chalk = require('chalk')

const config = require('./config')
const GENIUS_API_URL = 'https://api.genius.com'
const GENIUS_URL = 'https://genius.com'

const getLyrics = async (artist, title) => {
  const query = escape(`${artist} ${title}`)

  const API_URL = `${GENIUS_API_URL}/search?access_token=${config.access_token}&q=${query}`

  const response = await fetch(API_URL)
  const data = await response.json()

  const songPath = getSongPath(data.response)
  const lyrics = fetchLyrics(songPath)

  return lyrics
}

const getSongPath = (response) => {
  try {
    const firstHit = response.hits[0]

    return firstHit['result']['path']
  } catch (exception) {
    throw new Error('Lyrics not found :(')
  }
}

const fetchLyrics = async (path) => {
  const fullURL = `${GENIUS_URL}${path}`

  try {
    const dom = await jsdom.fromURL(fullURL)

    const windowDocument = dom.window.document

    const rawLyrics = windowDocument.querySelector('.lyrics').textContent.trim()
    const pageData = windowDocument.querySelector('meta[itemprop="page_data"]')

    const parsedDataContent = JSON.parse(pageData['content'])
    const trackingData = parsedDataContent.tracking_data

    const title = trackingData[1].value
    const artist = trackingData[2].value

    const artistWithSongTitle = chalk.yellow.bold(`${artist} - ${title}`)
    const highlightedLyrics = rawLyrics.replace(/^\[(.+)\]/gm, chalk.green.bold('[$1]'))

    const lyrics = [artistWithSongTitle, '\n', highlightedLyrics].join('\n')

    return lyrics
  } catch (exception) {
    throw new Error('Error while parsing lyrics. Please, try again.')
  }
}

module.exports = getLyrics
