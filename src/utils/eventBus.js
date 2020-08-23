class eventBus {
    constructor() {
        this.callbacks = {}
    }
    on(key, fn) {
        if(!key || !fn) return
        (this.callbacks[key] || (this.callbacks[key] = [])).push(fn)
    }
    emit(key, data) {
        let item = this.callbacks[key]
        if(item && item.length) {
            item.forEach(fn => fn.call(this, data))
        }
    }
    off(key) {
        if(key && this.callbacks[key]) delete this.callbacks[key] 
    }
    once(key, fn){
        if(!key || !fn) return
        let originFn = fn,
        id = Date.now() + '' + Math.floor(Math.random() * 1000000);
        fn = (...args) => {
            originFn.call(this, ...args) 
            let list = this.callbacks[key]
            let index = list.findIndex(val => val.id === id)
            if(index > -1) list.splice(index, 1) 
        };
        fn.id = id;
        (this.callbacks[key] || (this.callbacks[key] = [])).push(fn);
    }
}
module.exports = eventBus