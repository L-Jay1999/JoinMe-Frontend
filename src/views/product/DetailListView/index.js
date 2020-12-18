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
import { Table, Modal } from 'antd';
import 'antd/dist/antd.css';
import cityData from '../city.json';

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


const DetailList = () => {
  const classes = useStyles();
  const date = new Date();

  const [tableData, setTableData] = useState([]);
  // const tableData = [
  //   {'orderId':'1', 'number': 10 , 'finishDate':'2018-07-05', 'fee':60 }, {'orderId':'2', 'number': 15 , 'finishDate':'2018-06-05', 'fee':80 }
  // ]
  const [selectedCity, setSelectedCity] = useState('');
  const [orderType, setOrderType] = useState(null);
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  const [isType, setIsType] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleCheck = (id) => {
    fetch('http://52.250.51.146:8080/admin/user/' + id, { method: 'GET', credentials: "include" })
      .then(res => res.json())
      .then(val => {
        console.log(val);
        const { data } = val;
        setUserInfo({
          '用户姓名': data.userName,
          '用户ID': data.userId,
          '用户联系方式': data.phoneNumber,
          // '用户注册日期': data.regitsterDate,
          '用户介绍': data.introduction
        });
        setIsModalVisible(true);
      })
      .catch(err => {
        console.log(err);
        alert('查询失败，请重试！');
      })
    console.log(userInfo);

  }

  const handleModal = () => {
    setIsModalVisible(false);
  }

  const columns = [
    {
      title: '召集令号',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: '召集人数',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: '令主ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: '达成日期',
      dataIndex: 'finishDate',
      key: 'finishDate',
    },
    {
      title: '中介费',
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: '查看令主信息',
      key: 'check',
      render: (text, record) => {
        return (<Button color="primary" onClick={() => { handleCheck(record.userId) }}>
          查看令主信息
        </Button>)
      }
    }
  ]

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

  const handleClick = () => {
    if (!orderType) {
      setIsType(false);
    }
    else {
      console.log(orderType);
      fetch('http://52.250.51.146:8080/admin/detail',
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
          const temp = []
          data.map((val) => {
            temp.push({
              key: val.detailId,
              userId: val.userId,
              orderId: val.orderId,
              number: val.acceptUsers.length,
              finishDate: GMTToStr(val.finishDate),
              fee: (val.acceptUsers.length * 4),
            })
          })
          setTableData(temp);
        })
        .catch(err => {
          console.log(err);
          alert("查询错误，请重试！");
        })
    }
  }

  return (
    <Page
      className={classes.root}
      title="Details"
    >
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
                    <MenuItem value={key}>
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
      <Modal title="令主信息" visible={isModalVisible} onOk={handleModal} onCancel={handleModal}>
        {
          Object.keys(userInfo).map(key =>
            (<p>{key}：{userInfo[key]}</p>)
          )
        }
      </Modal>
    </Page>
  );
};

export default DetailList;
