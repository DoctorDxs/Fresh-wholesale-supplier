// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  setAccount() {
    wx.navigateTo({
      url: '/pages/account/set',
    })
  }
})