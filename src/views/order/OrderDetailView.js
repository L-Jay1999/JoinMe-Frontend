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

const ordertypes = {
  'Technology': "技术交流",
  'Study': '学业探讨',
  'SocialExperience': '社会实践',
  'PublicBenefit': '公益志愿',
  'Play': '游玩'
}

const orderstates = {
  'Initial': "未完成",
  'Respond': '未完成',
  'Finish': '已完成',
  'Cancel': '已取消',
  'Due': '已过期'
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
      您已发送接令请求
    </Button>);
  else if (props.same)
    return (<Button variant="contained" disabled href="#contained-buttons" style={{ padding: 10 }} align="center">
      您是令主
    </Button>);
  else if (props.status === 'Respond' || props.status === 'Initial')
    return (<Button variant="contained" color="primary" href={temp} style={{ padding: 10 }} align="center">
      我要接令
    </Button>);
  else
    return (<Button variant="contained" disabled href="#" style={{ padding: 10 }} align="center">
      我要接令
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
    fetch('http://localhost:8080/order/' + id + '/request', {
      method: 'get',
      credentials: "include",
    }).then(res => res.json()).then(res => {
      console.log(res);
      if (res.data === "YES")
        setPermission(false);
      console.log(permission);
    });

    fetch('http://localhost:8080/order/' + id, {
      method: 'get',
      credentials: "include",
    }).then(res => res.json())
      .then(data => {
        console.log(data);
        if (data.code === 10000) {
          setDetail(data.data);
          if (data.data.picture === null)
            setUrl("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1812993978,4158651947&fm=26&gp=0.jpg")
        }
        else
          navigate('/login', { replace: true });
      });

    fetch('http://localhost:8080/user/', {
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
              title="召集令信息"
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
                    召集令名称：{detail.orderName}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    召集令描述：{detail.description}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    召集令类型：{ordertypes[detail.orderType]}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    召集人数：{detail.number}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    结束时间：{detail.endDate}
                  </Typography>
                  <Typography gutterBottom variant="h3" component="h2" md={12} style={{ padding: 10 }}>
                    当前状态：{orderstates[detail.orderState]}
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


