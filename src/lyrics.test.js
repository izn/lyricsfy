const nock = require('nock')
const getLyrics = require('./lyrics')

const geniusHTML = `
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    </head>
    <body>
     <h1 class="header_with_cover_art-primary_info-title">
      Heaven Or Las Vegas
    </h1>

     <h2>
      <a class="header_with_cover_art-primary_info-primary_artist">
        Cocteau Twins
      </a>
     </h2>

     <div class="lyrics">
        Heaven Or Las Vegas... aaaah!
      </div>
    </body>
  </html>
`

describe('getLyrics', () => {
  let lyrics

  describe('when lyrics exists', () => {
    beforeEach(async () => {
      nock('https://api.genius.com')
        .get(/\/search\?access_token=(\w+)&q=(.+)/)
        .reply(200, {
          response: {
            hits: [
              { result: { path: '/cocteau-twins-heaven-or-las-vegas' } },
              { result: { path: '/peacock-affect-wallflower' } }
            ]
          }
        })

      nock('https://genius.com')
        .get('/cocteau-twins-heaven-or-las-vegas')
        .reply(200, geniusHTML)

      lyrics = await getLyrics('Cocteau Twins', 'Heaven Or Las Vegas')
    })

    it('should return the proper artist', async () => {
      expect(lyrics.artist).toEqual('Cocteau Twins')
    })

    it('should return the proper title', () => {
      expect(lyrics.title).toEqual('Heaven Or Las Vegas')
    })

    it('should return the proper lyrics', () => {
      expect(lyrics.lyrics).toEqual('Heaven Or Las Vegas... aaaah!')
    })
  })

  describe('when lyrics are not found', () => {
    beforeEach(() => {
      nock('https://api.genius.com')
        .get(/\/search\?access_token=(\w+)&q=(.+)/)
        .reply(200, { response: {} })
    })

    it('should throw an exception', async () => {
      let lyrics = getLyrics('Cocteau Twins', 'Heaven Or Las Vegas')
      expect(lyrics).rejects.toThrow('Lyrics not found :(')
    })
  })

  describe('when parser fails', () => {
    beforeEach(() => {
      nock('https://api.genius.com')
        .get(/\/search\?access_token=(\w+)&q=(.+)/)
        .reply(200, {
          response: {
            hits: [
              { result: { path: '/cocteau-twins-heaven-or-las-vegas' } }
            ]
          }
        })

      nock('https://genius.com')
        .get('/cocteau-twins-heaven-or-las-vegas')
        .reply(200, '<html><body>invalid html</body></html>')
    })

    it('should throw an exception', () => {
      lyrics = getLyrics('Cocteau Twins', 'Heaven Or Las Vegas')
      expect(lyrics).rejects.toThrow('Error while parsing lyrics. Please, try again.')
    })
  })
})
