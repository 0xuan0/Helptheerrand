//app.js
var util = require('./utils/utils.js');
// var api = require('./api.js')

if (wx.getExtConfig) {
    wx.getExtConfig({
        success: function (res) {
            console.log('dg', res.extConfig)
            wx.setStorageSync('t_store', res.extConfig)
        }
    })
}

if (wx.getExtConfig) {
    wx.getExtConfig({
        success: function (res) {
            console.log(res)
        }
    })
}

App({
  onLaunch: function () {
    // var logs = wx.getStorageInfoSync('logs') || []
    // console.log(logs)
    // // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // // 登录
    // wx.login({
    //     success: function (res) {
    //         console.log(res)
    //         if (res.code) {
    //             //发起网络请求
    //             wx.request({
    //                 url: 'https://api.paotui.com/index.php?store_id=2&r=api/passport/login',
    //                 data: {
    //                     code: res.code
    //                 }
    //             })
    //         } else {
    //             console.log('获取用户登录态失败！' + res.errMsg)
    //         }
    //     }
    // });
    // // 获取用户信息
    // wx.getSetting({
    //     success : res=>{
    //         if(res.authSetting['scope.userInfo']){
    //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //             wx.getUserInfo({
    //                 success:res => {
    //                     // 可以将res发送给后台解码出unionId
    //                     this.globalData.userInfo = res.userInfo
    //                     // 由于 getUserInfo 是网络请求,可能会在 Page.onLoad之后才返回
    //                     // 所以此处加入 callback 以防止这种情况
    //                     if(this.userInfoReadyCallback){
    //                         this.userInfoReadyCallback(res)
    //                     }
    //                 }
    //             })
    //         }
    //     }
    // })

      var that = this;
      console.log(wx.getStorageSync('key'))
      if (!(wx.getStorageSync('key'))) {
          wx.login({
              success: function (res) {
                  var code = res.code;
                  console.log(code)
                  wx.getUserInfo({
                      success: function (e) {
                          console.log(e)
                          //console.log(e.rawData);
                          var dat = JSON.parse(e.rawData);
                          console.log(dat);
                          //that.setData({ tp: dat.avatarUrl, zhm: dat.nickName});
                          var encryptedData = encodeURI(e.encryptedData);//一定要把加密串转成URI编码
                          console.log(encryptedData)
                          var iv = e.iv;

                          wx.showToast({
                              title: '正在登陆',
                              icon: 'loading',
                              duration: 10000
                          });

                          wx.request({
                              url: 'https://api.paotui.com/index.php?store_id=2&r=api/passport/login',
                              data: {
                                  code: code,
                                  encryptedData: encryptedData,
                                  iv: iv
                              },
                              method: 'GET',
                              header: {
                                  'content-type': 'application/json'
                              },
                              success: function (data) {
                                  console.log(data)
                                  // console.log(data);
                                  wx.hideToast();
                                  wx.setStorageSync('key', data.data.datas);
                                  // wx.setStorage({
                                  //     key: 'key',
                                  //     data: data.data.datas,
                                  // })

                              }
                          })


                      },
                      fail: function () {
                          console.log(error);
                      },
                  })

              }
          })
      }



  },

  globalData:{
    uesrInfo:null
  },

  httpClient: {
    request: function (method, url, data) {
      //返回一个promise实例
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          header: {
            'Content-Type': 'json'
          },
          data: data,
          mehtod: method,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res);
          },
          complete: function () {
            console.log('complete');
          }
        })
      })
    },
    //get方法：用来获取数据
    get: function (url) {
      return this.request('GET', url);
    },
    //post方法：用来更新数据
    post: function (url) {
      return this.request('POST', url, data);
    },
    //put方法
    put: function (url, data) {
      return this.request('PUT', url, data);
    },
    //delete方法
    delete: function (url, data) {
      return this.request('DELETE', url, data);
    }
  }
})



