#!/usr/bin/env node
const ora = require('ora')
const chalk = require('chalk')

const getTrack = require('./spotify-dbus')
const getLyrics = require('./lyrics')
const render = require('./screen')

const start = async () => {
  const spinner = ora('Starting...').start()

  try {
    const { artist, title } = await getTrack(spinner)

    spinner.succeed()

    const currentTrack = chalk.bold(`${artist} - ${title}`)

    spinner.text = `Current song: ${currentTrack}`
    spinner.succeed()

    spinner.text = 'Searching lyrics...'
    spinner.start()

    const lyrics = await getLyrics(artist, title)

    spinner.succeed()

    render(lyrics)
  } catch (exception) {
    spinner.fail(exception.message)
    process.exit(1)
  }
}

start()
