const blessed = require('blessed')

const render = (content) => {
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
}

module.exports = render
