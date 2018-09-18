import React from "react";
import { compose } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { isServer } from "../../../store";
import "./list-room.css";
import GoogleMapsComponent from "./GoogleMapsComponent";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import GooglePlacesComponent from "./GooglePlacesComponent";
import GoogleCitiesComponent from "./GoogleCitiesComponent";
import sideImg from "../../assets/sideimg.jpg";
import { Circle } from "react-google-maps";

class RoomLocationComponent extends React.Component {
  state = {
    parentWidth: 0,
    activeStep: 0,
    address: "",
    city: "",
    map: {},
    latLngCity: {},
    latLngAddress: {},
    latLng: {},
    country: "",
    zoom: 13,
    completed: new Set()
  };

  parentWidth = React.createRef();

  componentWillMount() {
    const { room } = this.props;

    if (Object.keys(room).length > 0 && room.constructor === Object) {
      this.setState({
        ...room
      });
    }
  }

  componentDidMount() {
    if (!isServer) {
      document.body.classList.add("full-height");
    }
    this.setState({
      parentWidth: this.parentWidth.current.offsetWidth
    });

    const { room } = this.props;

    if (Object.keys(room).length > 0 && room.constructor === Object) {
      this.handleCitySelect(`${room.city}, ${room.country}`);
      this.handleSelect(room.address);
    }
  }

  componentWillUnmount() {
    if (!isServer) {
      document.body.classList.remove("full-height");
    }
  }

  handleSelect = address => {
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        this.setState({
          address,
          latLngAddress: latLng,
          latLng: latLng,
          zoom: 16
        });
        this.state.map.panTo(latLng);
      })
      .catch(error => console.error("Error", error));
  };

  handleChange = address => {
    this.setState({ address });
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

  onMapMounted = ref => {
    this.setState({
      map: ref
    });
  };

  _onError = error => {
    console.log({ error });
  };

  render() {
    const { classes, handleNextStep, room } = this.props;
    const {
      parentWidth,
      address,
      city,
      latLngCity,
      latLngAddress,
      zoom,
      country,
      latLng
    } = this.state;

    const circleOptions = {
      radius: 200,
      fillColor: "#AA0000",
      strokeColor: "transparent"
    };

    const mapOptions = {
      disableDefaultUI: true
    };

    return (
      <div className={classes.layout}>
        <Grid container spacing={16} className={classes.marginTop15}>
          <Grid item xs={6} className={classes.leftContainer}>
            <form className={classes.formGroup} ref={this.parentWidth}>
              {/*NAMES*/}
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="title"
                    gutterBottom
                    className={classes.label}
                  >
                    Ubicación
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl margin="normal" fullWidth>
                    <GoogleCitiesComponent
                      handleSelect={this.handleCitySelect}
                      classes={classes}
                      label={"Ciudad"}
                      type={"city"}
                      handleChange={this.handleCityChange}
                      address={city}
                    />
                  </FormControl>
                  <FormControl margin="normal" fullWidth>
                    <GooglePlacesComponent
                      handleSelect={this.handleSelect}
                      classes={classes}
                      label={"Dirección"}
                      type={"address"}
                      latLngCity={latLngCity}
                      handleChange={this.handleChange}
                      address={address}
                    />
                  </FormControl>
                  No se muestra la dirección exacta, sólo el area
                </Grid>
              </Grid>
            </form>
            <div
              className={classes.actionButtons}
              style={{ width: parentWidth }}
            >
              <Grid container spacing={16} className={classes.marginTop15}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    onClick={() => {
                      this.props.history.push("/");
                    }}
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="button"
                    fullWidth
                    variant="raised"
                    color="primary"
                    className={classes.submit}
                    onClick={() =>
                      handleNextStep({
                        ...room,
                        city,
                        address,
                        latLng,
                        country
                      })
                    }
                  >
                    Continuar
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={6} className={classes.rightContainer}>
            {Object.keys(latLngCity).length === 0 &&
              latLngCity.constructor === Object && (
                <img
                  className={classes.imgResponsive}
                  src={sideImg}
                  title={"Room Location"}
                  alt={"Room Location"}
                />
              )}
            {Object.keys(latLngCity).length !== 0 &&
              latLngCity.constructor === Object && (
                <Paper className={classes.paper}>
                  <div style={{ height: "100%", width: "100%" }}>
                    <GoogleMapsComponent
                      zoom={zoom}
                      defaultOptions={mapOptions}
                      onMapMounted={this.onMapMounted}
                      defaultCenter={{ lat: 19.364473, lng: -99.176253 }}
                      loadingElement={<div style={{ height: `100%` }} />}
                      containerElement={<div style={{ height: `100%` }} />}
                      mapElement={<div style={{ height: `100%` }} />}
                    >
                      {Object.keys(latLngAddress).length !== 0 &&
                        latLngCity.constructor === Object && (
                          <Circle
                            defaultCenter={latLngAddress}
                            defaultOptions={circleOptions}
                          />
                        )}
                    </GoogleMapsComponent>
                  </div>
                </Paper>
              )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gridGap: `${theme.spacing.unit * 3}px`
  },
  formGroup: {},
  leftContainer: {
    overflow: "scroll",
    marginBottom: 150,
    paddingRight: "50px !important"
  },
  rightContainer: {
    height: "100%"
  },
  actionButtons: {
    position: "fixed",
    bottom: 0,
    backgroundColor: "#fff",
    height: 80,
    borderTop: "1px solid #d5d5d5"
  },
  imageButton: {
    position: "absolute",
    right: 19,
    top: 14
  },
  imageGrid: {
    display: "flex",
    position: "relative"
  },
  images: {
    width: 140,
    display: "block",
    height: 140,
    margin: "0 auto"
  },
  drawerContainer: {
    padding: 15,
    backgroundColor: "#F5F5F5"
  },
  drawerContainer2: {
    backgroundColor: "#F5F5F5",
    overflow: "scroll",
    height: "calc(100% - 173px)"
  },
  expansionPanel: {
    width: 430
  },
  textTabTitle: {
    paddingLeft: 15,
    marginTop: 10
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  text: {
    textAlign: "left",
    color: "black"
  },
  textInline: {
    display: "inline-block",
    color: "black"
  },
  textDrawer: {
    paddingLeft: 15
  },
  textSubDrawer: {
    paddingLeft: 15,
    marginBottom: 20
  },
  label: {
    textAlign: "left",
    paddingBottom: 0,
    marginTop: 20,
    marginBottom: -10
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit,
    height: "calc(100vh - 305px)"
  },
  paddingSides10: {
    paddingLeft: 10,
    paddingRight: 10
  },
  paddingTop5: {
    paddingTop: 5
  },
  divider: {
    margin: `${theme.spacing.unit * 2}px 0`
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  },
  imgResponsive: {
    margin: "0 auto",
    width: "100%",
    marginTop: 15,
    marginBottom: 15
  },
  marginTop15: {
    marginTop: 15
  },
  layout: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 0,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: "auto",
      marginRight: "auto"
    },
    flex: 1,
    boxSizing: "border-box",
    borderBottom: "none",
    margin: 15,
    height: "calc(100vh - 30px)",
    display: "flex",
    flexDirection: "column"
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: "auto",
    width: 200
  },
  groupOccupation: {
    margin: "auto",
    width: 400
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 5
  },
  starDiv: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "blue",
    left: 10,
    width: 31,
    height: 31
  }
});

export default compose(withStyles(styles))(RoomLocationComponent);
