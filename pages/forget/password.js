// pages/forget/password.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: ''
  },

  clear() {
    this.setData({
      phone: ''
    })
  },

  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  getCode() {
    if(!/^1\d{10}$/.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号码！',
        icon: 'none'
      })
      return
    }
    wx.navigateTo({
      url: `/pages/getCode/getCode?phone=${this.data.phone}`,
    })
  }
})