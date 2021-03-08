// pages/supplyProductDetil/supplyProductDetil.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    updataDialog: false,
    placeholder:'请选择时间',
    updataItem: {},
    updataForm: {},
    applyDialog: false
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
      const data = res.data
      data.desc = (data.desc || '').replace(/<img/gi, "<img class='richImg' style='width:auto!important;height:auto!important;max-height:100%;width:100%;'");
      this.setData({
        detail: res.data
      })
    })
  },

  stopFather() {
    return false
  },

  onPickerChange (e) {
    
    const date = e.detail
    this.data.updataForm.stop_sale_date = date
  },

  updataStock(e) {
    const detail = this.data.detail
    console.log(detail)
    if (detail.is_public == 2) {
      wx.$alert('该商品已下架！')
      return false
    }
    this.setData({
      updataDialog: true,
    })
    this.data.updataForm.goods_id = detail.id
  },

  getPrice(e) {
    this.data.updataForm.price = e.detail.value * 100
  },

  getStock(e) {
    this.data.updataForm.inventory = e.detail.value
  },

  cancle() {
    this.setData({
      updataDialog: false
    })
  },

  confirm() {
    const updataForm = this.data.updataForm
    if (this.checkForm(updataForm)) {
      wx.$post({
        url: '/supplier/goods/updateOfferPrice',
        data: updataForm
      }).then(res => {
        this.setData({
          updataDialog: false
        })

        this.getData(this.data.detail.id)
      })
    }
  },

  checkForm(updataForm) {
    if (!updataForm.price) {
      wx.$alert('请输入供货价')
      return false
    }

    if (!updataForm.inventory) {
      wx.$alert('请输入商品库存')
      return false
    }

    if (!updataForm.stop_sale_date) {
      wx.$alert('售卖截至时间')
      return false
    }

    return true
  },

  apply() {
    const detail = this.data.detail
    if (detail.goods_supplier_state == 1) {
      this.setData({
        applyDialog: true
      })
      return
    }

    if (detail.goods_supplier_state == 0) {
      wx.navigateTo({
        url: '/pages/supplyEdit/supplyEdit?id=' + detail.id,
      })
    }
  },
  cancleDiolog() {
    this.setData({
      applyDialog: false
    })
  }
})