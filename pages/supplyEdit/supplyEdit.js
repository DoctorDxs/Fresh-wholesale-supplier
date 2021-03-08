// pages/supplyEdit/supplyEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    formData: {
      qualification: [],
      name: '',
      unit_id: 1
    },
  },


  onLoad: function (options) {
    this.getData(options.id)
  },

  getData(id) {
    wx.$get({
      url: '/supplier/goods/info',
      data: {
        id: id
      }
    }).then(res => {
      this.setData({
        detail: res.data
      })
    })
  },

  uploadQualificationImg() {
    const that = this
    const formData = this.data.formData
    const qualification = formData.qualification || []
    wx.chooseImage({
      count: 3 - qualification.length, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        const tempFiles = res.tempFiles;
        wx.$upload(tempFiles).then(res => {
          qualification.push(...res)
          formData.qualification = qualification
          that.setData({
            formData: formData
          })
        })
      }
    });
  },

  deleteQualificationPic(e) {
    const index = e.currentTarget.dataset.index
    const formData = this.data.formData
    formData.qualification.splice(index, 1)
    this.setData({
      formData: formData
    })
  },

  getStock(e) {
    this.data.formData.inventory = e.detail.value
  },

  getAddress(e) {
    this.data.formData.address = e.detail.value
  },

  getRemark(e) {
    console.log(e)
    const formData = this.data.formData
    formData.desc = e.detail.value
    this.setData({
      formData: formData
    })
  },

  submit() {
    const formData = this.data.formData
    if (!this.checkForm(formData)) {
      return false
    }

    formData.goods_id = this.data.detail.id

    wx.$post({
      url: '/supplier/goods/addGoodsOffer',
      data: formData
    }).then(res => {
      wx.showToast({
        title: '已提交申请',
      })

      wx.navigateTo({
        url: '/pages/supplyApplication/supplyApplication',
      })
    })
  },

  checkForm(formData) {
    if (!formData.inventory) {
      wx.$alert('请输入商品库存')
      return false
    }
    if (!formData.address) {
      wx.$alert('请输入提货地点')
      return false
    }
    if (!formData.desc) {
      wx.$alert('请输入商品描述')
      return false
    }

    return true
  }


 
})