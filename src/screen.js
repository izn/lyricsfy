const blessed = require('blessed')
const chalk = require('chalk')

const render = (artist, title, lyrics) => {
  const screenTitle = chalk.yellow.bold(`${artist} - ${title}`)
  const highlightedLyrics = lyrics.replace(/^\[(.+)\]/gm, chalk.green.bold('[$1]'))

  const content = [screenTitle, '\n', highlightedLyrics].join('\n')

  const screen = blessed.screen({ smartCSR: true })

  const box = blessed.box({
    width: '85%',
    height: '85%',
    left: 'center',
    top: 'center',
    scrollable: true,
    alwaysScroll: true,
    keys: true,
    vi: true,
    content: content
  })

  screen.append(box)
  screen.render()

  screen.key(['escape', 'q', 'C-c'], () => process.exit(0))

  return screen
}

module.exports = render
