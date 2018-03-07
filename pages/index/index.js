//index.js
var util = require('../../utils/util')
var wxApi = require('../../utils/wxApi')
var wxRequest = require('../../utils/wxRequest')
import config from '../../utils/config'
//获取应用实例
const app = getApp();
const url = 'http://localhost:8080';

Page({
  data: {
    webViewSrc: "",
    userInfo: {},
    openid: ""
  },
  onLoad: function () {
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var wxLogin = wxApi.wxLogin()
    wxLogin().then(res => {
      console.log('1.登陆成功')
      var url = config.getOpenidUrl;
      var params = {
        appid: "wx09e56891c8a3ff17",
        secret: "f752b99103713585f041e5eb8c783339",
        js_code: res.code,
        grant_type: "authorization_code"
      }
      //2.获取openid
      return wxRequest.getRequest(url, params)
    }).
      then(res => {
        console.log('2.openid获取成功')
        console.log(res.data.data.openid)
        let openid = res.data.data.openid;
        if(openid){
          app.globalData.openid = openid;
          that.data.openid = openid;
        }
        //3.获取用户信息
        var wxGetUserInfo = wxApi.wxGetUserInfo()
        return wxGetUserInfo()
        
      }).
      then(res => {
        console.log('3.用户信息成功')
        console.log(res.userInfo)
        if(res.userInfo){
          that.setWebViewUrl(res.userInfo);
        };
        //4.获取系统信息
        var wxGetSystemInfo = wxApi.wxGetSystemInfo();
        return wxGetSystemInfo()
      }).
      then(res => {
        console.log('4.成功了')
        console.log(res)
        var url = app.globalData.ip + config.searchDgUrl
        var data = util.json2Form({ phoneNumber: '18696835639' })
        //5.获取绑定手机号码
        return wxRequest.postRequest(url, data)
      }).
      then(res => {
        console.log('5.成功了')
        console.log(res.userInfo)
        that.setData({
          userInfo: res.userInfo
        })
      })
      .finally(function (res) {
        console.log('finally~')
        wx.hideToast()
      })
  },
  onShow: function () {
    console.log('on show');
    let paySuccessUrl = app.globalData.paySuccessUrl
    app.globalData.paySuccessUrl = ""; //清空支付成功url，防止一些操作触发onShow事件
    if (paySuccessUrl) {
      let url = decodeURIComponent(paySuccessUrl);

      console.log(url);
      this.setData({
        webViewSrc: 'http://localhost:8080/#/pay?'
      })
    }
  },
  //设置用户信息
  setWebViewUrl: function (userInfo){
    this.data.userInfo = userInfo;
    let StringUserInfo = JSON.stringify(userInfo);
    let webViewUrl = `${url}?userInfo=${StringUserInfo}&openid=${this.data.openid}`;
   
    this.data.webViewSrc = webViewUrl;
    this.setData({
      // webViewSrc: webViewUrl
      webViewSrc: url
    })
    setTimeout(function () {
      wx.hideToast()
    }, 500)
    console.log(webViewUrl);
  }
})
