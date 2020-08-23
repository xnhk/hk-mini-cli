//app.js
require('./mixins/setting.js')
const eventBus = require('./utils/eventBus.js') 
 
App({
  onLaunch: function () {
    
  }, 
  $bus: new eventBus(),
  globalData: {
    userInfo: null
  }
})