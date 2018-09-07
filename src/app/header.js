import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const links = [
  {
    to: "/",
    text: "Homepage"
  },
  {
    to: "/dashboard",
    text: "Dashboard",
    auth: true
  },
  {
    to: "/login",
    text: "Login",
    auth: false
  },
];

const isCurrent = (to, current) => {
  if (to === "/" && current === to) {
    return true;
  } else if (to !== "/" && current.includes(to)) {
    return true;
  }

  return false;
};

const HeaderLink = ({ to, text, current, currentUser, open, handleClick, handleClose, anchorEl }) => {
  if (to === "/dashboard") {
    return (
      <div>
        <IconButton
          color="inherit"
          aria-label="Menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <AccountCircle />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          id="menu-appbar"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          <Link to={'/dashboard'}>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
          </Link>
          <Link to={'/logout'}>
            <MenuItem onClick={handleClose}>Log Out</MenuItem>
          </Link>
        </Menu>
      </div>
    );
  }

  return (
      <Link to={to}>
        <Button color="inherit">{text}</Button>
      </Link>
  );
};

class Header extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });

  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render(){
    const { isAuthenticated, current, currentUser, classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <div className={classes.root} id="header">
        <AppBar position="static">
          <Toolbar>
            <Link to={'/'} className={classes.flex}>
              <Typography variant="title" color="inherit" >
                News
              </Typography>
            </Link>
              {links.map((link, index) => {
                const TheLink = (
                  <HeaderLink
                    key={index}
                    current={current}
                    currentUser={currentUser}
                    open={open}
                    handleClick={this.handleClick}
                    handleClose={this.handleClose}
                    anchorEl={anchorEl}
                    {...link}
                  />
                );

                if (link.hasOwnProperty("auth")) {
                  if (link.auth && isAuthenticated) {
                    return TheLink;
                  } else if (!link.auth && !isAuthenticated) {
                    return TheLink;
                  }

                  return null;
                }

                return TheLink;
              })}

          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const styles = {
  root: {
    flexGrow: 1,
    display: 'flex'
  },
  flex: {
    flexGrow: 1,
    textAlign: 'left'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

export default withStyles(styles)(Header);
