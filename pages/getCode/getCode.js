// pages/code/check.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codes: [],
    code: '',
    inputIndex: 0,
    phone: '',
    count: 60,
    canGetCode: true,
    inputFocus: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone
    })
    this.sendCode()
  },


  focusInput() {
    this.setData({
      inputFocus: true
    })
  },

  getCode(e) {
    const value = e.detail.value || ''
    this.setData({
      inputIndex: value.length > 5 ? 5 : value.length,
      codes: value.split(''),
      code: value
    })

    if (value.length == 6) {
      this.setPwd()
    }
  },

  resend() {
    this.sendCode()
  },

  sendCode() {
    if (this.data.canGetCode) {
      this.setData({
        canGetCode: false
      })
      this.endTime()
    } else {
      return
    }
    wx.$post({
      url: '/supplier/forgotPassword/sendVerifyCode',
      data: {
        phone: this.data.phone
      }
    }).then(res => {
      wx.showToast({
        title: '发送成功',
      })
    })
  },

  endTime() {
    const that =this
    if (this.data.count > 0) {
      setTimeout(_ => {
        that.setData({
          count: this.data.count - 1
        })
        that.endTime()
      }, 1000)
    } else {
      this.setData({
        canGetCode: true,
        count: 60
      })
    }
  },

  setPwd() {
    wx.$post({
      url: '/supplier/forgotPassword/reset',
      data: {
        phone: this.data.phone,
        code: this.data.code
      }
    }).then(res => {
      wx.navigateTo({
        url: '/pages/setPwd/setPwd?code=' + this.data.code + '&phone=' + this.data.phone + '&token=' + res.data.token,
      })
    })

    
  }

})