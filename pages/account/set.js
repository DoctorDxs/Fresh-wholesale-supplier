// pages/account/set.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberInfo: {}
  },

  onShow() {
    const memberInfo = wx.getStorageSync('memberInfo') || {}
    if (!memberInfo.phone) {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
    this.setData({
      memberInfo: memberInfo
    })
  },

  pwdContor () {
    wx.navigateTo({
      url: '/pages/pwdContor/pwdContor',
    })
  },

  logout() {
    wx.clearStorageSync('memberInfo')
    wx.clearStorageSync('api_token')
    wx.redirectTo({
      url: '/pages/login/login',
    })
  }
})