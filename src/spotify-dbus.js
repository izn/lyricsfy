const DBus = require('dbus-next')

const getMetadataArtist = (metadata) => metadata.value['xesam:artist'].value[0]
const getMetadataTitle = (metadata) => metadata.value['xesam:title'].value

const getProperties = async () => {
  const sessionBus = DBus.sessionBus()

  const proxyObject = await sessionBus.getProxyObject(
    'org.mpris.MediaPlayer2.spotify',
    '/org/mpris/MediaPlayer2'
  )

  return proxyObject.getInterface('org.freedesktop.DBus.Properties')
}

const getMetadata = async () => {
  const properties = await getProperties()

  return properties.Get(
    'org.mpris.MediaPlayer2.Player',
    'Metadata'
  )
}

const getTrack = async () => {
  try {
    const metadata = await getMetadata()

    const artist = getMetadataArtist(metadata)
    const title = getMetadataTitle(metadata)

    return { artist, title }
  } catch (exception) {
    throw new Error('Something went wrong. Is Spotify Running?')
  }
}

let metadataChangeTimer

const metadataChangeListener = async (callback) => {
  const properties = await getProperties()

  properties.on('PropertiesChanged', (_, changed) => {
    clearTimeout(metadataChangeTimer)

    metadataChangeTimer = setTimeout(() => {
      let metadata = changed['Metadata']
      let playbackStatus = changed['PlaybackStatus']

      let artist = getMetadataArtist(metadata)
      let title = getMetadataTitle(metadata)

      callback({ artist, title })
    }, 1000)
  })
}

module.exports = { getTrack, metadataChangeListener }
