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
  'Technology': "Technology",
  'Study': 'Study',
  'SocialExperience': 'Social Practice',
  'PublicBenefit': 'Volunteer',
  'Play': 'Play'
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
                  <MenuItem value={city}>
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
    </div>
  );
};

