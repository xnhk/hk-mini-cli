//app.js
require('./mixins/setting.js')
const eventBus = require('./utils/eventBus.js') 
 
App({
  onLaunch: function () {
    
  }, 
  $bus: new eventBus(),
  globalData: {
    userInfo: null
  },
  getPage(index) {
    let num = index || 1
    var curPages =  getCurrentPages();
    if(curPages.length < 2) return false
    return curPages[curPages.length - (num + 1)]
  },
  commonModal(content, fn) {
    wx.showModal({
      title: '提示',
      content,
      success (res) {
        if (res.confirm) {
          fn && fn()
        } 
      }
    }) 
  },
  commonToast(title, icon) {
    wx.showToast({
      title,
      duration: 2500,
      icon: icon || 'none'
    })
  },
  // 节流
  throttle(fn, delay) {
    let timer = null 
    return function() {
      let context = this,
      args = arguments
      if(!timer) {
        timer = setTimeout(function(){
          fn.apply(context, args);
          timer = null;
        }, delay);
      }
    }
  },
})