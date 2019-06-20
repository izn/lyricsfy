const DBus = require('dbus')

var SpotifyDBUS = {
  getSpotifyMetadata: function(spinner, callback) {
    DBus.getBus('session').getInterface(
      'org.mpris.MediaPlayer2.spotify',
      '/org/mpris/MediaPlayer2',
      'org.mpris.MediaPlayer2.Player',
      (error, interface) => {
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
