// pages/history/history.js
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '2016-09-01',
        color_arr: ['#FF6490', '#A28EFF', '#FFC471'],
        orderGroup: [
            {
                "id": 1,
                "date": '2019-05-02',
                "des": '',
                "ordersn": '65495929'
            }, {
                "id": 2,
                "date": '2019-05-02',
                "des": '',
                "ordersn": '65495929'
            }, {
                "id": 3,
                "date": '2019-05-02',
                "des": '',
                "ordersn": '65495929'
            }, {
                "id": 4,
                "date": '2019-05-02',
                "des": '',
                "ordersn": '65495929'
            },
        ],
        startDate:'',
        endDate:'',
        showDate: false,
        doEnsureStatus: false,
        paddingTop: '160rpx',
        noData: false,//false 有数据， true无数据，无需加载
        searchLoading: false,//加载中
        loadingSuccess: false,//已加载全部
        page: 1,
        inputValue: ''
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
    closeDate() {
        this.setData({
            startDate: '',
            endDate: '',
            paddingTop: '160rpx',
            doEnsureStatus: false
        })
    },
    bindStartDateChange: function (e) {
        let _this = this,
            endDate = _this.data.endDate,
            startDate = e.detail.value
        _this.SetDateRange(1,startDate,endDate)
    },
    bindEndDateChange: function (e) {
        let _this = this,
            startDate = _this.data.startDate,
            endDate = e.detail.value
        _this.SetDateRange(2,startDate,endDate)
    },
    /*
    * 判断日期大小 falg 1 表示开始日期触发， 2表示结束日期触发
    * **/
    SetDateRange(flag,startDate,endDate) {
        if(flag == 1) {
            if(endDate) {
                console.log('来了')
                this.checkDate(flag,startDate,endDate)
            }else{
                this.setData({
                    startDate: startDate
                })
            }
        }else {
            if(startDate) {
                this.checkDate(flag,startDate,endDate)
            }else{
                this.setData({
                    endDate: endDate
                })
            }
        }
    },
    checkDate(flag,startDate,endDate) {
        let startDate1 = startDate.replace(/-/g,''),
            endDate1 = endDate.replace(/-/g,'')
        if(Number(startDate1) > Number(endDate1)) {
            if(flag == 1) {
                endDate = startDate
            }else if(flag == 2) {
                startDate = endDate
            }
        }
        this.setData({
            endDate: endDate,
            startDate: startDate
        })
        this.setPaddingTop()
    },
    doDateEnsure() {
        //判断开始日期和结束日期是否都有
        let _this = this,
            startDate = _this.data.startDate,
            endDate = _this.data.endDate
        if(!startDate || !endDate) {
            tool.showMyToast({'title':'请选择日期范围！','duration':500})
            return false
        }
        this.setData({
            showDate: false,
            doEnsureStatus: true
        })
        this.setPaddingTop()
    },
    doDateClose() {
        this.setData({
            showDate: false
        })
        this.setPaddingTop()
    },
    doShowSelectDate() {
        this.setData({
            showDate: true
        })
        this.setPaddingTop()
    },
    setPaddingTop() {
        let _this = this,
            startDate = _this.data.startDate,
            endDate = _this.data.endDate,
            doEnsureStatus = _this.data.doEnsureStatus,
        paddingTop = (startDate && endDate && doEnsureStatus)?'260rpx':'160rpx'
        _this.setData({
            paddingTop: paddingTop
        })
    },
    onReachBottom() {
        console.log('上啦加载')
        let _this = this,
            loadingSuccess = _this.data.loadingSuccess
        if(!loadingSuccess) {
            _this.getOrderGroup(2)
        }
    },
    onPullDownRefresh() {
        console.log('下啦刷新')
        let _this = this
        _this.setData({
            page: 1
        })
        _this.getOrderGroup(2)
    },
    getOrderGroup(flag) {//flag：1表示进页面是加载数据，2表示刷新加载
        let _this = this,
            page = _this.data.page,
            inputValue = _this.data.inputValue,
            startDate = _this.data.startDate,
            endDate = _this.data.endDate,
            param = {
                'startDate': startDate,
                'endDate': endDate,
                'inputValue': inputValue,
                'page': page,
                'show': flag==1?true:false
            },
            obj = {},
            data = [],
            orderGroup = _this.data.orderGroup,
            noData = false,
            orderSum = 0
        if(flag == 2){
            _this.setData({
                searchLoading: true
            })
        }
        myApi.myPost('getHistoryOrderGroup',param).then(res => {
            wx.stopPullDownRefresh()
            data = res.message.data
            console.log('加血数据')
            console.log(orderGroup)
            console.log(data)
            if(data) {
                orderGroup = flag==1?data:orderGroup.concat(data)
                orderSum = flag==1?orderSum.length:orderSum+data.length
            }
            page = page + 1
            noData = orderGroup?false:true
            obj['orderGroup'] = orderGroup
            obj['page'] = page
            obj['noData'] = noData
            obj['searchLoading'] = false
            obj['orderSum'] = orderSum
            //已加载全部
            obj['loadingSuccess'] = (res.message.status == 2 && res.message.data)?true:false
            _this.setData(obj)
        })
    },
    onInput: tool.debounce(
        function(e) {
            let that = this,
                val = e[0].detail.value.trim()
            that.setData({
                inputValue:val
            })
            that.getOrderGroup(2)
        },500
    ),
    clearInput() {
        console.log('清空')
        this.setData({
            inputValue: ''
        })
        this.getOrderGroup(2)
    }
})