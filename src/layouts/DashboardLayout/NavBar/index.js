import React, { useEffect, useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  // Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Map as MapIcon,
  BarChart as ChartIcon,
  Book as BookIcon,
} from 'react-feather';
import NavItem from './NavItem';

const adminItems = [
  {
    href: '/app/details',
    icon: MapIcon,
    title: '明细表',
  },
  {
    href: '/app/income',
    icon: ChartIcon,
    title: '收益汇总表',
  },
  {
    href: '/app/userlist',
    icon: UserIcon,
    title: '用户信息表',
  },
  {
    href: '/app/adminOrderRequest',
    icon: BookIcon,
    title: '请求信息表',
  },
];

const userItems = [
  {
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: '查看召集令'
  },
  {
    href: '/app/myorders',
    icon: ShoppingBagIcon,
    title: '查看我的召集令'
  },
  {
    href: '/app/myrequests',
    icon: ShoppingBagIcon,
    title: '查看我的请求'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: '用户信息'
  },
];


const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const Items = ({ user }) => {
  if (user === "admin")
    return (
      adminItems.map((item) => (
        <NavItem
          href={item.href}
          key={item.title}
          title={item.title}
          icon={item.icon}
        />
      ))
    )
  else {
    return (
      userItems.map((item) => (
        <NavItem
          href={item.href}
          key={item.title}
          title={item.title}
          icon={item.icon}
        />
      ))
    )
  }

};

const NavBar = ({ onMobileClose, openMobile, user }) => {
  const classes = useStyles();
  const location = useLocation();
  console.log(user.userName);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  console.log(user);
  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >

        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          <Box
            height="100%"
            display="flex"
            flexDirection="column"
          >
            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              p={2}
            >
              <Avatar
                className={classes.avatar}
                component={RouterLink}
                // src={user.avatar}
                to="/app/account"
              />

              <Typography
                className={classes.name}
                color="textPrimary"
                variant="h5"
                style={{ padding: 10 }}
              >
                {user.userName}
              </Typography>

            </Box>
            <Divider />
            <Box p={2}>
              <List>
                <Items user={user.userName} />
              </List>
              {/* {console.log(user)}; */}
            </Box>
            <Box flexGrow={1} />
          </Box>
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
