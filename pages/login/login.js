// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      phone: '',
      password: ''
    }
  },

  onLoad: function (options) {

  },

  login(e) {
    const formData = e.detail.value
    if(!/^1\d{10}$/.test(formData.phone)) {
      wx.$alert('请输正确的入登录账号！')
      return
    }
    wx.$post({
      url: '/supplier/login/login',
      data: formData,//
    }).then(res => {
      wx.setStorageSync('memberInfo', res.data)
      wx.setStorageSync('api_token', res.data.api_token)
      this.subscribe()
    })
    
    
  },

  subscribe() {
    const that = this
    wx.$get({
        url: '/supplier/message/templateIds'
      }).then(res => {
        wx.requestSubscribeMessage({
          tmplIds: res.data || [],
          success: (res) => {
            that.wxLogin()
          },
          fail: (error) => {
            that.wxLogin()
          }
        })
      })
  },

  wxLogin() {
    wx.login({
      success: (wxRes) => {
        wx.$post({
          url: '/api/login/wxLogin',
          data: {
            code: wxRes.code,
            type: 2
          },
          loading: false,
        }).then(res => {
          wx.switchTab({
            url: '/pages/index/index',
          })
        })
      }
    })
  },

  register() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  forgetPassword() {
    wx.navigateTo({
      url: '/pages/forget/password',
    })
  }


 
})