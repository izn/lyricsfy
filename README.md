# lyricsfy

experimental terminal-based script to show lyrics based on current playing song on spotify desktop client.

![Alt Text](https://i.imgur.com/RAczBwG.gif)

### setup

copy `config.sample.js` to `config.js` and put your [genius api](https://genius.com/api-clients) access token there.

install node dependencies and create a binary link:

```sh
yarn install
npm link
```

#### dbus

make sure you have installed `libdbus-glib-1-dev`.

see [this](https://github.com/zbentley/dbus-osx-examples/tree/master/installation) for osx.

### usage

play a song on spotify desktop client and run: `lyricsfy`

#### thanks to

based on [glyrics](https://github.com/candh/glyrics). thanks, [@candh](https://github.com/candh).
