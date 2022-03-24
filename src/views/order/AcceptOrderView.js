import React from 'react';
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Button,
  Container,
  Grid,
  TextField,
  makeStyles,
  Divider,
} from '@material-ui/core';
import Page from 'src/components/Page';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const AcceptOrderView = ({ className, ...rest }) => {
  const { id } = useParams();
  const [values, setValues] = useState({
    'description': ''
  });
  const [details, setDetails] = useState({
    'orderName': '',
    'number': ''
  });
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/order/' + id, {
      method: 'get',
      credentials: "include",
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 10000)
          setDetails(data.data);
        else
          navigate('/login', { replace: true });
      });
  }, []);

  const handleOnChange = (event) => {
    setDetails({
      ...details,
      [event.target.name]: event.target.details
    });
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };


  return (
    <Page
      className={classes.root}
      title="提交接令请求"
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <form
            autoComplete="off"
            noValidate
            className={clsx(classes.root, className)}
            {...rest}
          >
            <Card>
              <CardHeader
                title="Activity Request"
              />
              <Divider />
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      disabled
                      fullWidth
                      label="Activity Name"
                      name="orderName"
                      onChange={handleOnChange}
                      required
                      value={details.orderName}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid
                    item
                    md={6}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      disabled
                      label="Number of People"
                      name="number"
                      onChange={handleOnChange}

                      required
                      value={details.number}
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
                      label="User Description"
                      name="description"
                      onChange={handleChange}
                      value={values.description}
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
                    fetch('http://localhost:8080/order/' + id + '/request', {
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
                          alert('请求提交失败');
                        else {
                          alert('Submit Request Success')
                          navigate('/app/products', { replace: true });
                        }
                      })
                  }}
                >
                  Submit Request
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>
      </Container>
    </Page>
  );
}

export default AcceptOrderView;