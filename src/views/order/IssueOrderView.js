import React from 'react';
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

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
  MenuItem,
  Select,
  InputLabel,
  FormControl
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

const IssueOrderView = ({ className, ...rest }) => {
  const [order, setOrder] = useState({
    'orderName': '',
    'number': '',
    'orderType': '',
    'description': '',
    'endDate': ''
  });
  const classes = useStyles();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setOrder({
      ...order,
      [event.target.name]: event.target.value
    });
  };

  return (
    <Page
      className={classes.root}
      title="Issue Activity"
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
                title="Issue Activity"
              />
              <Divider />
              <CardContent>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Activity Name"
                      name="orderName"
                      onChange={handleChange}
                      required
                      value={order.orderName}
                      variant="outlined"
                    />

                  </Grid>
                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Number of People"
                      name="number"
                      onChange={handleChange}
                      required
                      value={order.number}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <TextField
                      label="Due Time"
                      type="date"
                      name="endDate"
                      defaultValue="2017-05-24"
                      onChange={handleChange}
                      value={order.endDate}
                      variant="outlined"
                      className={classes.textField}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid
                    item
                    md={3}
                    xs={12}
                  >
                    <FormControl variant="outlined" fullWidth className={classes.formControl}>
                      <InputLabel required id="demo-simple-select-outlined-label">Activity Type</InputLabel>
                      <Select
                        label="Activity Type"
                        name="orderType"
                        onChange={handleChange}
                        value={order.orderType}>
                        <MenuItem value='Technology'>Technology</MenuItem>
                        <MenuItem value='Study'>Study</MenuItem>
                        <MenuItem value='SocialExperience'>Social Practice</MenuItem>
                        <MenuItem value='PublicBenefit'>Volunteer</MenuItem>
                        <MenuItem value='Play'>Play</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={12}
                    xs={12}
                  >
                    <TextField
                      fullWidth
                      label="Activity Description"
                      name="description"
                      onChange={handleChange}
                      value={order.description}
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
                    fetch('http://localhost:8080/order/issue', {
                      method: 'post',
                      credentials: "include",
                      body: JSON.stringify(order),
                      headers: {
                        'Content-Type': 'application/json'
                      },
                    }).then(res => res.json())
                      .then(data => {
                        console.log(data);
                        console.log(data.data);
                        if (data.code !== 10000)
                          alert('召集令提交失败');
                        else {
                          alert('Submit Activity Success')
                          navigate('/app/products', { replace: true });
                        }
                      })
                  }}
                >
                  Submit Activity
                </Button>
              </Box>
            </Card>
          </form>
        </Grid>
      </Container>
    </Page>
  );
}

export default IssueOrderView;


