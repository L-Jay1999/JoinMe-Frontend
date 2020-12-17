import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  Select,
  InputLabel,
  MenuItem,
  FormControl
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [values, setValues] = useState({
    'userName': '',
    'realName': '',
    'password': '',
    'cardType': '',
    'phoneNumber': '',
    'cardNumber': '',
    'introduction': ''
  });
  const [password, setPassword] = useState('')

  useEffect(() => {
    fetch('http://localhost:8080/user/', {
      method: 'get',
      credentials: "include",
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        console.log(data.data);
        if (data.code === 10000)
          setValues(data.data);
        else
          navigate('/login', { replace: true });
      });
  }, []);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          title="用户信息"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                disabled
                fullWidth
                label="用户名"
                name="userName"
                onChange={handleChange}
                required
                value={values.userName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                disabled
                label="姓名"
                name="realName"
                onChange={handleChange}
                required
                value={values.realName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              cs={12}>
              <FormControl variant="outlined" fullWidth className={classes.formControl}>
                <InputLabel required disabled id="demo-simple-select-outlined-label">证件类型</InputLabel>
                <Select
                  disabled
                  label="证件类型"
                  name="cardType"
                  onChange={handleChange}
                  value={values.cardType}>
                  <MenuItem value='Identity'>身份证</MenuItem>
                  <MenuItem value='Passport'>护照</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                disabled
                label="证件号"
                name="cardNumber"
                onChange={handleChange}
                required
                value={values.cardNumber}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                required
                label="手机号"
                name="phoneNumber"
                onChange={handleChange}
                value={values.phoneNumber}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={4}
              xs={12}
            >
              <TextField
                fullWidth
                type="password"
                label="密码"
                name="password"
                onChange={e => setPassword(e.target.value)}
                value={password}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={12}
              xs={12}
            >
              <TextField
                fullWidth
                label="用户描述"
                name="introduction"
                onChange={handleChange}
                value={values.introduction}
                variant="outlined"
              >
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              values['password'] = password;
              fetch('http://localhost:8080/user/', {

                method: 'post',
                credentials: "include",
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json'
                },
              }).then(res => res.json())
                .then(data => {
                  console.log(data);
                  console.log(data.data);
                  if (data.code !== 10000)
                    alert('更新失败');
                  else
                    alert('更新成功')
                })
            }}
          >
            保存信息
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
