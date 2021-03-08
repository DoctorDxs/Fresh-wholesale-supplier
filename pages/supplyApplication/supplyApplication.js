// pages/commodity/commodity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {name: '待审核', id: 1, code: 'wait_audit_count', num: 0},
      {name: '审核通过', id: 2, code: 'pass_audit_count', num: 0},
      {name: '审核未通过', id: 3, code: 'reject_audit_count', num: 0},
    ],
    tabId: 1,
    categories: [],
    categoryId: null,
    updataDialog: false,
    categoriesContent: [],
    goodsId: null,
    page: 1
  },

  onShow(optiosn) {
    this.data.categories = []
    this.data.categoriesContent = []
    this.data.page = 1
    this.getTabNum()
  },

  getTabNum() {
    const tabs = this.data.tabs
    wx.$get({
      url: '/supplier/goods/topCount',
      loading: false
    }).then(res => {
      this.getData()
      const purchaseItems = res.data || {}
      tabs.forEach(tab => {
        Object.keys(purchaseItems).map(key => {
          if (key === tab.code) {
            tab.num = purchaseItems[key] || 0
          }
        })
      })
      this.setData({
        tabs: tabs
      })
    })
  },

  getData() {
    wx.$get({
      url: '/supplier/goods/categories',
      loading: false,
      data: {
        state: this.data.tabId
      }
    }).then(res => {
      const data = res.data || []
      this.setData({
        categories: data,
        categoryId: data[0] && data[0].id
      })
      this.getInfo()
    })
  },

  getInfo() {
    wx.$get({
      url: '/supplier/goods/goodsSupplier',
      data: {
        category_id: this.data.categoryId,
        state: this.data.tabId,
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

  toggleTab(e) {
    const dataset = e.currentTarget.dataset
    this.setData({
      tabId: dataset.id
    })
    this.data.categories = []
    this.data.categoriesContent = []
    this.data.page = 1
    this.getTabNum()
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


  deleteApplication(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      updataDialog: true,
      goodsId: item.id
    })
  },

  linkDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/supplyDetail/supplyDetail?id=' + item.id,
    })
    
  },

  stopFather() {
    return false
  },

  
  cancle() {
    this.setData({
      updataDialog: false
    })
  },

  confirm() {
    wx.$post({
      url: '/supplier/goods/deleteGoodsSupplier',
      data: {
        id: this.data.goodsId
      }
    }).then(res => {
      wx.showToast({
        title: '删除成功',
      })
      this.setData({
        updataDialog: false
      })
      this.data.categories = []
      this.data.categoriesContent = []
      this.data.page = 1
      this.getTabNum()
    })
  },

  getMore() {
    this.data.page += 1
    this.getInfo()
  },


  addNewPro() {
    wx.navigateTo({
      url: '/pages/addNewCommodity/addNewCommodity',
    })
  },

  onPullDownRefresh() {
    this.data.categories = []
    this.data.categoriesContent = []
    this.data.page = 1
    this.getTabNum()
  }
  
})