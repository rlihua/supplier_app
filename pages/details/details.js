// pages/details/details.js
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        placeClass: 'placeClass',
        imgBgUrl: myApi.imgBgUrl,
        orderInfo: {},
        loadingStatus: true,
        loadingTip: '加载中...',
        loadingImg: '',
        orderStatus: 0,//1 已接单，0未接单
        pageflag: 0,//1表示从历史订单中进来的，2表示从首页列表中进来
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            loadingStatus: true
        })
        tool.checkLoginInfo()
        if(options.id) {
            this.setData({
                id: options.id,
                pageflag: options.pageflag
            })
        }
        this.getOrderInfo()
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
        /*console.log('页面卸载了')
        console.log(getCurrentPages())
        let pages = getCurrentPages()
        pages.some((item,index) => {
            if(item.route == 'pages/history/history') {
                item.setData({
                    pageflag: 2
                })
                return true
            }
        })*/
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
            if(res.message.return_code == 200) {//接单成功
                _this.setData({
                    rewsClass: 'animated fadeOutDownBig'
                })
                tool.showMyToast({'title': '接单成功','duration':800})
            }
        })
    },
    getOrderInfo() {
        let _this = this,
            id = _this.data.id,
            param = { id:id,show: true,title: '加载中...'}
        myApi.myPost('GetOrderInfo',param).then(res => {
             _this.setData({
                 orderInfo: res.message.data,
                 loadingStatus: false,
                 orderStatus: res.message.orderStatus
             })
        })
    }
})