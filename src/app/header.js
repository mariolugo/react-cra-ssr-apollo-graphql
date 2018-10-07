import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
// import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const links = [
  {
    to: "/search",
    text: "Search"
  },
  {
    to: "/list",
    text: "Publicar Piso",
    auth: true
  },
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

// const isCurrent = (to, current) => {
//   if (to === "/" && current === to) {
//     return true;
//   } else if (to !== "/" && current.includes(to)) {
//     return true;
//   }
//
//   return false;
// };

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

  handleCitySelect = address => {
    console.log(address);
    geocodeByAddress(address)
      .then(results => {
        console.log(results);
        this.setState({
          country: results[0].address_components[3].short_name
        });
        return getLatLng(results[0]);
      })
      .then(latLng => {
        let city = address.split(",");
        this.setState({
          city: city[0],
          latLngCity: latLng
        });
        this.state.map.panTo(latLng);
      })
      .catch(error => console.error("Error", error));
  };

  handleCityChange = address => {
    this.setState({ city: address });
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

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex'
  },
  flex: {
    textAlign: 'left',
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  inputRoot: {
   color: 'inherit',
   width: '100%',
 },
 search: {
    position: 'relative',

    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '63%',

  },
  searchBar: {
    width: '50% !important',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
 inputInput: {
   paddingTop: theme.spacing.unit,
   paddingRight: theme.spacing.unit,
   paddingBottom: theme.spacing.unit,
   paddingLeft: theme.spacing.unit * 10,
   transition: theme.transitions.create('width'),
   width: '100%',
   [theme.breakpoints.up('md')]: {
     width: 200,
   },
 },
});

export default withStyles(styles)(Header);
