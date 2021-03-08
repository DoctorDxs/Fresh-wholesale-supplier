// pages/supplyDetail/supplyDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    updataDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData(options.id)
  },

  getData(id) {
    wx.$get({
      url: '/supplier/goods/goodsSupplierInfo',
      data: {
        id: id
      }
    }).then(res => {
      this.setData({
        detail: res.data
      })
    })
  },

  delete() {
    this.setData({
      updataDialog: true
    })
  },

  stopFather() {
    return false
  },

  
  cancle() {
    this.setData({
      updataDialog: false
    })
  },

  confirm() {
    wx.$post({
      url: '/supplier/goods/deleteGoodsSupplier',
      data: {
        id: this.data.detail.id
      }
    }).then(res => {
      wx.showToast({
        title: '删除成功',
      })
      this.setData({
        updataDialog: false
      })
      wx.navigateBack()
    })
  },
})
