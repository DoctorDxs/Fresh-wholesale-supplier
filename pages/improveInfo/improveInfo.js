// pages/improveInfo/improveInfo.js
Page({


  data: {
    improveInfo: {
      purchase_goods: []
    },
    formData: [],
    id: '',
    purchaseState: 2,
  },

  onLoad(options) {
    this.data.id = options.id
    this.getInfo()
    this.setData({
      purchaseState: options.purchaseState
    })
  },

  parseData() {
    const purchase_goods = this.data.improveInfo.purchase_goods || []
    const formData = purchase_goods.map(item => {
      return {id: item.id}
    })
    this.setData({
      formData: formData
    })
  },

  getInfo() {
    wx.$get({
      url: '/supplier/purchase/prepareInfo',
      data: {id: this.data.id}
    }).then(res => {
      const data = res.data || []
      if (!data.length) return false;
      data.forEach(item => {
        item.produced_at = item.produced_at && item.produced_at.split(' ')[0]
      })
      this.setData({
        formData: data || []
      })
    })
  },


  bindDateChange(e) {
    const dataset = e.currentTarget.dataset
    const formData = this.data.formData
    formData[dataset.index].produced_at = e.detail.value
    this.setData({
      formData: formData
    })
  },

  getAddress(e) {
    const dataset = e.currentTarget.dataset
    const formData = this.data.formData
    this.data.formData[dataset.index].product_place = e.detail.value
  },

  getQualityDays(e) {
    const dataset = e.currentTarget.dataset
    const formData = this.data.formData
    this.data.formData[dataset.index].quality_days = e.detail.value
  },

  stockUp(e) {
    const formData = this.data.formData
    if (!this.checkoutFormData(formData)) {
      return false
    }

    wx.$post({
      url: '/supplier/purchase/preparePerfect',
      data: {
        id: this.data.id,
        data: formData
      }
    }).then(res => {
      wx.showToast({
        title: '备货成功',
      })
      wx.navigateTo({
        url: '/pages/purchaseDetail/purchaseDetail?id=' + this.data.id,
      })
    })
  },

  checkoutFormData(formData) {
    if(!formData.length) {
      wx.$alert('请完善商品信息')
      return false
    }
    for(let i = 0; i < formData.length; i ++) {
      const produced_at = formData[i].produced_at
      const product_place = formData[i].product_place
      const quality_days = formData[i].quality_days
      if (!produced_at || !product_place || !quality_days) {
        wx.$alert('请完善商品信息')
        return false
      }
    }
    return true
  }
 
})