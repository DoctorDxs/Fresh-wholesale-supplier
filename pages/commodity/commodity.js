// pages/commodity/commodity.js
const formatTime = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {name: '可供货商品', id: 2},
      {name: '全部商品', id: 1},
    ],
    tabId: 2,
    categories: [],
    categoryId: null,
    categoriesContent: [],
    updataDialog: false,
    placeholder:'请选择时间',
    updataForm: {},
    page: 1
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    this.data.page = 1
    this.data.categories = []
    this.data.categoriesContent = []
    this.getData()
  },

  getData() {
    wx.$get({
      url: '/supplier/goods/categories',
      loading: true,
      data: {
        type: this.data.tabId
      }
    }).then(res => {
      const data = res.data || []
      this.setData({
        categories: data,
        categoryId: this.data.categoryId || data[0].id
      })
      this.getInfo()
    })
  },

  getInfo() {
    const tabId = this.data.tabId
    let url = tabId == 2 ? '/supplier/goods/offerList' : '/supplier/goods/list'
    wx.$get({
      url: url,
      data: {
        category_id: this.data.categoryId,
        page: this.data.page
      }
    }).then(res => {
      const data = res.data
      const categoriesContent = this.data.categoriesContent
      categoriesContent.push(...data.data)
      this.setData({
        categoriesContent: categoriesContent
      })
    })
  },

  getMore() {
    this.data.page += 1
    this.getInfo()
  },

  stopFather() {
    return false
  },

  onPickerChange (e) {
    const date = e.detail
    this.data.updataForm.stop_sale_date = date
  },

  toggleTab(e) {
    const dataset = e.currentTarget.dataset
    this.setData({
      tabId: dataset.id,
      categoryId: null,
      categories: [],
      categoriesContent: []
    })
    this.data.page = 1
    this.getData()
  },

  toggleCategory(e) {
    const dataset = e.currentTarget.dataset
    this.data.page = 1
    this.setData({
      categoryId: dataset.id,
      categoriesContent: [],
    })
    this.getInfo()
  },

  updataStock(e) {
    const item = e.currentTarget.dataset.item
    if (item.is_public == 2) {
      wx.$alert('该商品已下架！')
      return false
    }
    const updataForm = {}
    updataForm.price = item.offer_price
    updataForm.inventory = item.offer_inventory
    updataForm.goods_id = item.id
    updataForm.stop_sale_date = item.stop_sale_date
    updataForm.price_set_at = item.price_set_at
    this.setData({
      updataDialog: true,
      updataForm: updataForm
    })
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
        this.data.page = 1
        this.setData({
          categoriesContent: [],
        })
        this.getInfo()
        this.setData({
          updataDialog: false
        })
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


  addNew() {
    wx.navigateTo({
      url: '/pages/supplyApplication/supplyApplication',
    })
  },

  linkDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/supplyProductDetail/supplyProductDetail?id=' + item.id,
    })
    
  },

  applySupply(e) {
    const item = e.currentTarget.dataset.item
    if (item.goods_supplier_state == 1) {
      wx.$alert('供货申请审核中')
      return
    }
    if (item.goods_supplier_state == 2) {
      wx.$alert('该商品已供货！')
      return
    }
    wx.navigateTo({
      url: '/pages/supplyEdit/supplyEdit?id= '+ item.id ,
    })
  },

  onPullDownRefresh() {
    this.data.page = 1
    this.data.categories = []
    this.data.categoriesContent = []
    this.getData()
  }

})