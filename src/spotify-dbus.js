const DBus = require('dbus-next')

const getProxyObject = async () => {
  const sessionBus = DBus.sessionBus()

  return sessionBus.getProxyObject(
    'org.mpris.MediaPlayer2.spotify',
    '/org/mpris/MediaPlayer2'
  )
}

const getTrack = async (spinner) => {
  try {
    const proxyObject = await getProxyObject()
    const properties = proxyObject.getInterface('org.freedesktop.DBus.Properties')

    const metadata = await properties.Get(
      'org.mpris.MediaPlayer2.Player',
      'Metadata'
    )

    const artist = metadata.value['xesam:artist'].value[0]
    const title = metadata.value['xesam:title'].value

    return { artist, title }
  } catch (exception) {
    throw new Error('Something went wrong. Is Spotify Running?')
  }
}

module.exports = getTrack
