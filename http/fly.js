var Fly = require("../libs/wx.js") //wx.js为flyio的微信小程序入口文件
import config from "./config.js"

var fly = new Fly(); //创建fly实例
//添加请求拦截器
fly.interceptors.request.use((request) => {
    let body = request.body
    let show = body.show || false
    if(show){
        wx.showLoading({
            title: body.title || '玩命加载中...',
            mask: true
        })
    }
    //给所有请求添加自定义header
    request.headers["X-Tag"] = "flyio"
    request.headers["content-type"] = "application/x-www-form-urlencoded"
    let session_id = wx.getStorageSync('session_id')
    if(session_id) request.headers["Cookie"] = "PHPSESSID="+session_id
    return request
})

// 添加响应拦截器
fly.interceptors.response.use(
    (response) => {
        wx.hideLoading()
        let param = {},session_id = ''
        param.return_mess = response.data.message.return_mess
        if(response.data.message.return_code == 204) {
            if(response.data.message.session_id) {
                session_id = response.data.message.session_id
                wx.setStorageSync('session_id', session_id)
            }
            param.duration = 1000
            param.reset = 1
            showToast(param)
            return false
        }
        if(response.data.message.return_code != 200) {
            param.duration = 2000
            showToast(param)
        }
        return response.data // 请求成功之后将返回值返回
    },
    (err) => {
        // 请求出错，根据返回状态码判断出错原因
        wx.hideLoading()
        wx.showToast({
            title: '网络不流畅，请稍后再试！',
            icon: 'none'
        })
    }
)
const showToast = (param) => {
    wx.showToast({
        title: param.return_mess,
        duration: param.duration || 2000,
        icon: 'none',
        mask: true
    })
    if(param.reset == 1) {
        try {//gsId,gysId,dlzh
            wx.removeStorageSync('gsId')
            setTimeout(()=> {
                wx.reLaunch({
                    url: '/pages/login/login',
                    fail: res => {
                        console.log(res)
                    }
                })
            },1000)
        } catch (e) {

        }
    }
}
//配置请求基地址

fly.config.baseURL = config.host
fly.config.timeout = 10000
fly.config.params = {'title': '玩命加载中....', 'storeid': '1134', 'weid': '175'}

export default fly
