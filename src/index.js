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
let lastTrackID

const getCurrentSong = () => {
  return new Promise(async (resolve) => {
    try {
      const track = await getTrack()

      spinner.succeed()

      lastTrackID = track.trackID

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

(async () => {
  const currentSong = await getCurrentSong()

  const { artist, title, lyrics } = await fetchLyrics(
    currentSong.artist,
    currentSong.title
  )

  drawScreen(artist, title, lyrics)
})()

// ALPHA: Auto-reload lyrics
metadataChangeListener(async (_, {
  trackID: currentTrackID,
  artist: currentArtist,
  title: currentTitle
}) => {
  if (lastTrackID === currentTrackID || !mainScreen) {
    return
  }

  mainScreen.realloc()

  const { artist, title, lyrics } = await fetchLyrics(currentArtist, currentTitle)

  currentTrackID = trackID

  drawScreen(artist, title, lyrics)
})
