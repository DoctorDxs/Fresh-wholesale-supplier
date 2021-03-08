// pages/unsettled/unsettled.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    count: 0,
    amount: 0
  },

  onLoad(options) {
    console.log(options)
    this.setData({
      count: options.count,
      amount: options.amount
    })
  },


  onShow: function (options) {
    this.data.page = 1
    this.setData({
      lsit: []
    })
    this.getList()
  },

  getList() {
    wx.$get({
      url: '/supplier/data/settledList',
      data: {
        page: this.data.page,
        settled_state: 1
      }
    }).then(res => {
      const data = res.data.data || []
      const list = this.data.list
      list.push(...data)
      this.setData({
        list: list
      })
    })
  },

  linkDetail(e) {
    wx.navigateTo({
      url: '/pages/purchaseDetail/purchaseDetail?id=' +  e.currentTarget.dataset.id,
    })
  },

  onReachBottom() {
    this.data.page += 1
    this.getList()
  },


 
})