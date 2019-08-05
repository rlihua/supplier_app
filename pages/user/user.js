// pages/user/user.js
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        gsId:'',
        dlzh: '',
        imgBgUrl: myApi.imgBgUrl,
        messTitle: '是否退出登录',
        messIcon: '../../static/image/user/out.png',
        showStatus: false,
        loadingStatus: false,
        loadingTip: '加载中...',
        loadingImg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            loadingStatus: true
        })
        wx.showLoading({
            title: '玩命加载中...',
            mask: true
        })
        this.getQyInfo()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        tool.checkLoginInfo()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.setData({
            showStatus: false
        })
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    launchOut() {
        this.setData({
            showStatus: true
        })
    },
    doLaunchOut(e) {
        let param = {'show': true,'title': '退出中...'}
        myApi.myPost('doLaunchOut',param).then(res => {
            if(res.message.return_code == 200) {
                try {//gsId,gysId,dlzh
                    wx.removeStorageSync('gsId')
                    wx.reLaunch({
                        url: '/pages/login/login'
                    })
                } catch (e) {

                }
            }
        })
    },
    //从缓存中获取企业信息
    getQyInfo() {
        try {
            let gsId = wx.getStorageSync('gsId'),
                gysId = wx.getStorageSync('gysId'),
                dlzh = wx.getStorageSync('dlzh'),
                mc = wx.getStorageSync('mc'),
                lolgo = wx.getStorageSync('lolgo'),
                xlh = wx.getStorageSync('xlh')
            this.setData({
                gsId,
                dlzh,
                mc,
                lolgo,
                xlh,
                loadingStatus: false
            })
            wx.hideLoading()
        } catch (e) {
            // Do something when catch error
        }
    }
})