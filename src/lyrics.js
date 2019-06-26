const request = require('request')
const jsdom = require('jsdom').JSDOM
const blessed = require('blessed')
const chalk = require('chalk')

const config = require('./config')
const { showError } = require('./utils')

const Lyrics = {
  fetch: (spinner, artist, title) => {
    spinner.text = 'Searching lyrics'
    spinner.start()

    const query = `${artist} ${title}`

    Lyrics.searchQuery(spinner, query)
  },

  searchQuery: (spinner, query) => {
    const options = {
      method: 'GET',
      url: 'https://api.genius.com/search',
      qs: { q: query, access_token: config.access_token }
    }

    request(options, (error, response, body) => {
      if (error) { showError(spinner) }

      Lyrics.parseResults(spinner, body)
    })
  },

  parseResults: (spinner, body) => {
    const parsedBody = JSON.parse(body)
    const response = parsedBody.response

    if (!response) { showError(spinner) }

    if (response.hits.length) {
      spinner.succeed()

      spinner.text = 'Fetching lyrics'
      spinner.start()

      const firstHit = response.hits[0]
      const songPath = firstHit['result']['path']

      Lyrics.fetchLyrics(spinner, songPath)
    } else {
      showError(spinner, 'Lyrics not found')
    }
  },

  fetchLyrics: (spinner, path) => {
    const geniusURL = `https://genius.com${path}`

    jsdom.fromURL(geniusURL).then(dom => {
      spinner.succeed()

      const lyrics = Lyrics.parseLyrics(dom)

      Lyrics.startScreen(spinner, lyrics)
    })
  },

  parseLyrics: (dom) => {
    const rawLyrics = dom.window.document.querySelector('.lyrics').textContent.trim()
    const pageData = dom.window.document.querySelector('meta[itemprop="page_data"]')

    const parsedDataContent = JSON.parse(pageData['content'])
    const trackingData = parsedDataContent.tracking_data

    const songTitle = trackingData[1].value
    const artist = trackingData[2].value

    const artistWithSongTitle = chalk.yellow.bold(`${artist} - ${songTitle}`)
    const highlightedLyrics = rawLyrics.replace(/^\[(.+)\]/gm, chalk.green.bold('[$1]'))

    const lyrics = [artistWithSongTitle, '\n', highlightedLyrics].join('\n')

    return lyrics
  },

  startScreen: (spinner, text) => {
    const screen = blessed.screen({ smartCSR: true })

    const box = blessed.box({
      width: '85%',
      height: '85%',
      left: 'center',
      top: 'center',
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      vi: true,
      content: text
    })

    screen.append(box)
    screen.render()

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
  }
}

module.exports = Lyrics.fetch
