import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Select,
  Button,
  Container,
  FormHelperText,
  Link,
  TextField,
  Typography,
  makeStyles,
  MenuItem,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));


const RegisterView = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <Page
      className={classes.root}
      title="Register"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              realName: '',
              userName: '',
              password: '',
              cardNumber: '',
              cardType: '',
              phoneNumber: '',
              introduction: '',
              city: '',
              levelType: 'Diamond'
            }}
            validationSchema={
              Yup.object().shape({
                // cardNumber: Yup.string().max(20).required('证件号不能为空'),
                userName: Yup.string().max(255).required('Username empty'),
                realName: Yup.string().max(255).required('Name empty'),
                password: Yup.string().max(255).required('Password empty'),
                phoneNumber: Yup.string().max(12).required('Phone empty'),
                // cardType: Yup.string().required('证件类型不能为空')
              })
            }
            // validate={values => {
            // let errors = {};
            // if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9].*?[0-9]).{6,}$/.test(values.password))
            // errors.password = '密码至少包含大写字母，小写字母，2个数字，且不少于6位';
            // if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(values.phoneNumber))
            //   errors.phoneNumber = '请填写正确形式的Phone';
            // return errors;
            // }}

            onSubmit={(values) => {
              values.cardType = 'Identity';
              // values.cardType = values.cardType === '身份证' ? 'Identity' : 'Passport';
              // console.log(values);
              fetch('http://localhost:8080/user/create', {
                method: 'post',
                credentials: "include",
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json'
                },
              }).then(res => res.json())
                .then(data => {
                  console.log(data);
                  if (data.code === 10000) {
                    navigate('/login', { replace: true });
                  }
                  else
                    alert("User already exist!");
                });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values,
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                    align="center"
                  >
                    Register
                  </Typography>

                </Box>
                <TextField
                  error={Boolean(touched.userName && errors.userName)}
                  fullWidth
                  helperText={touched.userName && errors.userName}
                  label="Username"
                  margin="normal"
                  name="userName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.userName}
                  variant="outlined"
                />

                <TextField
                  error={Boolean(touched.password && errors.password)}
                  helperText={touched.password && errors.password}
                  fullWidth
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />

                <TextField
                  error={Boolean(touched.realName && errors.realName)}
                  fullWidth
                  helperText={touched.realName && errors.realName}
                  label="Name"
                  margin="normal"
                  name="realName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.realName}
                  variant="outlined"
                />

                {/* <Box mt={2} mb={0.5}>
                  <FormControl variant="outlined" fullWidth className={classes.formControl}>
                    <InputLabel id="demo-simple-select-outlined-label">证件类型</InputLabel>
                    <Select
                      error={Boolean(touched.cardType && errors.cardType)}
                      label="证件类型"
                      name="cardType"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.cardType}>
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value='身份证'>身份证</MenuItem>
                      <MenuItem value='护照'>护照</MenuItem>
                    </Select>
                    <FormHelperText><font color="red">{touched.cardType && errors.cardType}</font></FormHelperText>
                  </FormControl>
                </Box>


                <TextField
                  error={Boolean(touched.cardNumber && errors.cardNumber)}
                  fullWidth
                  helperText={touched.cardNumber && errors.cardNumber}
                  label="证件号"
                  margin="normal"
                  name="cardNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.cardNumber}
                  variant="outlined"
                /> */}

                <TextField
                  error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                  fullWidth
                  helperText={touched.phoneNumber && errors.phoneNumber}
                  label="Phone"
                  margin="normal"
                  name="phoneNumber"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.phoneNumber}
                  variant="outlined"
                />

                {/* <TextField
                  error={Boolean(touched.introduction && errors.introduction)}
                  fullWidth
                  helperText={touched.introduction && errors.introduction}
                  label=""
                  margin="normal"
                  name="introduction"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.introduction}
                  variant="outlined"
                /> */}

                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Sign up
                  </Button>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Already sign up?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/login"
                    variant="h6"
                  >
                    Sign in
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default RegisterView;
