
const showMyToast = (param) => {
    wx.showToast({
        title: param.title,
        duration: param.duration||2000,
        icon: param.icon||'none',
        mask: true
    })
}

//两边去空格
const strTrim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}

/*函数防抖*/
const debounce = function(fn, interval) {
    let timer;
    let gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
    return function() {
        clearTimeout(timer);
        let context = this;
        let args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
        timer = setTimeout(function() {
            fn.call(context,args);
        }, gapTime);
    };
}
module.exports = {
    showMyToast,
    strTrim,
    debounce
}