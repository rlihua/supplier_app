// pages/history/history.js
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
const util = require("../../utils/util.js")
const regeneratorRuntime = app.globalData.regeneratorRuntime
// 初始化日期模态框数据
let date = new Date();
let years = [];
let months = [];
let days = [];

for (let i = 2010; i <= 2050; i++) {
    years.push(i + "年")
}
for (let i = 1; i <= 12; i++) {
    months.push(i + "月")
}
for (let i = 1; i <= 31; i++) {
    days.push(i + "日")
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: '2016-09-01',
        color_arr: ['#FF6490', '#A28EFF', '#FFC471'],
        imgBgUrl: myApi.imgBgUrl,
        orderGroup: [
            /*{
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
            },*/
        ],
        startDate:'',
        endDate:'',
        startDate1:'',
        endDate1:'',
        showDate: false,
        doEnsureStatus: false,
        paddingTop: '160rpx',
        noData: false,//false 有数据， true无数据，无需加载
        searchLoading: false,//加载中
        loadingSuccess: false,//已加载全部
        page: 1,
        inputValue: '',
        changefalg: false,
        value: [0, 1, 1],
        openflag: true,  //1日期控件显示  2控件滚动选择 底部页面不滚动
        years: years,   //时间可选范围模态框数据
        months: months,
        days: days,
        year: new Date().getFullYear()+'年',  //时间值
        month: (new Date().getMonth() + 1)+'月',
        day: new Date().getDate()+'日',
        starttime: util.getobjDate(),
        dateType: '1',//1表示选择开始日期，2表示结束日期
        loadingStatus: false,
        loadingTip: '加载中...',
        loadingImg: ''
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
    onShow: async function () {
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 60
        })
        this.setData({
            loadingStatus: true,
            page: 1
        })
        await tool.checkLoginInfo()
        await this.getOrderGroup(1)
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        setTimeout(() => {
            this.setData({
                loadingStatus: true,
                openflag: true,
                showDate: false,
                startDate:'',
                endDate:'',
                startDate1:'',
                endDate1:''
            })
        },800)
    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        console.log('历史页面且达到')
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
            startDate1: '',
            endDate1: '',
            paddingTop: '160rpx',
            doEnsureStatus: false,
            page:1
        })
        this.getOrderGroup(2)
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
        if(flag == '1') {
            if(endDate) {
                console.log('来了')
                this.checkDate(flag,startDate,endDate)
            }else{
                this.setData({
                    startDate1: startDate
                })
            }
        }else {
            if(startDate) {
                this.checkDate(flag,startDate,endDate)
            }else{
                this.setData({
                    endDate1: endDate
                })
            }
        }
    },
    MonthsBetw(date1,date2) {
        date1 = new Date(date1)
        date2 = new Date(date2)
        let date = (date2.getTime()-date1.getTime() + 86400000)/(1000*60*60*24)
        return date
    },
    checkDate(flag,startDate,endDate) {
        let startDate1 = startDate.replace(/-/g,''),
            endDate1 = endDate.replace(/-/g,''),
            bwDay = this.MonthsBetw(startDate,endDate)
        //连个日期范围不超过三个月
        if(bwDay > 90){
            wx.showModal({
                title: '提示',
                content: '日期范围不得大于90天',
                showCancel: false,
                confirmColor: '#2BBFD6'
            })
            return false
        }
        if(Number(startDate1) > Number(endDate1)) {
            if(flag == '1') {
                endDate = startDate
            }else if(flag == '2') {
                startDate = endDate
            }
        }
        this.setData({
            endDate1: endDate,
            startDate1: startDate
        })
        this.setPaddingTop()
    },
    doDateEnsure() {
        //判断开始日期和结束日期是否都有
        let _this = this,
            startDate = _this.data.startDate1,
            endDate = _this.data.endDate1
        if(!startDate || !endDate) {
            tool.showMyToast({'title':'请选择日期范围！','duration':500})
            return false
        }
        this.setData({
            showDate: false,
            doEnsureStatus: true,
            startDate,
            endDate,
            page: 1
        })
        this.setPaddingTop()
        this.getOrderGroup(1)
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
    /*onReachBottom() {
        console.log('上啦加载')
        let _this = this,
            loadingSuccess = _this.data.loadingSuccess
        if(!loadingSuccess) {
            _this.getOrderGroup(2)
        }
    },*/
    onReachBottom: tool.throttle(function(){
            let _this = this,
                loadingSuccess = _this.data.loadingSuccess
            if(!loadingSuccess) {
                _this.getOrderGroup(2)
            }
        },1000
    ),
    onPullDownRefresh() {
        console.log('下啦刷新')
        let _this = this
        _this.setData({
            page: 1
        })
        _this.getOrderGroup(1)
    },
    getOrderGroup(flag) {//flag：1表示进页面是加载数据，2表示刷新加载
        let _this = this,
            page = _this.data.page,
            inputValue = _this.data.inputValue,
            startDate = _this.data.startDate,
            endDate = _this.data.endDate,
            orderGroup = _this.data.orderGroup,
            param = {
                'startDate': startDate,
                'endDate': endDate,
                'inputValue': inputValue,
                'page': page,
                'show': (flag==1)?true:false
            },
            obj = {},
            data = [],
            noData = false
        if(flag == 2){
            _this.setData({
                searchLoading: true
            })
        }
        myApi.myPost('getHistoryOrderGroup',param).then(res => {
            wx.stopPullDownRefresh()
            data = res.message.data
            if(data || page == 1) {
                orderGroup = page==1?data:orderGroup.concat(data)
            }
            if(flag==1) {
                obj['loadingStatus'] = false
            }
            page = page + 1
            noData = orderGroup.length>0?false:true
            obj['orderGroup'] = orderGroup
            obj['page'] = page
            obj['noData'] = noData
            obj['searchLoading'] = false
            //已加载全部
            obj['loadingSuccess'] = (res.message.status == 2 && res.message.data)?true:false
            _this.setData(obj)
        })
    },
    onInput: tool.debounce(function(e){
            let that = this,
                val = e[0].detail.value.trim()
            that.setData({
                inputValue:val,
                page: 1
            })
            that.getOrderGroup(3)
        },800
    ),
    clearInput() {
        this.setData({
            inputValue: '',
            page: 1
        })
        this.getOrderGroup(3)
    },
    bindDateChange(e) {
        let _this = this,
            fieldDate = e.currentTarget.id,
            dateType = e.currentTarget.dataset.datetype,
            value = [2019, 0, 0],
            fieldDateVal = _this.data[fieldDate]?_this.data[fieldDate]:util.getobjDate(),
            arr = util.getarrWithtime(fieldDateVal)
        const { years, months, days, openflag } = _this.data
        //根据arr  数据索引
        value[0] = years.indexOf(arr[0] + '年')
        value[1] = months.indexOf(arr[1] + '月')
        value[2] = days.indexOf(arr[2] + '日')
        _this.setData({
            dateType: dateType,
            value,
            openflag: false,
            years,   //日期模态框数据
            months,
            days,
            year: arr[0] + '年',
            month: arr[1] + '月',
            day: arr[2]+ '日'
        })
    },
    // 取消
    closeDateSelect (){
        this.setData({
            openflag: true,
            changefalg: false,
        })
    },
    // 确定  如果不选择那么默认重置
    ensureDateSelect () {
        let _this = this,
            dateType = _this.data.dateType,
            startDate1 = '',
            endDate1 = ''
        _this.setData({
            openflag: true
        })
        const { curindex, year, month, day } = _this.data;
        let starttime = util.getDate(year, month, day)
        if(dateType == '1'){
            startDate1 = starttime
            endDate1 = _this.data.endDate1
        }else{
            endDate1 = starttime
            startDate1 = _this.data.startDate1
        }
        _this.SetDateRange(dateType,startDate1,endDate1)
        _this.setData({
            changefalg: false
        })
    },
    bindChange: function (ev) {
        const e = ev;
        let val = e.detail.value;
        const year = this.data.years[val[0]];
        const month = this.data.months[val[1]];
        const day = this.data.days[val[2]];

        //如果点击月份  那么后面日跟着变换数据
        let days = [];
        const daynum = util.mGetDate(year.substr(0, year.length - 1), month.substr(0, month.length - 1));
        for (let i = 1; i <= daynum; i++) {
            days.push(i + "日")
        }
        this.setData({
            days,
            year,
            month,
            day,
            changefalg: true,
        })
    }
})