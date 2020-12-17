import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
  Button,
  makeStyles
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Logo from 'src/components/Logo';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    width: 60,
    height: 60
  }
}));

const GenerateButton = ({ data, navigate }) => {
  if (data !== 10000) {
    return (
      <Hidden mdDown>
        <IconButton color="inherit" onClick={() => window.location.href = '/login'}>
          <Button variant="contained" color="primary" >
            登录
          </Button>

        </IconButton>
        <IconButton color="inherit" onClick={() => window.location.href = '/register'}>
          <Button variant="contained" color="primary" >
            注册
        </Button>
        </IconButton>
      </Hidden>
    );
  }
  else
    return (
      <Hidden mdDown>
        <IconButton color="inherit">
          <Button variant="contained" color="primary" onClick={() => {
            fetch('http://52.250.51.146:8080/logout', {
              method: 'post',
              credentials: "include",
            }).then(window.location.href = '/app/products');
          }}>
            退出
        </Button>

        </IconButton>
      </Hidden>
    );
}

const TopBar = ({
  className,
  data,
  onMobileNavOpen,
  ...rest
}) => {
  const classes = useStyles();
  // const [notifications] = useState([]);
  const navigate = useNavigate();
  console.log(data);

  // let i = data.data !== 10000;
  return (
    <AppBar
      className={clsx(classes.root, className)}
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <RouterLink to="/">
          <Logo />
        </RouterLink>
        <Box flexGrow={1} />
        <GenerateButton data={data} navigate={navigate} />
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default TopBar;
