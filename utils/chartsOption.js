// 饼图
function pieOption(title, data) {
  // 图表内容配置项
  const option = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: '7%',
      left: 'center',
    },
    series: [
      {
        top: '5%',
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: false,
          position: 'center',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold',
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: data,
      },
    ],
  }
  return option
}

// 其他图表的配置...

module.exports = {
  pieOption,
}
