# lyricsfy

 [![CircleCI](https://circleci.com/gh/izn/lyricsfy.svg?style=svg)](https://circleci.com/gh/izn/lyricsfy) [![Maintainability](https://api.codeclimate.com/v1/badges/b98ee61347c5437985fd/maintainability)](https://codeclimate.com/github/izn/lyricsfy/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b98ee61347c5437985fd/test_coverage)](https://codeclimate.com/github/izn/lyricsfy/test_coverage)

experimental terminal-based script to show lyrics based on current playing song on spotify desktop client.

![Demo](https://github.com/izn/lyricsfy/blob/master/demo.gif)

### setup

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
