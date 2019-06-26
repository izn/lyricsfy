const { showError } = require('./utils')

describe('showError', () => {
  let dummySpinner, processExitStub

  beforeAll(() => {
    processExitStub = jest.spyOn(process, 'exit').mockImplementation(() => {})
    dummySpinner = { text: jest.fn(), fail: jest.fn() }

    showError(dummySpinner)
  })

  it('shows up error message', () => {
    expect(dummySpinner.text).toBe('Something went wrong.')
  })

  it('calls fail spinner', () => {
    expect(dummySpinner.fail).toHaveBeenCalledTimes(1)
  })

  it('calls process exit', () => {
    expect(processExitStub).toHaveBeenCalledWith(0)
  })
})
