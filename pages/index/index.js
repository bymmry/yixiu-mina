//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    webViewSrc: `https://yixiu.natappvip.cc?userInfo=${app.globalData.userInfo}&openid=${app.globalData.openid}`,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  //事件处理函数

  onLoad: function () {
    this.data.userInfo = app.globalData.userInfo
    console.log(this.data.userInfo)
  }
})
