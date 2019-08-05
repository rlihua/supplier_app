// pages/changePassword/changePassword.js
const tool = require("../../utils/tool.js")
const app = getApp()
var myApi = app.globalData.myApi
Page({

    /**
     * 页面的初始数据
     */
    data: {
        oldPassword: "",
        newPassword1: "",
        newPassword2: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        tool.checkLoginInfo()
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

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
    onInput(e) {
        console.log(e)
        let id = e.currentTarget.id, value = e.detail.value
        this.setData({
            [id]: tool.strTrim(value)
        })
    },
    doSavePassword() {
        let _this = this,
            oldPassword = _this.data.oldPassword,
            newPassword1 = _this.data.newPassword1,
            newPassword2 = _this.data.newPassword2,
            param = {
                oldPassword: oldPassword,
                newPassword1: newPassword1,
                newPassword2: newPassword2,
                show: true,
                title: '修改中...'
            }
        /*if(!oldPassword){
            tool.showMyToast({'title': '请输入旧密码！','duration':1000})
            return false
        }
        if(!newPassword1){
            tool.showMyToast({'title': '请输入新密码！','duration':1000})
            return false
        }
        if(!newPassword2){
            tool.showMyToast({'title': '请再次输入新密码！','duration':1000})
            return false
        }*/
        if(newPassword1 != newPassword2) {
            tool.showMyToast({'title': '新密码和再次输入新密码不同，请重新输入！','duration':1000})
            return false
        }
        myApi.myGet('changePassword',param).then( res => {
            if(res.message.return_code == 200) {
                tool.showMyToast({'title': '密码修改成功','duration':800,'icon':'success'})
                try {//gsId,gysId,dlzh
                    wx.removeStorageSync('gsId')
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/login/login'
                        })
                    },800)
                } catch (e) {

                }
            }
            _this.setData({
                formbtnallow: true
            })
        })
    }
})