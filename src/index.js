#!/usr/bin/env node
const ora = require('ora')
const chalk = require('chalk')

const getLyrics = require('./lyrics')
const renderScreen = require('./screen')

const {
  getTrack,
  metadataChangeListener
} = require('./spotify-dbus')

const spinner = ora('Starting...').start()

let mainScreen
let currentTrackID

const getCurrentSong = () => {
  return new Promise(async (resolve) => {
    try {
      const track = await getTrack()

      spinner.succeed()

      currentTrackID = track.trackID

      resolve({
        artist: track.artist,
        title: track.title
      })
    } catch (exception) {
      spinner.fail(exception.message)
      process.exit(1)
    }
  })
}

const fetchLyrics = (currentArtist, currentTitle) => {
  return new Promise(async (resolve) => {
    try {
      const currentTrack = chalk.bold(`${currentArtist} - ${currentTitle}`)

      spinner.text = `Current song: ${currentTrack}`
      spinner.succeed()

      spinner.text = 'Searching lyrics...'
      spinner.start()

      const {
        artist,
        title,
        lyrics
      } = await getLyrics(currentArtist, currentTitle)

      spinner.succeed()

      resolve({ artist, title, lyrics })
    } catch (exception) {
      spinner.fail(exception.message)
      process.exit(1)
    }
  })
}

const drawScreen = (artist, title, lyrics) => {
  mainScreen = renderScreen(artist, title, lyrics)
}

getCurrentSong()
  .then(({ artist, title }) => {
    fetchLyrics(artist, title)
      .then(({ artist, title, lyrics }) => {
        drawScreen(artist, title, lyrics)
      })
  })

// BETA: Auto-reload

metadataChangeListener(({ trackID, artist, title }) => {
  if (currentTrackID === trackID) {
    return
  }

  mainScreen.realloc()

  fetchLyrics(artist, title)
    .then(({ artist, title, lyrics }) => {
      currentTrackID = trackID
      drawScreen(artist, title, lyrics)
    })
})
