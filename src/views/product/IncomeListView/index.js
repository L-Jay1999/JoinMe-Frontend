import React, { useState } from 'react';
import {
  Paper,
  Container,
  makeStyles,
  Box,
  Select,
  FormControl,
  MenuItem,
  FormHelperText,
  Button,
  TextField,
  InputLabel
} from '@material-ui/core';
import Page from 'src/components/Page';
import LineChart from './LineChart';
import cityData from '../city.json';
import { Table } from 'antd';
import 'antd/dist/antd.css';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  formControl: {
    minWidth: 150,
  },
  Button: {
    minWidth: 75,
  }
}));

const orderTypes = {
  'Technology': "技术交流",
  'Study': '学业探讨',
  'SocialExperience': '社会实践',
  'PublicBenefit': '公益志愿',
  'Play': '游玩'
}

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
  },
  {
    title: '地域',
    dataIndex: 'locale',
  },
  {
    title: '召集类型',
    dataIndex: 'orderType',
  },
  {
    title: '中介费金额',
    dataIndex: 'income',
    sorter: {
      compare: (a, b) => a.income - b.income
    }
  },
  {
    title: '成交单数',
    dataIndex: 'number',
    sorter: {
      compare: (a, b) => a.number - b.number
    }
  }
]

const IncomeList = () => {
  const classes = useStyles();
  const date = new Date();

  const [selectedCity, setSelectedCity] = useState('');
  const [orderType, setOrderType] = useState(null);
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  const [isType, setIsType] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [chartData, setChartData] = useState({
    x: [],
    y: { 'income': [], 'number': [] },
  });
  // const tableData = [{ key: '1', date: '2019-11-21', locale: 'bei', orderType: 'xx', income: 20, number: 5 },
  // { key: '2', date: '2019-11-21', locale: 'bei', orderType: 'xx', income: 22, number: 6 }]

  //  const chartData = {
  //   x: ['2019-11-21', '2019-11-22', '2019-11-23', '2019-11-24', '2019-11-25', '2019-11-26'],
  //   y: { 'income': [20, 50, 80, 70, 45, 85], 'number': [20, 50, 80, 70, 45, 85] }
  // };


  const handleDate = (e) => {
    switch (e.target.id) {
      case 'startDate':
        setStartDate(e.target.value);
        break;
      case 'endDate':
        setEndDate(e.target.value);
        break;
      default:
        break;
    }
  }

  const handleCity = (e) => {
    setSelectedCity(e.target.value);
  }

  const handleOrderType = (e) => {
    setOrderType(e.target.value);
    setIsType(true);
  }

  const GMTToStr = (time) => {
    const date = new Date(time);
    const Str = date.getFullYear() + '-' +
      (date.getMonth() + 1) + '-' +
      date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds();
    return Str;
  }

  const handleClick = () => {
    if (!orderType) {
      setIsType(false);
    }
    else {
      console.log(startDate)
      console.log(endDate)
      console.log(selectedCity)
      console.log(orderType)
      fetch('http://52.250.51.146:8080/admin/income',
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            'startDate': startDate,
            'endDate': endDate,
            'location': selectedCity,
            'orderType': orderType,
          }),
          headers: {
            'content-type': 'application/json'
          }
        })
        .then(res => res.json())
        .then(val => {
          console.log(val);
          const { data } = val;
          const temp = [];
          const tempChartData = { x: [], y: { 'income': [], 'number': [] } };
          data.map((val, index) => {
            temp.push({
              key: index,
              date: GMTToStr(val['date']),
              income: val['income'],
              locale: val['locale'],
              orderType: orderTypes[val['orderType']],
              number: data.length
            });
            tempChartData.x.push(GMTToStr(val['date']));
            tempChartData.y.income.push(val['income']);
            tempChartData.y.number.push(data.length);
          });
          setTableData(temp);
          setChartData(tempChartData);
        })
        .catch(err => {
          console.log(err);
          alert("查询错误，请重试！");
        })
      // setChartData({
      //   x: ['2019-11-21', '2019-11-22', '2019-11-23', '2019-11-24', '2019-11-25', '2019-11-26'],
      //   y: { 'income': [20, 50, 80, 70, 45, 85], 'number': [10, 20, 30, 70, 45, 90] }
      // })
    }
  }

  return (
    <div>
      <Page
        className={classes.root}
        title="Income"
      >
        <LineChart data={chartData} />
        <Container maxWidth={false}>
          <Box
            display="flex"
            justifyContent="space-between"
          >
            <TextField
              id="startDate"
              label="请选择起始时间"
              type="date"
              defaultValue="2020-01-01"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleDate}
            />
            <TextField
              id="endDate"
              label="请选择终止时间"
              type="date"
              defaultValue={endDate}
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleDate}
            />
            <FormControl variant="outlined" className={classes.formControl} >
              <InputLabel>请选择城市</InputLabel>
              <Select
                id="selectedCity"
                value={selectedCity}
                onChange={handleCity}
              >
                {
                  Object.keys(cityData).map(key => {
                    let city = cityData[key];
                    return (
                      <MenuItem value={city}>
                        {city}
                      </MenuItem>
                    )
                  })
                }
              </Select>
            </FormControl>
            <FormControl variant="outlined" className={classes.formControl} error={!isType}>
              <InputLabel>请选择信令类型</InputLabel>
              <Select
                id="orderType"
                value={orderType}
                onChange={handleOrderType}
              >
                {
                  Object.keys(orderTypes).map(key => {
                    let type = orderTypes[key];
                    return (
                      <MenuItem value={key}>
                        {type}
                      </MenuItem>
                    )
                  })
                }
              </Select>
              {isType || <FormHelperText>需选择信令类型</FormHelperText>}
            </FormControl>
            <Button className={classes.Button} variant="contained" color="primary" onClick={handleClick}>
              查询
        </Button>
          </Box>
          <br />
          <Paper >
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{ position: ['bottomCenter'], showSizeChanger: true, showQuickJumper: true }}
            />
          </Paper>
        </Container>
      </Page>
    </div>
  );
};

export default IncomeList;
