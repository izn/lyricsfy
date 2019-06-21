#!/usr/bin/env node
const ora = require('ora')

const SpotifyDBUS = require('./spotify-dbus')
const Lyrics = require('./lyrics')

const spinner = ora('Starting...').start();

SpotifyDBUS.getSpotifyMetadata(spinner, Lyrics.fetch)
