// components/showAlert/index.js
Component({
    externalClasses: ['dis_flex', 'text-center', 'main_color'],
    /**
     * 组件的属性列表
     */
    properties: {
        messTitle: String,
        messIcon: String,
        showStatus: Boolean
    },

    /**
     * 组件的初始数据
     */
    data: {
    },

    /**
     * 组件的方法列表
     */
    methods: {
        _doClose() {
            this.setData({
                showStatus: false
            })
        },
        _doEnsure(e) {
            this.triggerEvent('doEnsure',{myEventDetail:e})
        }
    }
})
