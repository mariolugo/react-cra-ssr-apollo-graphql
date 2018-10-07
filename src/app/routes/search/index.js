import React, { Component } from "react";
import { compose, withApollo } from "react-apollo";
import gql from "graphql-tag";
import Page from "../../components/page";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import { isServer } from "../../../store";
import GoogleMapsComponent from "../list-room/GoogleMapsComponent";
import "./search.css";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Marker } from "react-google-maps";
import MarkerWithLabel from "react-google-maps/lib/components/addons/MarkerWithLabel";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import FilterBar from "./FilterBar";

const FEED_QUERY = gql`
  query FeedSearchQuery(
    $latLng: String!
    $radius: String
    $orderBy: RoomOrderByInput
    $maxPrice: Int
    $amenities: Json
    $bed: String
  ) {
    feed(
      latLng: $latLng
      radius: $radius
      orderBy: $orderBy
      maxPrice: $maxPrice
      amenities: $amenities
      bed: $bed
    ) {
      rooms {
        id
        title
        latLng
        price
        images
        bed
        amenities
        postedBy {
          id
          firstName
          birthDay
          images
        }
      }
    }
  }
`;

class Search extends Component {
  state = {
    links: [],
    filter: "",
    country: "",
    city: "",
    rooms: [],
    latLngCity: {},
    loading: true,
    openDialog: false,
    drag: false,
    componentReady: false,
    orderBy: "",
    price: "",
    bed: "",
    amenities: []
  };

  _timeout;

  _executeSearch = async (order, price, bed, amenities) => {
    function getBoundsRadius(bounds) {
      // r = radius of the earth in km
      var r = 6378.8;
      // degrees to radians (divide by 57.2958)
      var ne_lat = bounds.getNorthEast().lat() / 57.2958;
      var ne_lng = bounds.getNorthEast().lng() / 57.2958;
      var c_lat = bounds.getCenter().lat() / 57.2958;
      var c_lng = bounds.getCenter().lng() / 57.2958;
      // distance = circle radius from center to Northeast corner of bounds
      var r_km =
        r *
        Math.acos(
          Math.sin(c_lat) * Math.sin(ne_lat) +
            Math.cos(c_lat) * Math.cos(ne_lat) * Math.cos(ne_lng - c_lng)
        );
      return r_km * 1000 * 1.609344; // radius in meters
    }
    let bounds = this.state.map.getBounds();
    let miles = getBoundsRadius(bounds);

    const { filter, orderBy } = this.state;

    let orderByQuery = order;

    if (orderByQuery === "") {
      orderByQuery = "createdAt_DESC";
    }

    if (price === "") {
      price = undefined;
    }

    console.log("max price:", price);

    const result = await this.props.client.query({
      query: FEED_QUERY,
      variables: {
        latLng: JSON.stringify(this.state.latLngCity),
        radius: miles,
        orderBy: orderByQuery,
        maxPrice: price,
        amenities: amenities,
        bed: bed
      }
    });

    const rooms = result.data.feed.rooms;
    this.setState({
      rooms,
      loading: false
    });
  };

  componentDidMount() {
    if (!isServer) {
      document.body.classList.add("full-height");
    }
    this.setState({
      loading: false
    });
  }

  componentWillUnmount() {
    if (!isServer) {
      document.body.classList.remove("full-height");
    }
  }

  handleCitySelect = address => {
    geocodeByAddress(address)
      .then(results => {
        this.setState({
          country: results[0].address_components[3].short_name
        });
        return getLatLng(results[0]);
      })
      .then(latLng => {
        this.setState({
          city: address,
          latLngCity: latLng
        });
        this.state.map.panTo(latLng);

        this._executeSearch(
          this.state.orderBy,
          this.state.price,
          this.state.bed,
          this.state.amenities
        );
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
    this.handleCitySelect("Barcelona, España");
  };

  onDragStart = () => {
    this.setState({
      drag: true
    });
  };

  onDragEnd = () => {
    this.setState({
      drag: false,
      loading: true,
      componentReady: true
    });
    this._executeSearch(
        this.state.orderBy,
        this.state.price,
        this.state.bed,
        this.state.amenities
    );
  };

  handleOpenDialog = () => {
    this.setState({
      openDialog: true
    });
  };

  handleOrderBy = event => {
    this.setState({
      loading: true,
      orderBy: event.target.value
    });
    this._executeSearch(event.target.value, this.state.price, this.state.bed, this.state.amenities);
    console.log("orderBy", event.target.value);
  };

  handleAcceptDialog = () => {
    this.setState({
      loading: true,
      openDialog: false
    });
    this._executeSearch(this.state.orderBy, this.state.price, this.state.bed, this.state.amenities);
  };

  handleDialogClose = () => {
    this.setState({ openDialog: false });
  };

  handleBed = event => {
    this.setState({
      bed: event.target.value
    });

    console.log("bed", event.target.value);
  };

  handleDeleteFilters = () => {
      console.log('filtess');
      this.setState({
          bed: '',
          amenities: [],
          openDialog: false,
          loading: true
      });

      setTimeout(() => {
        this._executeSearch(this.state.orderBy, this.state.price, this.state.bed, this.state.amenities);
    }, 500);


  }

  handleAmenities = (id) => {
      let amenity= id;
      console.log('amenity',amenity);
    // this.setState({
    //   loading: true,
    //   amenities: event.target.value
    // });
    //
    //
    const {amenities} = this.state;
    if (amenities.indexOf(amenity) > -1) {
      amenities.splice(amenities.indexOf(amenity), 1);
      this.setState({
        amenities
      });
    } else {
      amenities.push(amenity);
      this.setState({
        amenities
      });
    }

    console.log('amenities',this.state.amenities);
    // this._executeSearch(event.target.value, this.state.price);
  };

  handleMaxPrice = event => {
    let maxPrice = event.target.value;
    this.setState({
      price: maxPrice
    });

    clearTimeout(this._timeout);
    this._timeout = setTimeout(() => {
      this.setState({
        loading: true
      });
      console.log("max price:", maxPrice);
      this._executeSearch(this.state.orderBy, maxPrice, this.state.bed, this.state.amenities);
    }, 800);
  };

  render() {
    const { classes, history } = this.props;
    const {
      loading,
      componentReady,
      map,
      city,
      orderBy,
      price,
      bed,
      amenities,
      openDialog
    } = this.state;
    const mapOptions = [
      {
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [
          {
            color: "#f7f1df"
          }
        ]
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [
          {
            color: "#d0e3b4"
          }
        ]
      },
      {
        featureType: "landscape.natural.terrain",
        elementType: "geometry",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.business",
        elementType: "all",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "poi.medical",
        elementType: "geometry",
        stylers: [
          {
            color: "#fbd3da"
          }
        ]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
          {
            color: "#bde6ab"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [
          {
            visibility: "off"
          }
        ]
      },
      {
        featureType: "road",
        elementType: "labels",
        stylers: [
          {
            visibility: "on"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffe15f"
          }
        ]
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [
          {
            color: "#efd151"
          }
        ]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#ffffff"
          }
        ]
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "black"
          }
        ]
      },
      {
        featureType: "transit.station.airport",
        elementType: "geometry.fill",
        stylers: [
          {
            color: "#cfb2db"
          }
        ]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [
          {
            color: "#a2daf2"
          }
        ]
      }
    ];
    return (
      <Page id="room" title="Search" styles={{ backgroundColor: "#fff" }}>
        <FilterBar
          handleCitySelect={this.handleCitySelect}
          handleCityChange={this.handleCityChange}
          handleOrderBy={this.handleOrderBy}
          handleMaxPrice={this.handleMaxPrice}
          handleBed={this.handleBed}
          handleAmenities={this.handleAmenities}
          handleDialogClose={this.handleDialogClose}
          handleAcceptDialog={this.handleAcceptDialog}
          handleOpenDialog={this.handleOpenDialog}
          handleDeleteFilters={this.handleDeleteFilters}
          openDialog={openDialog}
          bed={bed}
          amenities={amenities}
          orderBy={orderBy}
          city={city}
          price={price}
          props={this.props}
        />
        <Grid className={classes.layout} container spacing={0}>
          {/*ROOMS*/}
          <Grid item xs={12} sm={5}>
            {loading && (
              <CircularProgress
                style={{
                  marginTop: 20
                }}
              />
            )}
            {!loading &&
              this.state.rooms.length === 0 && (
                <p
                  style={{
                    marginTop: 20
                  }}
                >
                  No hay por esta zona
                </p>
              )}
            {!loading && (
              <Grid container spacing={16} className={classes.roomContainer}>
                {this.state.rooms.length > 0 &&
                  this.state.rooms.map((room, index) => {
                    return (
                      <Grid
                        key={index}
                        item
                        xs={12}
                        sm={6}
                        className={classes.roomItem}
                      >
                        <div
                          id={"rooms-container"}
                          style={{
                            background: `url(${room.images[0]}) no-repeat`,
                            height: 150,
                            backgroundSize: "contain",
                            width: "100%"
                          }}
                          onClick={() => history.push(`/room/${room.id}`)}
                        >
                          <Typography
                            variant="title"
                            gutterBottom
                            className={classes.label}
                          >
                            {room.title}
                          </Typography>
                          <Typography
                            variant="subheading"
                            gutterBottom
                            className={classes.label}
                          >
                            {room.price}
                          </Typography>
                        </div>
                      </Grid>
                    );
                  })}
              </Grid>
            )}
          </Grid>
          {/*MAP*/}
          <Grid item xs={12} sm={7}>
            <div style={{ height: "calc(100vh - 128px)", width: "100%" }}>
              <GoogleMapsComponent
                zoom={15}
                onDragStart={this.onDragStart}
                defaultOptions={{ styles: mapOptions }}
                onMapMounted={this.onMapMounted}
                onDragEnd={this.onDragEnd}
                onIdle={() => {
                  let state = this.state;
                  state.latLngCity = {
                    lat: this.state.map.getCenter().lat(),
                    lng: this.state.map.getCenter().lng()
                  };
                  this.setState({
                    ...state
                  });
                }}
                defaultCenter={{ lat: 19.364473, lng: -99.176253 }}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100%` }} />}
                mapElement={<div style={{ height: `100%` }} />}
              >
                {this.state.rooms.length > 0 &&
                  this.state.rooms.map((room, index) => (
                    <MarkerWithLabel
                      key={index}
                      position={room.latLng}
                      labelAnchor={{ lat: 0, lng: 0 }}
                      labelStyle={{
                        backgroundColor: "white",
                        borderRadius: "50px",
                        fontSize: "12px",
                        padding: "10px 20px",
                        color: "red"
                      }}
                    >
                      <div>{room.price}</div>
                    </MarkerWithLabel>
                  ))}
              </GoogleMapsComponent>
            </div>
          </Grid>
        </Grid>
      </Page>
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
  roomContainer: {
    overflow: "scroll",
    padding: "10px 10px 0 10px",
    height: "100%"
  },
  textPrice: {
    textAlign: "left",
    display: "block"
  },
  roomInfo: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20
  },
  roomItem: {
    maxHeight: 167,
    border: "1px solid black"
  },
  userInfo: {
    backgroundColor: "#fff",
    marginTop: 20
  },
  userDetails: {
    padding: 15
  },
  iconBox: {
    marginTop: 12
  },
  iconImg: {
    float: "left"
  },
  iconTitle: {
    position: "relative",
    top: 11,
    textAlign: "left",
    float: "left",
    left: 16
  },
  imgProfile: {
    width: "100%",
    height: 270
  },
  textPriceBills: {
    display: "inline-block",
    marginLeft: 10
  },
  textTitle: {
    textAlign: "left"
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit,
    paddingTop: 15,
    paddingBottom: 20
  },
  room: {
    backgroundColor: "#fff"
  },
  facebookText: {
    position: "relative",
    top: 10
  },
  paperRight: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit,
    paddingTop: 15,
    paddingBottom: 5,
    marginTop: 20
  },
  paddingSides10: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10
  },
  userInformation: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20
  },
  paddingTop5: {
    paddingTop: 5
  },
  divider: {
    margin: `30px 0`
  },
  padding: {
    padding: `0 ${theme.spacing.unit * 2}px`
  },
  imgResponsive: {
    margin: "0 auto",
    width: "100%",
    height: 500
  },
  marginTop15: {
    marginTop: 15
  },
  label: {
    color: "#fff"
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 20,
    height: "calc(100vh - 30px)",
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: "100%",
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 5
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
  drawerContainer: {
    padding: 15,
    backgroundColor: "#F5F5F5"
  },
  drawerContainer2: {
    backgroundColor: "#F5F5F5",
    overflow: "scroll",
    height: "calc(100% - 173px)"
  },
  textDrawer: {
    paddingLeft: 15
  },
  textSubDrawer: {
    paddingLeft: 15,
    marginBottom: 20
  }
});

export default compose(
  withStyles(styles),
  withApollo
)(Search);
