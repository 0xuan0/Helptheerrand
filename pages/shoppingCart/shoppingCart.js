const app = getApp();

Page({
    data: {
        iscart: false,
        cart: [
          // 假数据，接口处理好后调接口
          {id:1,name: '布丁',price: 90,imgUrl:'/images/0.jpg',count:1},
          {id:2,name: '冰淇淋',price: 65,imgUrl: '/images/1.jpg', count: 1}
        ], //数据  
        count: 1,
        total: 0,    //总金额  
        goodsCount: 0, //数量  
        getCart:[]
    },
    onShow: function () {

        // 获取产品展示页保存的缓存数据（购物车的缓存数组，没有数据，则赋予一个空数组）  
        // var arr = wx.getStorageSync('cart') || [];
        var huancunCart = wx.getStorageSync('getCart') || [];
        console.log(huancunCart)
        // var cartArr = []
        // for (var i in arr) {
        //     console.log(arr[i].count)
        //     if (arr[i].count != 0) {
        //         cartArr.push(arr[i])
        //         console.log(cartArr)
        //     }
        // };
        // 有数据的话，就遍历数据，计算总金额 和 总数量  
        if (huancunCart.length > 0) {
            for (var i in huancunCart) {
                this.data.total += Number(huancunCart[i].price * huancunCart[i].count);
                this.data.goodsCount += Number(huancunCart[i].count);
            }
            // 更新数据  
            this.setData({
                iscart: true,
                total: this.data.total,
                goodsCount: this.data.goodsCount,
                getCart: huancunCart
            });
        }
    },
    /* 减数 */
    delCount: function (e) {
        console.log(e)
        // 获取购物车该商品的数量  
        // [获取设置在该btn的id,即list的index值]  
        if (this.data.getCart[e.target.id.substring(3)].count <= 1) {
            return;
        }
        // 商品总数量-1  
        this.data.goodsCount -= 1;
        // 总价钱 减去 对应项的价钱单价  
        this.data.total -= Number(this.data.getCart[e.target.id.substring(3)].price);
        // 购物车主体数据对应的项的数量-1  并赋给主体数据对应的项内  
        this.data.getCart[e.target.id.substring(3)].count = --this.data.getCart[e.target.id.substring(3)].count;
        // 更新data数据对象  
        this.setData({
            total: this.data.total,
            goodsCount: this.data.goodsCount,
            getCart: this.data.getCart
        })
        // 主体数据重新赋入缓存内  
        try {
            // wx.setStorageSync('cart', this.data.cart)
            wx.setStorageSync('getCart', this.data.getCart)
        } catch (e) {
            console.log(e)
        }
    },
    /* 加数 */
    addCount: function (e) {
        console.log(e)
        // 商品总数量+1  
        this.data.goodsCount += 1;
        // 总价钱 加上 对应项的价钱单价  
        console.log(this.data.getCart[e.target.id.substring(3)]);
        this.data.total += Number(this.data.getCart[e.target.id.substring(3)].price);
        // 购物车主体数据对应的项的数量+1  并赋给主体数据对应的项内  
        this.data.getCart[e.target.id.substring(3)].count = ++this.data.getCart[e.target.id.substring(3)].count;
        // 更新data数据对象  
        this.setData({
            getCart: this.data.getCart,
            total: this.data.total,
            goodsCount: this.data.goodsCount
        })
        // 主体数据重新赋入缓存内  
        try {
            // wx.setStorageSync('cart', this.data.cart)
            wx.setStorageSync('getCart', this.data.getCart)
        } catch (e) {
            console.log(e)
        }
    },
    /* 删除item */
    delGoods: function (e) {
        // 商品总数量  减去  对应删除项的数量  
        this.data.goodsCount = this.data.goodsCount - this.data.getCart[e.target.id.substring(3)].count;
        // 总价钱  减去  对应删除项的单价*数量  
        this.data.total -= this.data.getCart[e.target.id.substring(3)].price * this.data.getCart[e.target.id.substring(3)].count;
        // 主体数据的数组移除该项  
        this.data.getCart.splice(e.target.id.substring(3), 1);
        // 更新data数据对象  
        this.setData({
            getCart: this.data.getCart,
            total: this.data.total,
            goodsCount: this.data.goodsCount
        })
        // 主体数据重新赋入缓存内  
        try {
            wx.setStorageSync('getCart', this.data.getCart)
        } catch (e) {
            console.log(e)
        }
    },
    // 付款
    cartSubmit:function(e){
        console.log(e)
        var page = this;
        console.log(page)
        var cart_list = page.data.cart_list;
        var cart_id_list = [];
        for (var i in cart_list) {
            if (cart_list[i].checked)
                cart_id_list.push(cart_list[i].cart_id);
        }
        if (cart_id_list.length == 0) {
            return true;
        }
        wx.navigateTo({
            url: '/pages/order-submit/order-submit?cart_id_list=' + JSON.stringify(cart_id_list),
        });
    }
})