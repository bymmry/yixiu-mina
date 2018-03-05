//app.js
App({
  onLaunch: function () {
    let that = this;
    // 登录
    wx.login({
      success: res => {
        const appid = 'wx09e56891c8a3ff17'; //填写微信小程序appid  
        const secret = 'f752b99103713585f041e5eb8c783339'; //填写微信小程序secret  
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          // url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${res.code}&grant_type=authorization_code`,
          url: `https://m.yixiutech.com/wx/getOpenid?js_code=${res.code}`,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.statusCode == 200){
              let data = res.data.data;
              that.globalData.openid = data.openid;
              console.log("openid:" + data.openid) //获取openid
            }else{
              console.log(res.errMsg);
            }
          }
        })  
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: null
  }
})