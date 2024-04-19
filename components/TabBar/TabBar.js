Component({
  properties: {
    tabBarValue: {
      type: String,
      default: 'home',
    },
  },

  data: {
    list: [
      { value: 'home', label: '首页' },
      { value: 'overview', label: '总览' },
      { value: 'manage', label: '管理' },
      { value: 'user', label: '我的' },
    ],
  },

  methods: {
    onTabBarChange(e) {
      const value = e.detail.value
      console.log(value, this.data.tabBarValue)
      if (value == this.data.tabBarValue) return false
      switch (value) {
        case 'home':
          return wx.$replace('/pages/basic/dashboard')
        case 'overview':
          return wx.$replace('/pages/overview/overview')
        case 'manage':
          return wx.$replace('/pages/manage/manage')
        case 'user':
          return wx.$replace('/pages/user/user')
      }
    },
  },
})
