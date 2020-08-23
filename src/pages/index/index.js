//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
   
  },
  
  onLoad: function () {
    app.$bus.once('once', (data) => {
      console.log(data, 'once  11111')
    })
    setTimeout(() => {
      app.$bus.emit('once', 'once 22222')
    }, 5000)  
  }, 
  
})
