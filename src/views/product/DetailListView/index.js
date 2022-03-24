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
  'Technology': "Technology",
  'Study': 'Study',
  'SocialExperience': 'Social Practice',
  'PublicBenefit': 'Volunteer',
  'Play': 'Play'
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
    fetch('http://localhost:8080/admin/user/' + id, { method: 'GET', credentials: "include" })
      .then(res => res.json())
      .then(val => {
        console.log(val);
        const { data } = val;
        setUserInfo({
          'Name': data.userName,
          'User ID': data.userId,
          'Contact Number': data.phoneNumber,
          // '用户注册日期': data.regitsterDate,
          'Account Information': data.introduction
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
      title: 'Activity Number',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Number of People',
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: 'Creator ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'Finished Date',
      dataIndex: 'finishDate',
      key: 'finishDate',
    },
    {
      title: 'Fee',
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: 'Check creator information',
      key: 'check',
      render: (text, record) => {
        return (<Button color="primary" onClick={() => { handleCheck(record.userId) }}>
          Check creator information
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
      fetch('http://localhost:8080/admin/detail',
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
            label="Start Date"
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
            label="End Date"
            type="date"
            defaultValue={endDate}
            className={classes.textField}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleDate}
          />
          {/* <FormControl variant="outlined" className={classes.formControl} >
            <InputLabel>City</InputLabel>
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
          </FormControl> */}
          <FormControl variant="outlined" className={classes.formControl} error={!isType}>
            <InputLabel>Activity Type</InputLabel>
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
            {isType || <FormHelperText>Need to choose one</FormHelperText>}
          </FormControl>
          <Button className={classes.Button} variant="contained" color="primary" onClick={handleClick}>
            Search
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
      <Modal title="Creator Information" visible={isModalVisible} onOk={handleModal} onCancel={handleModal}>
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
