//index.js
//获取应用实例
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        imgBgUrl: myApi.imgBgUrl,
        orderGroup: [
            {
                'date': '2019-07-02',
                'des': '优质红豆 * 3相',
                'id': '1'
            },{
                'date': '2019-07-02',
                'des': '发房间爱风景畔发放 * 1份 ；苹果 * 3相',
                'id': '2'
            }
            ,{
                'date': '2019-07-02',
                'des': '面粉 * 10袋；优质红豆 * 3相',
                'id': '3'
            },{
                'date': '2019-07-02',
                'des': '优质红豆 * 3相',
                'id': '4'
            },{
                'date': '2019-07-02',
                'des': '优质红豆 * 3相',
                'id': '5'
            },{
                'date': '2019-07-02',
                'des': '发房间爱风景畔发放 * 1份 ；苹果 * 3相',
                'id': '6'
            },{
                'date': '2019-07-02',
                'des': '面粉 * 10袋；优质红豆 * 3相',
                'id': '7'
            },{
                'date': '2019-07-02',
                'des': '优质红豆 * 3相',
                'id': '8'
            },
        ],
        color_arr: ['#FF6490','#A28EFF','#FFC471'],
        noData: false,//false 有数据， true无数据，无需加载
        searchLoading: false,//加载中
        loadingSuccess: false,//已加载全部
        page: 1,
        orderSum:2
        //containHeight: 0
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        //this.getOrderGroup()
        //this.setContentHeight()
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }
        //this.oneRequest()
    },
    getUserInfo: function (e) {
        console.log(e)
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        })
    },
    oneRequest() {
        console.log(myApi)
        myApi.myGet('getStoreList',{show:true}).then(res => {
            console.log('成功')
            console.log(res)
        })
    },
    takeOrder() {
        this.setContentHeight()
    },
    setContentHeight() {
        let _this = this
        wx.getSystemInfo({
            success (res) {
                var percent = res.windowWidth / 750;
                _this.setData({
                    containHeight: res.windowHeight - percent * 225
                })
            }
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
            param = {
                'page': _this.data.page,
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
        myApi.myPost('getOrderGroup',param).then(res => {
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
    //接单
    doTakeOrder(e) {
        console.log(e)
        let _this = this,
            item = e.currentTarget.dataset.item,
            index = e.currentTarget.dataset.index,
            id = item.id,
            param = { id:id,show: true,title: '接单中...'},
            str = 'orderGroup['+index+'].class'
        console.log('接单')
        myApi.myPost('doTakeOrder',param).then(res => {
            if(res.message.status == 1) {//接单成功
                tool.showMyToast({'title': '接单成功','duration':800})
                _this.setData({
                    [str]: 'animated bounceOutRight'
                })
                _this.hideItemOrder(index)
            }
        })
    },
    hideItemOrder(index) {
        let str = 'orderGroup['+index+'].showStatus'
        setTimeout(() => {
            this.setData({
                [str]: true,
                orderSum: this.data.orderSum-1
            })
        },400)
    }

})
