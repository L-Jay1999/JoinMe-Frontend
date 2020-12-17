import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Select,
  FormControl,
  MenuItem,
  TextField,
  FormHelperText,
  makeStyles,
  InputLabel,
  Button
} from '@material-ui/core';

import cityData from '../city.json';

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    minWidth: 150,
  },
  Button: {
    minWidth: 75,
  }
}))

const orderTypes = {
  'Technology': "技术交流",
  'Study': '学业探讨',
  'SocialExperience': '社会实践',
  'PublicBenefit': '公益志愿',
  'Play': '游玩'
}

const Toolbar = ({ className, filterText, onFilterTextChange, ...rest }) => {
  const classes = useStyles();
  const date = new Date();

  const [selectedCity, setSelectedCity] = React.useState('');
  const [orderType, setOrderType] = React.useState('');
  const [startDate, setStartDate] = React.useState("2020-01-01");
  const [endDate, setEndDate] = React.useState(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  const [isType, setIsType] = React.useState(true);

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
    alert('hllo');
    setOrderType(e.target.value);
  }

  const handleClick = () => {
    if (!orderType) {
      setIsType(false);
    }
    else {
      alert(selectedCity, orderType);
      fetch('http://localhost:8080/admin/detail',
        {
          method: "POST",
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
    }
  }

  return (
    <div
      className={clsx(classes.root, className)}
      {...rest}
    >
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
    </div>
  );
};

