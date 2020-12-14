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
      title="发起召集令"
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
                title="发起召集令"
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
                      label="召集令名称"
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
                      label="召集人数"
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
                      label="结束时间"
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
                      <InputLabel required id="demo-simple-select-outlined-label">召集令类型</InputLabel>
                      <Select
                        label="召集令类型"
                        name="orderType"
                        onChange={handleChange}
                        value={order.orderType}>
                        <MenuItem value='Technology'>技术交流</MenuItem>
                        <MenuItem value='Study'>学业探讨</MenuItem>
                        <MenuItem value='SocialExperience'>社会实践</MenuItem>
                        <MenuItem value='PublicBenefit'>公益志愿</MenuItem>
                        <MenuItem value='Play'>游玩</MenuItem>
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
                      label="召集令描述"
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
                          alert('召集令提交成功')
                          navigate('/app/products', { replace: true });
                        }
                      })
                  }}
                >
                  提交召集令
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


