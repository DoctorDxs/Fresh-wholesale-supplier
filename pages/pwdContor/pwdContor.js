// pages/setPwd/setPwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    newPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  getPasssword(e) {
    this.setData({
      password: e.detail.value
    })
  },

  getnewPassword(e) {
    this.setData({
      newPassword: e.detail.value
    })
  },

  submit() {
    const password = this.data.password
    const newPassword = this.data.newPassword
    if (!password) {
      wx.showToast({
        title: '请输入原密码！',
        icon: 'none'
      })
      return
    }

    if (!newPassword) {
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none'
      })
      return
    }

    if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(newPassword)) {
      wx.showToast({
        title: '密码必须为6-12位的数字和字母的组合!',
        icon: 'none'
      })
      return
    }
    const memberInfo = wx.getStorageSync('memberInfo')
    wx.$post({
      url: '/supplier/resetPassword/resetByPassword',
      data: {
        phone: memberInfo.phone,
        password: password,
        new_password: newPassword
      }
    }).then(res => {
      wx.showToast({
        title: '设置成功',
        success: () => {
          wx.navigateBack()
        }
      })
    })

  },

})