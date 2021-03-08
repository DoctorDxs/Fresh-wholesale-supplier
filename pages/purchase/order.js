//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    activeId:'1',
    tabData:[
      {
        name:'待接单',
        code: 'waiting',
        num:0,
        id:'1',
      },
      {
        name:'备货中',
        code: 'preparing',
        num:0,
        id:'2'
      },
      {
        name:'质检中',
        code: 'qcing',
        num:0,
        id:'3',
      },
      {
        name:'待提货',
        code: 'taking',
        num: 0,
        id:'4'
      },
      {
        name:'已提货',
        code: 'taken',
        num:0,
        id:'5'
      }
    ],

    list: [],
    total: 0,
    page: 1
  },
  
  onShow: function () {
    this.data.list = []
    this.data.page = 1
    this.getTabNum()
  },

  getTabNum() {
    const tabData = this.data.tabData
    wx.$get({
      url: '/supplier/purchase/indexInfo',
      loading: false,
    }).then(res => {
      const purchaseItems = res.data || {}
      tabData.forEach(tab => {
        Object.keys(purchaseItems).map(key => {
          if (key === tab.code) {
            tab.num = purchaseItems[key] || 0
          }
        })
      })
      this.setData({
        tabData: tabData
      })
      this.getData()
    })
  },

  getData() {
    wx.$get({
      url: '/supplier/purchase/index',
      data: {
        state: this.data.activeId
      }
    }).then(res => {
      const data = res.data.data || []
      const list = this.data.list
      list.push(...data)
      this.setData({
        list: list,
        total: res.data.total
      })
    })
  },

  onReachBottom() {
    if (this.data.total <= this.data.list.length) {
      return
    }
    this.data.page += 1
    this.getData()
  },

  toggleTab(e){
    this.setData({
      activeId: e.currentTarget.dataset.tab.id
    })
    this.data.list = []
    this.data.page = 1
    this.getTabNum()
  },
  // 跳转详情
  linkOrderSheet(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/purchaseDetail/purchaseDetail?id=' + item.id  + '&purchaseGoodsCount=' + item.purchase_goods_count,
    })
  },
  // 接单
  acceptOrder(e) {
    const item = e.currentTarget.dataset.item
    wx.$post({
      url: '/supplier/purchase/receive',
      data: {
        id: item.id
      }
    }).then(res => {
      wx.showToast({
        title: '已接单',
      })
      this.data.list = []
      this.data.page = 1
      this.getTabNum()
    })
  },

  // 备货
  stockUp(e) {
    const item = e.currentTarget.dataset.item
    wx.setStorageSync('improveInfo', item)
    if(item.purchase_goods_count == 0) {
      wx.navigateTo({
        url: '/pages/purchaseDetail/purchaseDetail?id=' + item.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/improveInfo/improveInfo?id=' + item.id + '&purchaseState=' + item.state,
      })
    }
  },

  onPullDownRefresh() {
    this.data.page = 1
    this.data.list = []
    this.getTabNum()
  }
})
