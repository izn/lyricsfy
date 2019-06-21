var showError = function(spinner, message = null) {
  spinner.text = message || 'Something went wrong.'

  spinner.fail()
  return process.exit(0)
}

module.exports = { showError }
