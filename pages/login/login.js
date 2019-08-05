//index.js
const tool = require("../../utils/tool.js")
const app = getApp()
var myApi = app.globalData.myApi
const regeneratorRuntime = app.globalData.regeneratorRuntime
Page({
    data: {
        formbtnallow: true,
        form: {
            xlh: '',
            zh: '',
            pwd: ''
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
            if(!tool.strTrim(form[index]) && index != 'pwd') {
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
            form = _this.data.form,
            newForm = JSON.parse(JSON.stringify(form))
        if (!formbtnallow) {
            return;
        }
        _this.setData({
            formbtnallow: false
        })
        if(_this.checkPra()) {
            newForm['show'] = true
            newForm['title'] = '登入中...'
            myApi.myGet('login',newForm).then( res => {
                if(res.message.return_code == 200) {
                    _this.cacheLoginData(res.message.data)
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
    //登入成功，缓存登入数据
    cacheLoginData (data) {
        for(let i in data) {
            try{
                wx.setStorageSync(i, data[i])
            } catch (e) {

            }
        }
    },
    onLoad: function () {
        //已经登入过了，跳转到首页
        try {
            let _this = this,
                gsId = wx.getStorageSync('gsId'),
                gysId = wx.getStorageSync('gysId'),
                dlzh = wx.getStorageSync('dlzh'),
                xlh = wx.getStorageSync('xlh'),
                zh = wx.getStorageSync('dlzh'),
                sessionId = wx.getStorageSync('session_id')
            if (gsId && gysId && dlzh && sessionId) {
                wx.switchTab({
                 url: '../index/index'
                 })
            }else {
                _this.setData({
                    'form.xlh':xlh,
                    'form.zh':zh
                })
                //获取sessionid
                myApi.myGet('getSessionId',{}).then(res => {
                    wx.setStorageSync('session_id', res.message.session_id)
                })
            }
        } catch (e) {
            // Do something when catch error
        }
    },
    getUserInfo: function (e) { }
})