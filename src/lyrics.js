const request = require('request')
const jsdom = require('jsdom').JSDOM
const blessed = require('blessed')
const chalk = require('chalk')

const config = require('./config')
const { showError } = require('./utils')

const Lyrics = {
  fetch: function(spinner, artist, title) {
    spinner.text = 'Searching lyrics'
    spinner.start()

    const query = `${artist} ${title}`

    Lyrics.searchQuery(spinner, query)
  },

  searchQuery: function(spinner, query) {
    const options = {
      method: 'GET',
      url: 'https://api.genius.com/search',
      qs: {
        q: query,
        access_token: config.access_token
      },
    }

    request(options, (error, response, body) => {
      if (error) { showError(spinner) }

      Lyrics.parseResults(spinner, body)
    })
  },

  parseResults: function(spinner, body) {
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

  fetchLyrics: function(spinner, path) {
    const geniusURL = `https://genius.com${path}`
    const dom = jsdom.fromURL(geniusURL).then(dom => {
      spinner.succeed()

      const lyrics = Lyrics.parseLyrics(dom)

      Lyrics.startScreen(spinner, lyrics)
    })
  },

  parseLyrics: function(dom) {
    let rawLyrics = dom.window.document.querySelector('.lyrics').textContent.trim()
    let lyrics = rawLyrics.replace(/\[(.+)\]/g, chalk.green.bold('[$1]'))

    return lyrics
  },

  startScreen: function(spinner, text) {
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
      content: text,
    })

    screen.append(box)
    screen.render()

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0))
  }
}

module.exports = Lyrics
