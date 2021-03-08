// pages/setPwd/setPwd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: '',
    password1: '',
    phone: '',
    code: '',
    token: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      code: options.code,
      token: options.token
    })
  },

  getPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },

  getPassword1(e) {
    this.setData({
      password1: e.detail.value
    })
  },

  submit() {
    const password = this.data.password
    const password1 = this.data.password1
    if (!password) {
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none'
      })
      return
    }

    if (!password1) {
      wx.showToast({
        title: '请再次输入新密码！',
        icon: 'none'
      })
      return
    }

    if(password !== password1) {
      wx.showToast({
        title: '两次密码输入不一致！',
        icon: 'none'
      })
      return
    }

    if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(password)) {
      wx.showToast({
        title: '密码必须为6-12位的数字和字母的组合!',
        icon: 'none'
      })
      return
    }

    wx.$post({
      url: '/supplier/resetPassword/reset',
      data: {
        phone: this.data.phone,
        password: password,
        token: this.data.token,
        new_password: password1
      }
    }).then(res => {
      wx.showToast({
        title: '设置成功',
      })

      wx.reLaunch({
        url: '/pages/login/login',
      })
    })

  }
})