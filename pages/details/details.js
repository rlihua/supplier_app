// pages/details/details.js
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 1,
        placeClass: 'placeClass',
        orderInfo: {
            "basicsInfo": [
                {
                    "label": '需到货日期',
                    "value": '2019-05-20'
                }, {
                    "label": '订货日期',
                    "value": '2019-05-20'
                }, {
                    "label": '联系人',
                    "value": '阮'
                }, {
                    "label": '手机号',
                    "value": '18887655220'
                }, {
                    "label": '订单号',
                    "value": '2164156154185'
                }, {
                    "label": '送货地址',
                    "value": '福建省厦门市湖里区观音山雀氏财富中心11楼'
                }
            ]
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
    callPhone(e) {
        let phone = e.currentTarget.dataset.phone
        wx.makePhoneCall({
            phoneNumber: phone //仅为示例，并非真实的电话号码
        })
    },
    doTakeOrder() {
        let _this = this,
            id = _this.data.id,
            param = { id:id,show: true,title: '接单中...'}
        myApi.myPost('doTakeOrder',param).then(res => {
            if(res.message.status == 1) {//接单成功
                tool.showMyToast({'title': '接单成功','duration':800})
            }
        })
    }
})