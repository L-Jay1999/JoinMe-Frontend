import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
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

import cityData from '../city.json';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%'
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
  { id: 'date', label: '日期' },
  { id: 'income', label: '收入' },
  { id: 'locale', label: '地域' },
  { id: 'orderType', label: '召集类型' },

];

const IncomeList = () => {
  const classes = useStyles();
  const date = new Date();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [details, setDetails] = useState([]);
  const [selectedCity, setSelectedCity] = React.useState('');
  const [orderType, setOrderType] = React.useState('');
  const [startDate, setStartDate] = React.useState("2020-01-01");
  const [endDate, setEndDate] = React.useState(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
  const [isType, setIsType] = React.useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
      alert(selectedCity, orderType);
      fetch('http://52.250.51.146:8080/admin/detail',
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
        .then(res => res.json())
        .then(val => {
          const { data } = val;
          setDetails(data);
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
          <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {details.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.orderId}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number' ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={details.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </Page>
  );
};

export default IncomeList;
