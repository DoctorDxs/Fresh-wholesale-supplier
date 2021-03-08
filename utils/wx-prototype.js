const host = 'https://freshtest.17link.cc'
const COS = require('./cos-wx-sdk-v5')
const alert = (title) =>{
  wx.showToast({
    title: title,
    icon: 'none'
  })
}

const getRequestOptions = (options) => {
  const url = host + options.url
  const header = {
    api_token: wx.getStorageSync('api_token'),
    "Content-Type": "application/json"
  }
  options.url = host + options.url
  options.loading === false ? null : typeof options.loading === 'string' ? wx.showLoading({
    title: loading,
  }): wx.showLoading({
      title: '请稍后...',
    })
  return Object.assign(options, { url, header });
}


const get = (options) => {
  options.method = 'get'
  return new Promise((resolve, reject)=>{
    request(getRequestOptions(options), resolve, reject)
  })
}

const post = (options) => {
  options.method = 'post'
  return new Promise((resolve, reject)=>{
    request(getRequestOptions(options), resolve, reject)
  })
}

const request = (options, resolve, reject) => {
  options.data = options.data || {}
  options.data.api_token = wx.getStorageSync('api_token'),
    wx.request({
      ...options,
      success: (res) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        const data = res.data
        if (data.status == 1) {
          wx.setStorageSync('isLoginPage', false)
          resolve(data)
        } else if (data.status == 400) {
          wx.setStorageSync('isLoginPage', false)
          alert('数据不存在')
        } else if (data.status == 401) {
          alert('没有权限')
          const isLoginPage = wx.getStorageSync('isLoginPage')
          if (isLoginPage) return;
          setTimeout(_ => {
            wx.setStorageSync('isLoginPage', true)
            wx.redirectTo({
              url: '/pages/login/login',
            })
            wx.setStorageSync('isLoginPage', false)
          }, 2000)
        } else {
          alert(data.message || '请求错误')
        }
      },
      fail: (error) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        alert(JSON.stringify(error))
        reject(error)
      }
    })
}

// 使用promise.all 实现多图上传  暂未检测
// 获取 腾讯云签名
const getUploadSign = () => {
  return new Promise((resolve, reject) => {
    get({
      url: '/api/common/uploadSign',
      loading: false,
    }).then(res => {
      resolve(res.data[0])
    })
  }) 
}

// 设置腾讯云上传参数
const setCosConfig = (res) => {
  return new COS({
    // ForcePathStyle: true, 
    getAuthorization: function (options, callback) {
      callback({
        TmpSecretId: res.tmpSecretId,
        TmpSecretKey: res.tmpSecretKey,
        XCosSecurityToken: res.sessionToken,
        StartTime: res.startTime, 
        ExpiredTime: res.expiredTime, 
      });
    }
  });
} 


const upload = (imageList) => {
  imageList = Array.isArray(imageList) ? imageList : [imageList]
  wx.showLoading({
    title: '上传图片中...',
    mask:true
  });
  
  return new Promise((Presolve, Preject) => {
    getUploadSign().then(res => {
      const cos = setCosConfig(res)
      let promiseList = []
      imageList.forEach(item => {
        const filePath = item.path;
        const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
        promiseList.push( 
          new Promise((resolve, reject)=>{
            cos.postObject({
              Bucket: res.bucket,
              Region: res.region,
              Key: filename.substring(filename.length-8),
              FilePath: filePath,
            }, function (err, data) {
              resolve( '//' + data.Location)
            });
          })
        )
      })
      // 使用Promise.all进行多图上传
      Promise.all(promiseList).then(res => {
        Presolve(res)
      }).catch((error) => {
        wx.hideLoading()
        wx.showToast({
          title:'上传失败请重试',
          icon:'none'
        })
        Preject(error)
        console.log(error);
      });
    })
  })  
 
}




wx.$get = get
wx.$post = post
wx.$upload = upload

wx.$alert = alert
