const DBus = require('dbus')
const { showError } = require('./utils')

var SpotifyDBUS = {
  getSpotifyMetadata: function(spinner, callback) {
    DBus.getBus('session').getInterface(
      'org.mpris.MediaPlayer2.spotify',
      '/org/mpris/MediaPlayer2',
      'org.mpris.MediaPlayer2.Player',
      (error, interface) => {
        if (error || !interface) showError(spinner, 'Something went wrong. Is Spotify Running?')

        interface.getProperty('Metadata', function(error, metadata) {
          let artist = metadata['xesam:artist'][0]
          let title = metadata['xesam:title']

          spinner.succeed()

          callback(spinner, artist, title)
        })
      }
    )
  }
}

module.exports = SpotifyDBUS
