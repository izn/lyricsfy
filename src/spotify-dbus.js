const DBus = require('dbus')
const chalk = require('chalk')

const { showError } = require('./utils')

const SpotifyDBUS = {
  getSpotifyMetadata: function(spinner, callback) {
    DBus.getBus('session').getInterface(
      'org.mpris.MediaPlayer2.spotify',
      '/org/mpris/MediaPlayer2',
      'org.mpris.MediaPlayer2.Player',
      (error, interface) => {
        if (error || !interface) showError(spinner, 'Something went wrong. Is Spotify Running?')

        interface.getProperty('Metadata', function(error, metadata) {
          const artist = metadata['xesam:artist'][0]
          const title = metadata['xesam:title']

          spinner.succeed()

          const currentSong = chalk.bold(`${artist} - ${title}`)

          spinner.text = `Current song: ${currentSong}`
          spinner.start().succeed()

          callback(spinner, artist, title)
        })
      }
    )
  }
}

module.exports = SpotifyDBUS.getSpotifyMetadata
