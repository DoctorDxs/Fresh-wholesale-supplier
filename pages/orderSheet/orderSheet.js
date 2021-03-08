//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    id: '',
    detail: {},
    orderId: '',
    purchaseState: ''
  },
  
  onLoad: function (options) {
    this.setData({
      id: options.id,
      orderId: options.orderId,
      purchaseState: options.purchaseState
    })
    
    this.getData()
  },

  getData() {
    wx.$get({
      url: '/supplier/purchase/sortingDetail',
      data: {
        id: this.data.id
      }
    }).then(res => {
      this.setData({
        detail: res.data || {}
      })
    })
  },

    // 接单
    acceptOrder() {
      wx.$post({
        url: '/supplier/purchase/receive',
        data: {
          id: this.data.orderId
        }
      }).then(res => {
        wx.showToast({
          title: '已接单',
        })
        this.getData()
      })
    },

    applyAgain() {
      wx.$post({
        url: '/supplier/purchase/qc',
        data: {
          id: this.data.id
        }
      }).then(res => {
        wx.showToast({
          title: '已重新提交',
        })
        this.getData()
      })
    }

  




})
