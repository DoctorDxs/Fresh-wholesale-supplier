// pages/dataCenter/dataCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    page: 1,
    list: []
  },


  onShow: function (options) {
    this.data.page = 1
    this.setData({
      list: []
    })
    this.getData()
    this.getList()
  },

  getData() {
    wx.$get({
      url: '/supplier/data/top',
      loading: false,
    }).then(res => {
      this.setData({
        data: res.data
      })
    })
  },

  getList() {
    wx.$get({
      url: '/supplier/data/purchase',
      data: {page: this.data.page}
    }).then(res => {
      const data = res.data.data || []
      const list = this.data.list
      list.push(...data)
      this.setData({
        list: list
      })
    })
  },

  onReachBottom() {
    this.data.page += 1
    this.getList()
  },

  settledDetail() {
    wx.navigateTo({
      url: '/pages/settled/settled?count=' + this.data.data.settled_count + '&amount=' + this.data.data.un_settled_amount,
    })
  },

  unsettleDetail() {
    wx.navigateTo({
      url: '/pages/unsettled/unsettled?count=' + this.data.data.un_settled_count + '&amount=' + this.data.data.un_settled_amount,
    })
  },

  
})