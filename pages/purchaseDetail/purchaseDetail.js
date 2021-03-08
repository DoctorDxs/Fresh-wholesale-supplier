//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    detail: {},
    id: '',
    orderSheetList: [],
    purchaseGoodsCount: 0
  },
  
  onLoad: function (options) {
    this.data.id = options.id
    this.setData({
      purchaseGoodsCount: options.purchaseGoodsCount
    })
  },

  onShow() {
    this.getData()
  },


  getData(id) {
    wx.$get({
      url: '/supplier/purchase/detail',
      data: {
        id: this.data.id
      }
    }).then(res => {
      const data = res.data
      this.setData({
        detail: data
      })
      this.getOrderSheetList()
    })
  },

  getOrderSheetList() {
    wx.$get({
      url: '/supplier/purchase/sortings',
      loading: false,
      data: {id: this.data.id}
    }).then(res => {
      this.setData({
        orderSheetList: res.data || []
      })
    })
  },

  // 分捡单详情
  linkOrderSheet(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/orderSheet/orderSheet?id=' + item.id + '&orderId=' + this.data.detail.id + '&purchaseState=' + this.data.detail.state
    })
  },

  // 接单
  takeOrder() {
    wx.$post({
      url: '/supplier/purchase/receive',
      data: {
        id: this.data.detail.id
      }
    }).then(res => {
      wx.showToast({
        title: '已接单',
      })
      wx.switchTab({
        url: '/pages/index/index',
      })
    })
  },

  // 查看商品信息
  lookDetail() {
    wx.setStorageSync('improveInfo', this.data.detail.purchase_goods)
    wx.navigateTo({
      url: '/pages/improveInfo/improveInfo?id=' + this.data.id + '&purchaseState=' + this.data.detail.state,
    })
  },

  stockUp(e) {
    if (this.data.purchaseGoodsCount > 0) {
      wx.navigateTo({
        url: '/pages/improveInfo/improveInfo?id=' + this.data.id+ '&purchaseState=' + this.data.detail.state,
      })
      return
    }
    const item = e.currentTarget.dataset.item
    wx.$post({
      url: '/supplier/purchase/prepare',
      data: {
        id: item.id
      }
    }).then(res => {
      this.getData()
    })
  },

  cancleStockUp(e) {
    const item = e.currentTarget.dataset.item
    wx.$post({
      url: '/supplier/purchase/cancelPrepare',
      data: {
        id: item.id
      }
    }).then(res => {
      wx.showToast({
        title: '已取消',
      })

      setTimeout(_ => {
        this.getData()
      }, 1500)
    })
  }

})
