import React, { Component } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/component/legend';

class LineChart extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  // 挂载完成之后，因为React初始化echarts时长宽可能会获取到顶层，所以延迟200去生成，不影响视觉效果
  componentDidMount() {
    setTimeout(() => {
      this.initEchart(this.props.data)
    }, 200)
  }

  // 更新props以后调用
  componentWillReceiveProps(newProps) {
    this.initEchart(newProps.data)
  }

  initEchart = (data) => {
    let myEcharts = echarts.init(this.echartsBox)
    let option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Number of transactions', 'Fee']
      },
      xAxis: {
        data: data.x,
        axisTick: {
          alignWithLabel: true
        }
      },
      yAxis: {
        name: this.props.yname,
        nameGap: 15,
        position: 'left',
        axisTick: {
          inside: true
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [
        {
          name: 'Number of transactions',
          type: 'line',
          data: data.y['number'],
          smooth: false,
          lineStyle: {
            color: '#1E90FF',
            width: 2
          },
          itemStyle: {
            color: '#000',
            borderColor: '#000'
          }
        },
        {
          name: 'Fee',
          type: 'bar',
          data: data.y['income'],
          barWidth: '15%',
        }
      ]
    }
    setTimeout(() => {
      myEcharts.setOption(option);
    }, 500)
  }
  render() {
    return (
      <div ref={(c) => { this.echartsBox = c }} style={{ width: '100%', height: 500 }} />
    )
  }
}

export default LineChart;