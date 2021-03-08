// pages/addNewCommodity/addNewCommodity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    formData: {
      pics: [],
      qualification: [],
      desc: '',
      name: '',
    },
    categories: [],
    pickerArray: [],
    selectedCategory: '',
    units: [],
    unitName: '',
    src: '',
    width: 375,//宽度
    height: 375,//高度
    max_width: 375,
    max_height: 375,
    disable_width: true,
    disable_height: true,
    scale: 0.8,
    disable_rotate:true,//是否禁用旋转
    disable_ratio: true,//锁定比例
    limit_move: true,//是否限制移动,
    coprperShopw: false
  },

  
  onLoad: function (options) {
    this.getCategories()
    
  },

  getCategories() {
    wx.$get({
      url: '/supplier/goods/categoryList',
      data: {
        type: 3
      }
    }).then(res => {
      const data = res.data || []
      this.setData({
        categories: data,
        pickerArray: [data, data[0] && data[0].children || []]
      })

      this.getUnit()
    })
  },

  getUnit() {
    wx.$get({
      url: '/supplier/goods/unit',
      loading: false
    }).then(res => {
      this.setData({
        units: res.data || []
      })
    })
  },

  unitPickerChange(e) {
    const units = this.data.units
    const selectedIndex = e.detail.value
    const formData = this.data.formData
    console.log(selectedIndex)
    formData.unit_id = units[selectedIndex].id || -1 
    this.setData({
      formData: formData,
      unitName: units[selectedIndex].name 
    })
  },


  pickerColumnChange(e) {
    const column = e.detail.column, value = e.detail.value
    const pickerArray = this.data.pickerArray
    const categories = this.data.categories
    if (column == 0) {
      const children = categories[value] && categories[value].children  || []
      pickerArray[1] = children
      this.setData({
        pickerArray: pickerArray
      })
    }
  },

  
  pickerChange(e) {
    const selectedIndex = e.detail.value
    const pickerArray = this.data.pickerArray
    const formData = this.data.formData
    formData.category_pid = pickerArray[0][selectedIndex[0]].id || -1 
    formData.category_id = pickerArray[1][selectedIndex[1]] && pickerArray[1][selectedIndex[1]].id || -1
    this.setData({
      formData: formData,
      selectedCategory: pickerArray[0][selectedIndex[0]].name + (pickerArray[1][selectedIndex[1]] && pickerArray[1][selectedIndex[1]].name ? '/' + pickerArray[1][selectedIndex[1]].name : '')
    })
  },

  uploadImg() {
    const that = this
    const formData = this.data.formData
    const pics = formData.pics || []
    wx.chooseImage({
      count: 3 - pics.length, 
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        const tempFiles = res.tempFiles;
        that.setData({
          src: res.tempFilePaths[0],
          coprperShopw: true
        })
          that.cropper = that.selectComponent("#image-cropper");
          that.cropper.imgReset();
      }
    });
  },

  confirmCorpper() {
    const that = this
    const formData = this.data.formData
    const pics = formData.pics || []
    this.cropper.getImg((obj)=>{
      wx.$upload([{path: obj.url}]).then(res => {
          pics.push(...res)
          formData.pics = pics
          formData.main_pic = pics[0]
          that.setData({
            formData: formData,
            coprperShopw: false
          })
        })
    });
  },
  
  cancleCorpper() {
    this.setData({
      coprperShopw: false
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

  deleteGoodsPic(e) {
    const index = e.currentTarget.dataset.index
    const formData = this.data.formData
    formData.pics.splice(index, 1)
    this.setData({
      formData: formData
    })
  },

  deleteQualificationPic(e) {
    const index = e.currentTarget.dataset.index
    const formData = this.data.formData
    formData.qualification.splice(index, 1)
    this.setData({
      formData: formData
    })
  },

  getGoodName(e) {
    const formData = this.data.formData
    formData.name = e.detail.value
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

    wx.$post({
      url: '/supplier/goods/addNewGoodsOffer',
      data: formData
    }).then(res => {
      wx.showToast({
        title: '已提交申请',
      })

      wx.navigateBack()
    })
  },

  checkForm(formData) {
    if (!formData.category_pid) {
      wx.$alert('请选择商品分类！')
      return false
    }
    if(formData.category_pid == -1 || formData.category_id == -1) {
      wx.$alert('商品分类暂只支持二级分类！')
      return false
    }
    if (!formData.name) {
      wx.$alert('请输入商品名称')
      return false
    }
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