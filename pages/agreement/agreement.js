// pages/agreement/agreement.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agreement: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAgreement()
  },

  getAgreement() {
    wx.$get({
      url: '/api/agreement',
      data: {
        type: 'service_agreement'
      }
    }).then(res => {
      const data = res.data || {}
      data.value = (data.value || '').replace(/<img/gi, "<img class='richImg' style='width:auto!important;height:auto!important;max-height:100%;width:100%;'");
      this.setData({
        agreement: res.data
      })
    })
  },

  agree() {
    wx.navigateBack({
      delta: 0,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  }
})