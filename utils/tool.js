
const showMyToast = (param) => {
    wx.showToast({
        title: param.title,
        duration: param.duration||2000,
        icon: param.icon||'none',
        mask: true
    })
}

//是否存在存储值，没有，回到登入页面
const checkLoginInfo = () => {
    //已经登入过了，跳转到首页
    try {
        let gsId = wx.getStorageSync('gsId'),
            gysId = wx.getStorageSync('gysId'),
            dlzh = wx.getStorageSync('dlzh')
        if (gsId == '' || gysId == '' || dlzh == '') {
            console.log('进来')
            wx.reLaunch({
                url: '/pages/login/login',
                fail: res => {
                    console.log(res)
                }
            })
        }
    } catch (e) {
        // Do something when catch error
    }
}

//两边去空格
const strTrim = (str) => {
    return str.replace(/(^\s*)|(\s*$)/g, "")
}
/*函数节流*/
const throttle = (fn, interval) => {
    var enterTime = 0;//触发的时间
    var gapTime = interval || 800 ;//间隔时间，如果interval不传，则默认300ms
    return function() {
        var context = this;
        var backTime = new Date();//第一次函数return即触发的时间
        if (backTime - enterTime > gapTime) {
            fn.call(context,arguments);
            enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
        }
    };
}

/*函数防抖*/
const debounce = (fn, interval) => {
    let timer;
    let gapTime = interval || 800;//间隔时间，如果interval不传，则默认1000ms
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
    throttle,
    debounce,
    checkLoginInfo
}