const DBus = require('dbus')
const chalk = require('chalk')

const { showError } = require('./utils')

const SpotifyDBUS = {
  getInterface: (callback) => {
    return DBus
      .getBus('session')
      .getInterface(
        'org.mpris.MediaPlayer2.spotify',
        '/org/mpris/MediaPlayer2',
        'org.mpris.MediaPlayer2.Player',
        callback
      )
  },

  getSpotifyMetadata: (spinner, callback) => {
    SpotifyDBUS.getInterface((error, iface) => {
      if (error || !iface) showError(spinner, 'Something went wrong. Is Spotify Running?')

      iface.getProperty('Metadata', (error, metadata) => {
        if (error) showError(spinner)

        const artist = metadata['xesam:artist'][0]
        const title = metadata['xesam:title']

        spinner.succeed()

        const currentSong = chalk.bold(`${artist} - ${title}`)

        spinner.text = `Current song: ${currentSong}`
        spinner.start().succeed()

        callback(spinner, artist, title)
      })
    })
  }
}

module.exports = SpotifyDBUS.getSpotifyMetadata
