// pages/order/index.js

// 引入封装好的请求数据的js文件
import {
  request
} from '../../request/index.js';
// 支持es7的async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    current_type: 0,
    tabs: [{
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待收货',
        isActive: false
      },
      {
        id: 2,
        value: '待评价',
        isActive: false
      }
    ]
  },

  onLoad(options) {
    console.log(options);
  },


  onShow(options) {
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    const {
      type
    } = currentPage.options;
    this.changeTitleByIndex(type - 1);
  },

  //获取订单列表
  async getOrders(type) {
    const res = await request({
      url: "/order/search",
      data: {
        type
      }
    });
    var order = res.data.message || [];
    for (var i = 0; i < order.length; i++) {
      order[i].price = order[i].goods_num * order[i].goods_price;
    }
    console.log(order);
    if (res.data.status) {
      this.setData({
        orders: res.data.message
      })
    } else {
      wx.showToast({
        title: '订单查询失败',
        icon: 'none',
        duration: 1500
      });

    }
  },

  //根据标题索引激活选中
  changeTitleByIndex(index) {
    // 获取tabs
    this.data.current_type = index;
    const {
      tabs
    } = this.data
    tabs.forEach((e, i) => i === index ? e.isActive = true : e.isActive = false);
    // 把tabs的值重新赋值
    this.setData({
      tabs
    })
    this.getOrders(index);
  },
  // 点击tab栏切换样式
  handleTabsChange(e) {
    // console.log(e)
    // 获取当前点击元素的索引
    const {
      index
    } = e.detail;
    this.changeTitleByIndex(index);
  },
  //订单删除
  handleOrderDelete(e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '是否删除订单？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          request({
            url: "/order/delete",
            data: {
              id
            }
          }).then((res) => {
            this.getOrders(this.data.current_type);
          });
        }
      }
    });
  },
  handleOrderConfirm(e) {
    console.log(e.currentTarget.dataset.id)
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '您确认收到货了吗？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          request({
            url: "/order/confirm",
            data: {
              id
            }
          }).then((res) => {
            this.getOrders(this.data.current_type);
          });
        }
      }
    });
  }
})