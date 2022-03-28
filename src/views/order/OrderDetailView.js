import React from 'react';
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Button,
  Container,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Page from 'src/components/Page';
import { baseIP } from 'src/ipconfig';

const ordertypes = {
  'Technology': "Technology",
  'Study': 'Study',
  'SocialExperience': 'Social Practice',
  'PublicBenefit': 'Volunteer',
  'Play': 'Play'
}

const orderstates = {
  'Initial': "Not Finished",
  'Respond': 'Not Finished',
  'Finish': 'Finished',
  'Cancel': 'Cancelled',
  'Due': 'Expired'
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const OrderButton = (props) => {
  // console.log("status" + status);
  let temp = "/app/accept/" + props.id;
  console.log(props)

  if (!props.permission)
    return (<Button variant="contained" disabled href="#contained-buttons" style={{ padding: 10 }} align="center">
      Wait for response
    </Button>);
  else if (props.same)
    return (<Button variant="contained" disabled href="#contained-buttons" style={{ padding: 10 }} align="center">
      You created this
    </Button>);
  else if (props.status === 'Respond' || props.status === 'Initial')
    return (<Button variant="contained" color="primary" href={temp} style={{ padding: 10 }} align="center">
      I want to join
    </Button>);
  else
    return (<Button variant="contained" disabled href="#" style={{ padding: 10 }} align="center">
      I want to join
    </Button>);

}

const OrderDetailView = () => {
  const { id } = useParams();
  const [permission, setPermission] = useState(true);
  const [detail, setDetail] = useState([]);
  const classes = useStyles();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(-1);
  const [imageUrl, setUrl] = useState("");

  useEffect(() => {
    fetch('http://' + baseIP + ':8080/order/' + id + '/request', {
      method: 'get',
      credentials: "include",
    }).then(res => res.json()).then(res => {
      console.log(res);
      if (res.data === "YES")
        setPermission(false);
      console.log(permission);
    });

    fetch('http://' + baseIP + ':8080/order/' + id, {
      method: 'get',
      credentials: "include",
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 10000) {
          setDetail(data.data);
          if (data.data.picture === null)
            setUrl("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1812993978,4158651947&fm=26&gp=0.jpg")
          else
            setUrl(data.data.picture)
        }
        else
          navigate('/login', { replace: true });
      });

    fetch('http://' + baseIP + ':8080/user/', {
      method: 'get',
      credentials: "include",
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        console.log(permission);

        if (data.code === 10000)
          setUserId(data.data.userId);
      });
  }, []);
  console.log('id' + detail.orderId);
  console.log('permis' + permission);


  return (
    <Page
      className={classes.root}
      title="Account"
    >
      <Container>
        <Grid
          container
          spacing={3}
        >
          <Card style={{ width: 2000 }}>
            <CardHeader
              style={{ padding: 30 }}
              titleTypographyProps={{ variant: 'h1' }}
              align="center"
              title="Activity Information"
            />
            <Grid container spacing={3}>
              <Grid
                item
                md={4}
                xs={12}
              >
                <CardMedia
                  style={{ width: 400, padding: 60 }}
                  component="img"
                  align="center"
                  alt="Contemplative Reptile"
                  image={imageUrl}
                  title="Contemplative Reptile"
                />
              </Grid>
              <Grid
                item
                md={8}
                xs={12}
              >
                <CardContent style={{ padding: 40 }}>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    Activity Name：{detail.orderName}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    Activity Description：{detail.description}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    Activity Type：{ordertypes[detail.orderType]}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    Number of People：{detail.number}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    Due Time：{detail.endDate}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    Current Status：{orderstates[detail.orderState]}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    {<OrderButton status={detail.orderState} permission={permission} same={userId === detail.userId} id={id} />}
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Container>
    </Page>
  );

}

export default OrderDetailView;


