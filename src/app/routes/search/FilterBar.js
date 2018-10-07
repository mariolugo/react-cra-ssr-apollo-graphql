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
import NavPlacesAutocomplete from '../../components/NavPlacesAutocomplete';
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import AmenitiesDialog from './AmenitiesDialog';

class FilterBar extends React.Component {
  state = {
    anchorEl: null,
  };



  render(){
    const { isAuthenticated, current, currentUser, classes, handleCitySelect, handleCityChange, city, handleOrderBy, orderBy, price, handleMaxPrice, amenities, bed, handleBed, handleAmenities, handleAcceptDialog, openDialog, handleDialogClose, handleOpenDialog, handleDeleteFilters } = this.props;
    const { anchorEl } = this.state;

    const open = Boolean(anchorEl);
    return (
      <Toolbar className={classes.searchCompleteBar}>
          <Grid container spacing={0} style={{
                  height: 64
              }}>
              <Grid item xs={12} sm={6} className={classes.padding8}>
                  <div className={classes.search}>
                      <div className={classes.searchBar}>
                        <NavPlacesAutocomplete
                          handleSelect={handleCitySelect}
                          classes={classes}
                          label={"Ciudad"}
                          type={"city"}
                          handleChange={handleCityChange}
                          address={city}
                        />

                      </div>
                  </div>
              </Grid>
              <Grid item xs={12} sm={2} className={classes.inputOrderFilter}>
                  <Select
                    value={orderBy}
                    disableUnderline
                    displayEmpty
                    className={classes.selectOrder}
                    onChange={handleOrderBy}
                    inputProps={{
                      name: 'orderBy',
                      id: 'order-by',
                    }}
                  >
                    <MenuItem value="" >Ordernar por</MenuItem>
                    <MenuItem value={'createdAt_DESC'} >Recientes</MenuItem>
                    <MenuItem value={'price_ASC'}>Precio menor a mayor</MenuItem>
                    <MenuItem value={'price_DESC'}>Precio mayor a menor</MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={12} sm={2} className={classes.inputFilter}>
                  <Button
                      className={classes.button}
                      onClick={handleOpenDialog}>
                      Comodidades
                  </Button>
              </Grid>
              <Grid item xs={12} sm={2}>
                  <Input
                    placeholder="Precio max"
                    value={price}
                    disableUnderline
                    classes={{
                    root: classes.inputFilter,
                    input: classes.inputPrice,
                    }}
                    onChange={handleMaxPrice}
                    />
              </Grid>
          </Grid>
          <AmenitiesDialog
              handleClose={handleDialogClose}
              handleAcceptDialog={handleAcceptDialog}
              amenities={amenities}
              bed={bed}
              handleBed={handleBed}
              handleAmenities={handleAmenities}
              open={openDialog}
              classes={classes}
              handleDeleteFilters={handleDeleteFilters}
              />
      </Toolbar>
    )
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex'
  },
  checkboxGrid: {
  marginTop: 10,
  padding: '11px !important'
},
checkBoxLabel:{
  display: 'block',
  marginTop: 14,
  textAlign: 'center'
},
  layout: {
  width: "auto",
  marginLeft: theme.spacing.unit * 3,
  marginRight: theme.spacing.unit * 3,
  marginTop: 20,
  [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
    width: 1000,
    marginLeft: "auto",
    marginRight: "auto"
  }
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
      height: 50
 },
 inputPrice: {
     width: '100%'
 },
 inputFilter: {
     color: 'inherit',
     width: '100%',
     height: '100%',
     borderLeft: '1px solid #dedede',
     paddingLeft: 10
 },
 inputOrderFilter: {
     color: 'inherit',
     width: '100%',
     height: '100%',
     borderLeft: '1px solid #dedede',
 },
 formControl:{
    width:'100%'
 },
 button:{
    marginTop: 15
 },
 inputInput: {
   paddingTop: theme.spacing.unit,
   paddingRight: theme.spacing.unit,
   paddingBottom: theme.spacing.unit,
   paddingLeft: theme.spacing.unit * 10,
   transition: theme.transitions.create('width'),
   width: '100%',
 },
 selectOrder:{
    width: '100%',
    height: 64
},
 padding8: {
    paddingTop: 8
 },
 search: {
    position: 'relative',
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
    height: 50,
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '96%',

  },
  searchCompleteBar:{
    marginTop: 20,
    marginBottom: -20
  },
  searchBar: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    [theme.breakpoints.up('sm')]: {
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

});

export default withStyles(styles)(FilterBar);
