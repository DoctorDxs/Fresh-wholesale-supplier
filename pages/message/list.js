// pages/message/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: 1,
    total: 0
  },

  onLoad: function (options) {
    this.getData()
  },

  getData() {
    wx.$get({
      url: '/supplier/message/list',
      data: {
        group: 'system',
        page: this.data.page
      }
    }).then(res => {
      const data = res.data
      const list = this.data.list
      list.push(...data.data)
      this.setData({
        list: list,
        total: data.total
      })
    })
  },

  readAll(d) {
    this.read()
  },



  readOne(e) {
    const item = e.currentTarget.dataset.item
    if (!item.is_read) {
      this.read(item.id)
    }
  },

  read(id) {
    wx.$post({
      url: '/supplier/message/read',
      data: {
        group: id ? null : 'all',
        id: id
      }
    }).then(res => {
      this.data.page = 1
      this.data.list = []
      this.getData()
      wx.showToast({
        title: id ? '已读' : '全部已读',
      })
    })
  },

  onReachBottom() {
    if (this.data.total <= this.data.list.length) {
      return
    }
    this.data.page += 1
    this.getData()
  }


})