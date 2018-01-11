var app = getApp();
Page({
    data: {
        winHeight: "",//窗口高度
        currentTab: 0, //预设当前项的值
        scrollLeft: 0, //tab标题的滚动条位置
        cart: [
            { id: 1, name: '布丁', price: 90, imgUrl: '/images/0.jpg', count: 0 },
            { id: 2, name: '冰淇淋', price: 65, imgUrl: '/images/1.jpg', count: 0 },
            { id: 3, name: '布丁', price: 90, imgUrl: '/images/2.jpg', count: 0 },
            { id: 4, name: '冰淇淋', price: 65, imgUrl: '/images/3.jpg', count: 0 },
            { id: 5, name: '布丁', price: 90, imgUrl: '/images/4.jpg', count: 0 },
            { id: 6, name: '冰淇淋', price: 65, imgUrl: '/images/1.jpg', count: 0 },
            { id: 7, name: '布丁', price: 90, imgUrl: '/images/0.jpg', count: 0 },
            { id: 8, name: '冰淇淋', price: 65, imgUrl: '/images/1.jpg', count: 0 }
        ],
        iscart:false,
        count: 1,
        total: 0,    //总金额  
        goodsCount: 0, //数量  
        animationData: null,
        flag:true,
        showmodule:'showModal',
        gouwuche:[
            
        ],
        getcart:[

        ],
        carrent:{}
    },

    onLoad: function (e) {
        var that = this;
        var arr = wx.getStorageSync('cart') || []
        if(arr.length>0){
            for (var i in arr) {
                if (arr[i].count!=0){
                    console.log(22)
                    this.data.total += Number(arr[i].price*arr[i].count);
                    this.data.goodsCount += Number(arr[i].count);
                }
                
            }
            that.setData({
                cart:arr,
                total: this.data.total,
                goodsCount:this.data.goodsCount
            })
        }
        //  高度自适应
        wx.getSystemInfo({
            success: function (res) {
                var clientHeight = res.windowHeight,
                    clientWidth = res.windowWidth,
                    rpxR = 750 / clientWidth;
                var calc = clientHeight * rpxR - 180;
                console.log(calc)
                that.setData({
                    winHeight: calc
                });
            }
        });
    },

    // 滚动切换标签样式
    switchTab: function (e) {
        console.log(e)
        this.setData({
            currentTab: e.detail.current
        });
        this.checkCor();
    },
    // 点击标题切换当前页时改变样式
    swichNav: function (e) {
        console.log(app)
        var _this = this
        if (e.target.dataset.current == 1) {
            app.httpClient.get('https://api.douban.com/v2/movie/in_theaters?start=0&count=10')
                .then(res => { console.log(res.data.subjects)})
                .catch(res => {console.log('请求失败')})
            // wx.request({
            //     url: 'https://api.douban.com/v2/movie/in_theaters?start=0&count=10',
            //     header: {
            //         'content-type': 'json'
            //     },
            //     success: function (res) {
            //         _this.setData({
            //             expertList: res.data.subjects
            //         })
            //         console.log(_this.data)
            //     }
            // })
        };
        console.log(_this.data.getcart);
        if (e.target.dataset.current == 0) {
            wx.request({
                url: 'https://api.douban.com/v2/movie/in_theaters?start=10&count=10',
                header: {
                    'content-type': 'json'
                },
                success: function (res) {
                    _this.setData({
                        expertList: res.data.subjects
                    })
                    console.log(_this.data)
                }
            })
        }

        if (e.target.dataset.current == 2) {
            wx.request({
                url: 'https://api.douban.com/v2/movie/in_theaters?start=20&count=10',
                header: {
                    'content-type': 'json'
                },
                success: function (res) {
                    _this.setData({
                        expertList: res.data.subjects
                    })
                    console.log(_this.data)
                }
            })
        }

        console.log(e)
        var cur = e.target.dataset.current;
        if (this.data.currentTaB == cur) { return false; }
        else {
            this.setData({
                currentTab: cur
            })
        }
    },

    onShow:function(){
        // this.setData({
        //     cart
        // })
        // var cart = wx.getStorageSync('cart') || [];
    },

    // 点击出现遮罩层
    showModal: function () {
        console.log()
        this.setData({
            showmodule:'hideModal'
        })
        // 把数据从本地缓存中取出来
        var arr = wx.getStorageSync('getCart') || []
        if (arr.length > 0) {
            for (var i in arr) {
                this.data.total += Number(arr[i].price);
                this.data.goodsCount += Number(arr[i].count);
            }
            // 更新数据  
            this.setData({
                gouwuche: arr,
            });
        }
        console.log(this)
        // 显示遮罩层
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation
            })
        }.bind(this), 200)
    },
    hideModal: function () {
        // 隐藏遮罩层
        this.setData({
            showmodule: 'showModal'
        })
        var animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        })
        this.animation = animation
        animation.translateY(300).step()
        this.setData({
            animationData: animation.export(),
        })
        setTimeout(function () {
            animation.translateY(0).step()
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },

    // 减数
    delCount: function (e) {
        console.log(e)
        console.log(this)
        // 获取购物车该商品的数量  
        // [获取设置在该btn的id,即list的index值]  
        if (this.data.cart[e.target.id.substring(3)].count <= 0) {
            return;
        }
        // 商品总数量-1  
        this.data.goodsCount -= 1;
        // 总价钱 减去 对应项的价钱单价  
        this.data.total -= Number(this.data.cart[e.target.id.substring(3)].price);
        // 购物车主体数据对应的项的数量-1  并赋给主体数据对应的项内  
        this.data.cart[e.target.id.substring(3)].count = --this.data.cart[e.target.id.substring(3)].count;
        var setCartArr = this.data.getcart;
        // console.log(this.data.cart[e.target.id.substring(3)]); // 当前数据
        // 如果没有数据长度不大于0,直接添加用户点击的这条数据
        if (setCartArr.length > 0) {
            for (var i = 0; i < setCartArr.length; i++) {
                // 遍历当前点击的数据是不是缓存数据库里的数据
                if (this.data.cart[e.target.id.substring(3)].id == setCartArr[i].id) {
                    // 该条数据缓存数据库里存在,取最新值,用户点击之后的这条
                    setCartArr[i] = this.data.cart[e.target.id.substring(3)];
                    // 退出当前循环
                    break
                }
            }
            // 把用户点击的这条数据加进数据库里
            setCartArr.push(this.data.cart[e.target.id.substring(3)]);
        } else {
            // 把用户点击的这条数据加进数据库里
            setCartArr.push(this.data.cart[e.target.id.substring(3)]);
        }

        var hash = {};
        // reduce 数组里面去重对象方法，把数组里面一样id的数据去除
        setCartArr = setCartArr.reduce(function (item, next) {
            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
            return item
        }, []);

        for(var i=0;i<setCartArr.length;i++){
            if (setCartArr[i].count==0){
                setCartArr.splice(i,1)
            }
        };
        console.log(setCartArr)
        // 更新data数据对象  
        this.setData({
            cart: this.data.cart,
            total: this.data.total,
            goodsCount: this.data.goodsCount,
            // 更新缓存数据库
            getcart: setCartArr
        })
        // 主体数据重新赋入缓存内  
        try {
            wx.setStorageSync('cart', this.data.cart);
            wx.setStorageSync('getCart', this.data.getcart);          
        } catch (e) {
            console.log(e)
        }
    },
    /* 加数 */
    addCount: function (e) {
        console.log(e)
        console.log(e.target.id)
        // 商品总数量+1  
        this.data.goodsCount += 1;
        // 总价钱 加上 对应项的价钱单价  
        this.data.total += Number(this.data.cart[e.target.id.substring(3)].price);
        // 购物车主体数据对应的项的数量+1  并赋给主体数据对应的项内  
        this.data.cart[e.target.id.substring(3)].count = ++this.data.cart[e.target.id.substring(3)].count;
        // 获取缓存里面数据的新数组
        var setCartArr = this.data.getcart;
        console.log(this.data.cart[e.target.id.substring(3)]); // 当前数据
        // 如果数据长度大于0,则表示缓存数据库里有数据
        if (setCartArr.length > 0) {
            for (var i = 0; i < setCartArr.length; i++) {
                // 遍历当前点击的数据是不是缓存数据库里的数据
                if (this.data.cart[e.target.id.substring(3)].id == setCartArr[i].id) {
                    // 该条数据缓存数据库里存在,取最新值,用户点击之后的这条
                    setCartArr[i] = this.data.cart[e.target.id.substring(3)];
                    // 退出当前循环
                    break
                }
            }
            // 把用户点击的这条数据加进缓存数据库里
            setCartArr.push(this.data.cart[e.target.id.substring(3)]);
        } else {
            // 如果没有数据长度不大于0, 直接添加用户点击的这条数据
            setCartArr.push(this.data.cart[e.target.id.substring(3)]);
        }
        setCartArr.push(this.data.cart[e.target.id.substring(3)]);
        var hash = {};
        // reduce 数组里面去重对象方法，把数组里面一样id的数据去除
        setCartArr = setCartArr.reduce(function (item, next) {
            hash[next.id] ? '' : hash[next.id] = true && item.push(next);
            return item
        }, [])
        // 更新data数据对象 
        this.setData({
            cart: this.data.cart,
            total: this.data.total,
            goodsCount: this.data.goodsCount,
            // 更新缓存数据库
            getcart: setCartArr
        })

        var index = e.target.id
        this.data.carrent[index] = this.data.getcart
        console.log(this.data.carrent)

        // 主体数据重新赋入缓存内  
        try {
            // console.log(this.data.cart)
            // 把缓存数据库存入缓存中
            wx.setStorageSync('getCart', this.data.getcart);
            wx.setStorageSync('carrent', this.data.carrent[index]);
            wx.setStorageSync('cart', this.data.cart)
            // wx.setStorageSync('aa', this.data.cart[e.target.id.substring(3)])
        } catch (e) {
            console.log(e)
        }
    },

    removeS:function(){

    },
    //判断当前滚动超过一屏时，设置tab标题滚动条。
    checkCor: function () {
        if (this.data.currentTab > 4) {
            this.setData({
                scrollLeft: 300
            })
        } else {
            this.setData({
                scrollLeft: 0
            })
        }
    },
    
    footerTap: app.footerTap
})