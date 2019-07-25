//index.js
const tool = require("../../utils/tool.js")
const app = getApp()
var myApi = app.globalData.myApi
Page({
    data: {
        formbtnallow: true,
        form: {
            xlh: 'admin',
            zh: '',
            pwd: '0000'
        },
        errorTips: {
            xlh: '请输入企业系列号',
            zh: '请输入账号',
            pwd: '请填写密码'
        },
        messTitle: '密码错误'
    },
    onInput(e) {
        this.bindFormData(e)
    },
    bindFormData(e) {
        let val = e.detail.value,id = e.currentTarget.id,str = 'form.'+id
        this.setData({
            [str]: tool.strTrim(val)
        })
    },
    //判断不为空
    checkPra() {
        let _this = this,
            form = _this.data.form,
            errorTips = _this.data.errorTips,
            status = true
        for (let index in form) {
            if(!tool.strTrim(form[index])) {
                wx.hideLoading()
                tool.showMyToast({'title': errorTips[index]})
                _this.setData({
                    formbtnallow: true
                })
                status = false
                return
            }
        }
        return status
    },
    login() {
        let _this = this,
            formbtnallow = _this.data.formbtnallow,
            form = _this.data.form
        if (!formbtnallow) {
            return;
        }
       /* wx.showLoading({
            title: '登录中'
        })*/
        _this.setData({
            formbtnallow: false
        })
        if(_this.checkPra()) {
            console.log('检查通过')
            form['show'] = true
            form['title'] = '登入中...'
            myApi.myGet('login',form).then( res => {
                if(res.message.return_code == 200) {
                    wx.switchTab({
                        url: '../index/index'
                    })
                }
                _this.setData({
                    formbtnallow: true
                })
            })
        }
    },
    onLoad: function () {
        wx.switchTab({
            url: '../index/index'
        })
    },
    getUserInfo: function (e) { }
})