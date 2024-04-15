//Page Object
Page({
  data: {
    tabValue: '0',
    tabBarValue: 'home',
    list: [
      { value: 'home', label: '首页' },
      { value: 'search', label: '查询' },
      { value: 'app', label: '应用' },
      { value: 'user', label: '我的' },
    ],
  },
  // 选项卡更新
  onTabChange(e) {
    this.setData({
      tabValue: e.detail.value,
    })
  },
  // 导航更新
  onTabBarChange(e) {
    this.setData({
      tabBarValue: e.detail.value,
    })
  },
})
