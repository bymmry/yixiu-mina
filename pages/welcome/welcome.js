// pages/welcome/welcome.js
const app = getApp()

Page({
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.globalData.userInfo = wx.getStorageSync('userInfo')
    try {
      if (wx.getStorageSync('userInfo') != '') {
        //如果缓存不为空，即已经存在数据，我们不用再跟服务器交互了，那么直接跳转到首页
        wx.navigateTo({
          url: '../index/index',
        })
      }
      if (value) {
        // Do something with return value
        console.log(app.globalData.userInfo)
      }
    } catch (e) {
      // Do something when catch error
      //当try中的缓存数据不存在时，将跳到这步，这步中，我们将与服务器进行连接，并获取数据
      if (app.globalData.userInfo == '') {
        console.log("app")
        wx.login({
          success: function (res) {
            wx.getUserInfo({
              success: function (userInfo) {
                console.log("without")
                let encryptedData = userInfo.encryptedData;
                let userinfo = userInfo.userInfo;
                app.globalData.userInfo = userinfo;
                wx.hideToast()
                //写入缓存
                wx.setStorage({
                  key: 'userInfo',
                  data: app.globalData.userInfo,
                  success: function (res) {
                    console.log("insert success")
                    wx.navigateTo({
                      url: '../index/index',
                    })
                  },
                  fail: function () {
                    // fail
                  },
                  complete: function () {
                    // complete
                  }
                })
              }
            })
          }
        })
      }
    }
  },

})