// 保存源page
const originPage = Page

Page = (options) => {
    const mixins = options.mixins
    if(Array.isArray(mixins)) {
        delete options.mixins
        options = merge(mixins, options)
    } 
    originPage(options)
}

// 定义小程序内置的属性/方法
const originProperties = ['data', 'properties', 'options']
const originMethods = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

function merge(mixins, options) {
    mixins.forEach(mixin => {
      if(Object.prototype.toString.call(mixin) !== '[object Object]') {
          throw new Error('mixin 类型必须为对象！')
      }
      for(let [key, value] of Object.entries(mixin)) {
          if(originProperties.includes(key)) {
            options[key] = {...value, ...options[key]}
          } else if(originMethods.includes(key)) {
            const originFn = options[key]
            options[key] = function(...args) {
                value.call(this, ...args)
                return originFn && originFn.call(this, ...args)
            } 
          } else {
            // 自定义方法混入
            options = { ...mixin, ...options }
          }
      } 
    })
    return options
}