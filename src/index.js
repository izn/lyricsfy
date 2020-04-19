#!/usr/bin/env node
const ora = require('ora')
const chalk = require('chalk')

const getTrack = require('./spotify-dbus')
const getLyrics = require('./lyrics')
const renderScreen = require('./screen')

const start = async () => {
  const spinner = ora('Starting...').start()

  try {
    const track = await getTrack(spinner)

    spinner.succeed()

    const currentTrack = chalk.bold(`${track.artist} - ${track.title}`)

    spinner.text = `Current song: ${currentTrack}`
    spinner.succeed()

    spinner.text = 'Searching lyrics...'
    spinner.start()

    const {
      artist,
      title,
      lyrics
    } = await getLyrics(track.artist, track.title)

    spinner.succeed()

    renderScreen(artist, title, lyrics)
  } catch (exception) {
    spinner.fail(exception.message)
    process.exit(1)
  }
}

start()
