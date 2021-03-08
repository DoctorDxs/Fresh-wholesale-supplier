//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    number: 0,
    activeId:'1',
    proposedGoods: [],
    dataCenter: {},
    memberInfo: {},
    page: 1,
    total: 0
  },

  onShow() {
    this.data.proposedGoods = []
    this.data.page = 1
    this.getData()
    const memberInfo = wx.getStorageSync('memberInfo')
    this.setData({
      memberInfo: memberInfo
    })

    
  },
  
  purchase() {
    wx.switchTab({
      url: '/pages/purchase/order',
    })
  },

  commodity() {
    wx.switchTab({
      url: '/pages/commodity/commodity',
    })
  },

  getData() {
    wx.$get({
      url: '/supplier/purchase/dataIndex',
      loading: false
    }).then(res => {
      this.getList()
      this.setData({
        dataCenter: res.data
      })
      
    })
  },

  getList() {
    wx.$get({
      url: '/supplier/purchase/index',
      data: {
        state: 1,
        page: this.data.page
      }
    }).then(res => {
      const data = res.data.data || []
      const proposedGoods = this.data.proposedGoods
      proposedGoods.push(...data)
      this.setData({
        proposedGoods: proposedGoods,
        total: res.data.total
      })
    })
  },

  onReachBottom() {
    if (this.data.total <= this.data.proposedGoods.length) {
      return
    }
    this.data.page += 1
    this.getList()
  },

  messageList() {
    wx.navigateTo({
      url: '/pages/message/list',
    })
  },

  dataCenter() {
    wx.navigateTo({
      url: '/pages/dataCenter/dataCenter',
    })
  },

  acceptOrder(e) {
    const item = e.currentTarget.dataset.item
    const that = this
    wx.$post({
      url: '/supplier/purchase/receive',
      data: {
        id: item.id
      }
    }).then(res => {
      wx.showToast({
        title: '已接单',
      })
      this.data.page = 1
      this.setData({
        proposedGoods: []
      })
      setTimeout(_ => {
        that.getData()
      })
      
    })
  },

  linkDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/purchaseDetail/purchaseDetail?id=' + item.id,
    })
  },

  onPullDownRefresh() {
    this.data.page = 1
    this.data.proposedGoods = []
    this.getData()
  }

})
