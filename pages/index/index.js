//index.js
//获取应用实例
const app = getApp()
const myApi = app.globalData.myApi
const tool = require("../../utils/tool.js")
const regeneratorRuntime = app.globalData.regeneratorRuntime
Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        imgBgUrl: myApi.imgBgUrl,
        orderGroup: [],
        color_arr: ['#FF6490','#A28EFF','#FFC471'],
        noData: false,//false 有数据， true无数据，无需加载
        searchLoading: false,//加载中
        loadingSuccess: false,//已加载全部
        page: 1,
        lastId: 0,
        orderSum:0,
        loadingStatus: false,
        loadingTip: '加载中...',
        loadingImg: ''
        //containHeight: 0
    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },
    onLoad: function () {
        //this.getOrderGroup(1)
    },
    onReady() {

    },
    onHide: function () {
        setTimeout(() => {
            this.setData({
                loadingStatus: true
            })
        },800)
    },
    onShow:async function() {
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
    getUserInfo: function (e) {
        app.globalData.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
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
   /* onReachBottom() {
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
    //获取这个月总单数
    getOrderSum() {
      myApi.myGet('getOrderSum',{}).then(res => {
          if(res.message.return_code == 200) {
              this.setData({
                  orderSum: res.message.data
              })
          }
      })
    },
    getOrderGroup(flag) {//flag：1表示进页面是加载数据，2表示刷新加载
        let _this = this,
            page = _this.data.page,
            obj = {},
            data = [],
            orderGroup = _this.data.orderGroup,
            lastIndex = orderGroup.length>0?orderGroup.length-1: 0,
            noData = false,
            param = {
                'page': _this.data.page,
                'show': flag==1?true:false,
                'lastId': flag==1?0:orderGroup[lastIndex]['id']
            }
        if(flag == 2){
            _this.setData({
                searchLoading: true
            })
        }
        if(flag == 1) {
            _this.getOrderSum()
        }
        myApi.myPost ('getOrderGroup',param).then(res => {
            wx.stopPullDownRefresh()
            data = res.message.data
            if(data) {
                orderGroup = page==1?data:orderGroup.concat(data)
            }
            if(flag == 1) {
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
    //接单
    doTakeOrder(e) {
        let _this = this,
            item = e.currentTarget.dataset.item,
            index = e.currentTarget.dataset.index,
            id = item.id,
            param = { id:id,show: true,title: '接单中...'},
            str = 'orderGroup['+index+'].class'
        myApi.myPost('doTakeOrder',param).then(res => {
            if(res.message.return_code == 200) {//接单成功
                tool.showMyToast({'title': '接单成功','duration':800})
                _this.setData({
                    [str]: 'animated bounceOutRight'
                })
                _this.hideItemOrder(index)
            }
        })
    },
    hideItemOrder(index) {
        let str = 'orderGroup['+index+'].showStatus',
            orderGroup = this.data.orderGroup,
            noData = false
        orderGroup.splice(index,1)
        if(orderGroup.length <= 0) {
            noData = true
        }
        setTimeout(() => {
            this.setData({
                //[str]: true,
                orderSum: this.data.orderSum-1,
                orderGroup,
                noData
            })
        },400)
    }

})
