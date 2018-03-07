// pages/wxpay/wxpay.js
const app = getApp();
import config from '../../utils/config'
import Parser from '../../plugins/xmldom/dom-parser'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payInfo: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    let jumpUrl = options.jumpUrl;
    let payInfo = options.payInfo;
    let sign;

    //统一下单签名
    wx.request({
      url: `${config.url}/wx/pay/unifiedorder/sign`,
      data: {
        appid: app.globalData.appid,
        attach: "附加数据",
        body: "翼修-手机维修",
        mch_id: "1491224092",
        nonce_str: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
        notify_url: "https://m.yixiutech.com",
        openid: app.globalData.openid,
        out_trade_no: "00001", //商户订单号--------------------
        spbill_create_ip: "120.77.223.115",
        total_fee: "1", //标价金额(单位为分)----------------------
        trade_type: "JSAPI"
      },
      method: "post",
      success: function (res) {
        sign = res.data;
        let payInfo = {
          jumpUrl: options.jumpUrl,
          payInfo: options.payInfo,
          sign: sign
        }
        that.getPrepayId(payInfo);
      },
      fail: function (err) {
        console.log(err);
      },
    })
  },
  getPrepayId: function(data){
    console.log(data);
    let that = this;

    let formData = "<xml>";
    formData += `<appid>${app.globalData.appid}</appid>`;//appid
    formData += `<mch_id>1491224092</mch_id>`;
    formData += `<nonce_str>5K8264ILTKCH16CQ2502SI8ZNMTM67VS</nonce_str>`;
    formData += `<sign>${data.sign}</sign>`;
    formData += `<sign_type>MD5</sign_type>`;
    formData += `<body>翼修-手机维修</body>`;
    formData += `<out_trade_no>00001</out_trade_no>`;
    formData += `<total_fee>1</total_fee>`; //标价金额(单位为分)
    formData += `<spbill_create_ip>120.77.223.115</spbill_create_ip>`;
    formData += `<notify_url>https://m.yixiutech.com</notify_url>`;
    formData += `<trade_type>JSAPI</trade_type>`;
    formData += "</xml>";

    wx.request({
      url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
      data: formData,
      method: "POST",
      success: function (res) {
        let pay = res.data;
        console.log(pay);
        let xmlParser = new Parser.DOMParser();
        let doc = xmlParser.parseFromString(res.data);
        console.log(doc);
        that.pay("", data.jumpUrl);
      },
      fail: function (err) {
        console.log(err);
      },
      complete: function () {
        console.log("complete");
      }
    })
  },
  pay: function (prepay_id, jumpUrl) {
    let that = this;
    let currentTime = new Date().getTime().toString();
    let nonce_str = "e61463f8efa94090b1f366cccfbbb444";
    let key = "";
    var sign = '';
    var signA = "appId=" + app.globalData.appid + "&nonceStr=" + nonce_str + "&package=prepay_id=" + prepay_id + "&signType=MD5&timeStamp=" + currentTime;
    var signB = signA + "&key=" + key;
    // sign = MD5Util.md5(signB).toUpperCase();

    //success
        // wx.navigateBack();

    wx.requestPayment({
      timeStamp: currentTime,
      nonceStr: nonce_str,
      package: "prepay_id=" + prepay_id,
      signType: 'MD5',
      paySign: sign,
      success: function (data) {
        console.log(data);


        //success
        // wx.navigateBack();
      },
      fail: function (res) {
        
        that.paySuccess(jumpUrl);

      }
    })
  },
  paySuccess: function (jumpUrl) {
    let currentTime = new Date().getTime();
    let url = jumpUrl + encodeURIComponent(`?payResult=1&time=${currentTime}`);
    app.globalData.paySuccessUrl = url;
    wx.navigateBack();
  }
})