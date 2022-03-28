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
import { baseIP } from 'src/ipconfig';

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
  const classes = useStyles();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://' + baseIP + ':8080/orderrequest/' + id, {
      method: 'get',
      credentials: "include",
    }).then(res => res.json())
      .then(data => {
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
    <Page
      className={classes.root}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
        >
          <Card>
            <CardHeader
            />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    label="User Introduction"
                    name="description"
                    onChange={handleChange}
                    value={values.description}
                    variant="outlined"
                  >
                  </TextField>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      fetch('http://' + baseIP + ':8080/orderrequest/' + id, {
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
                          else {
                            alert('更新成功')
                          }
                        })
                    }}
                  >
                    Update Request
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Container>
    </Page>
  );
}

export default AcceptOrderView;