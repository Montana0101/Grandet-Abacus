// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputValue: "",
    list: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  copy_url(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.url
      })
  },
  input_change(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  search_books() {
    wx.showLoading({
      title: '全网搜索中',
    })
    wx.request({
      url: `https://kittys.group:80/api/spider/books?keyword=${this.data.inputValue}`,
      success: (res) => {
        if (res.data.length > 99) {
          res.data = res.data.splice(0, 99)
        }
        res.data.map(item=>{
          if(item.title.length>8){
            item.title = item.title.slice(0,7)
          }
          if(item.author.length>7){
            item.author = item.author.slice(0,6)
          }
          if(item.source=='孔夫子旧书网'){
            item.source='孔夫子网'
          }
   
          console.log('item is',item)
        })
        console.log('成功调用', res.data)
        this.setData({
          list: res.data
        }, () => {
          wx.hideLoading()
        })
      }
    })
    console.log(this.data.inputValue)
  }
})