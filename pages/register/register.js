// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    count: 60,
    canGetCode: true,
    company_attributes: ['民营', '国企', '股份', '外资', '上市'],
    company_attribute: '',
    company_attributeId: undefined
  },

  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },

  selectcompanyAttr() {
    const company_attributes = this.data.company_attributes
    wx.showActionSheet({
      itemList: company_attributes,
      success: (res) => {
        console.log(res)
        this.setData({
          company_attribute: company_attributes[res.tapIndex],
          company_attributeId: res.tapIndex
        })
      },
      fail: (error)=> {
        console.log(error)
      }
    })
  },

  getCode() {
    if(!/^1\d{10}$/.test(this.data.phone)) {
      wx.$alert('请输入正确的手机号')
      return
    }
    if (this.data.canGetCode) {
      this.setData({
        canGetCode: false
      })
      this.endTime()
    } else {
      return
    }

    

    wx.$post({
      url: '/supplier/register/sendCaptchaCode',
      data: {
        phone: this.data.phone
      }
    }).then(res => {
      console.log(res)
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
  
  regist(e) {
    const formData = e.detail.value
    if (!this.checkFormValue(formData)) {
      return
    }
    formData.company_attribute = this.data.company_attributeId
    wx.$post({
      url: '/supplier/register/register',
      data: formData,
    }).then(res => {
      wx.showToast({
        title: '注册成功！',
      })

      setTimeout(_ => {
        wx.navigateBack()
      }, 2000)
    })

    
  },

  checkFormValue(formData) {
    if (!formData.name) {
      wx.$alert('请填写企业名称')
      return
    }
    if (!formData.phone) {
      wx.$alert('请输入登录账号')
      return
    }
    if (!formData.captcha) {
      wx.$alert('请输入验证码')
      return
    }
    if (!formData.password) {
      wx.$alert('请设置登录密码')
      return
    }

    if(!/^1\d{10}$/.test(formData.phone)) {
      wx.$alert('请输入正确的登录账号')
      return
    }

    if(!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(formData.password)) {
      wx.$alert('请设置正确的登录密码')
      return
    }

    if(formData.legal_phone && !/^1\d{10}$/.test(formData.legal_phone)) {
      wx.$alert('请输入正确法人联系方式')
      return
    }

    return true
  },

  
})