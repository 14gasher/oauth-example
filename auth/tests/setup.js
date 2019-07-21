const DebugControl = require('../utilities/debug.js')
DebugControl.setLevel(DebugControl.levels.NONE)

module.exports = {
  server: require('../app.js')
}
