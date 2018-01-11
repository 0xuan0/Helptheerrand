var app = getApp();

Page({
    data: {
        imgUrls: [
            'http://img02.tooopen.com/images/20150928/tooo`pen_sy_143912755726.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
            'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 1000,
        cart:[
            { id: 1, name: '布丁', price: 90, imgUrl: '/images/0.jpg', count: 0 },
            { id: 2, name: '冰淇淋', price: 65, imgUrl: '/images/1.jpg', count: 0 },
            { id: 3, name: '布丁', price: 90, imgUrl: '/images/2.jpg', count: 0 },
            { id: 4, name: '冰淇淋', price: 65, imgUrl: '/images/3.jpg', count: 0 },
            { id: 5, name: '布丁', price: 90, imgUrl: '/images/4.jpg', count: 0 },
            { id: 6, name: '冰淇淋', price: 65, imgUrl: '/images/1.jpg', count: 0 },
            { id: 7, name: '布丁', price: 90, imgUrl: '/images/0.jpg', count: 0 },
            { id: 8, name: '冰淇淋', price: 65, imgUrl: '/images/1.jpg', count: 0 }
        ],

        count: 1,
        total: 0,    //总金额  
        goodsCount: 0 //数量  
    },
    
    onLoad:function(){
      
        if (app.globalData.userInfo) {
            console.log(app.globalData.userInfo)
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            console.log(this.data.canIUse)
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    console.log(app.globalData.userInfo)
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        console.log(app)
        var url = 'https://api.paotui.com/index.php?store_id=4&r=api/default/index'
        app.httpClient.get(url)
            .then(res => { console.log(res) })
            .catch(res => { console.log("请求失败时调用该函数") });
    },

    c:function(){
        wx.navigateTo({
            url: '../details/details'
        })
    },

})