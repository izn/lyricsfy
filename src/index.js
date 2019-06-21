#!/usr/bin/env node
const ora = require('ora')

const getSpotifyMetadata = require('./spotify-dbus')
const fetch = require('./lyrics')

const spinner = ora('Starting...').start();

getSpotifyMetadata(spinner, fetch)
