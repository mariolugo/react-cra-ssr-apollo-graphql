import React, { Component } from "react";
import { Query, compose, graphql } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import gql from "graphql-tag";
import Page from "../../components/page";
import Grid from "@material-ui/core/Grid";
import Lightbox from "react-images";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import GoogleMapsComponent from "../list-room/GoogleMapsComponent";
import { Circle } from "react-google-maps";
import Chip from "@material-ui/core/Chip";

const GET_ROOM_QUERY = gql`
  query GetRoom($id: String!) {
    getRoom(id: $id) {
      id
      title
      description
      city
      images
      amenities
      rules
      latLng
      country
      males
      females
      bed
      fromDate
      toDate
      minMonths
      price
      bills
      postedBy {
        firstName
        lastName
        images
        gender
        occupation
        languages
        studying
        birthDay
        working
        userPersonality
        userLifeStyle
        userMusic
        userSports
        userMovies
        userExtra
        images
        isVerified
      }
    }
  }
`;

class Room extends Component {
  state = {
    roomId: "",
    loading: true,
    lightboxIsOpen: false,
    room: {},
    currentImage: 0,
    zoom: 15,
    map: {}
  };

  componentWillMount() {
    const { match } = this.props;

    this.setState({
      roomId: match.params.id,
      loading: false
    });
  }

  closeLightbox() {
    this.setState({
      lightboxIsOpen: false
    });
  }

  gotoPrevious() {
    this.setState({
      currentImage: this.state.currentImage - 1
    });
  }
  gotoNext() {
    this.setState({
      currentImage: this.state.currentImage + 1
    });
  }

  handleClickImage(images) {
    if (this.state.currentImage === images - 1) return;

    this.openLightBox();
  }

  openLightBox() {
    this.setState({
      lightboxIsOpen: true,
      currentImage: this.state.currentImage
    });
  }

  onMapMounted = ref => {
    this.setState({
      map: ref
    });
  };

  _calculateAge(birthday) {
    // birthday is a date
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  render() {
    const { roomId, loading, lightboxIsOpen, currentImage, zoom } = this.state;
    const { classes } = this.props;
    if (loading) return <p>cargando pagina</p>;

    const mapOptions = {
      disableDefaultUI: true
    };

    const circleOptions = {
      radius: 200,
      fillColor: "#AA0000",
      strokeColor: "transparent"
    };

    return (
      <Page
        id="room"
        title="Room"
        styles={{ backgroundColor: "#fff", paddingTop: 20 }}
      >
        {}
        <Query query={GET_ROOM_QUERY} variables={{ id: roomId }}>
          {({ loading, error, data }) => {
            if (loading) return <p>cargando</p>;
            if (error) return <div>Error</div>;

            const room = data.getRoom;

            const { images } = room;
            const user = room.postedBy;
            let lightBoxImgs = [];

            images.map(image => {
              lightBoxImgs.push({
                src: image
              });
            });

            let birthDayUsr;

            if (typeof user.birthDay !== "undefined" && user.birthDay) {
              birthDayUsr = this._calculateAge(new Date(user.birthDay));
            }

            return (
              <div className={classes.room}>
                {/*ROOM HEADER*/}
                <img
                  className={classes.imgResponsive}
                  onClick={() => this.handleClickImage(images.length)}
                  src={images[0]}
                  title={"profileImage"}
                  alt={"logo"}
                />
                {/*ROOM TITLE*/}
                <div style={{ width: "100%", backgroundColor: "white" }}>
                  <div className={classes.layout}>
                    <Grid container spacing={16}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="title"
                          gutterBottom
                          className={classes.textPrice}
                        >
                          €{room.price}
                          {room.bills && (
                            <Typography
                              variant="body1"
                              gutterBottom
                              className={classes.textPriceBills}
                            >
                              Incluye servicios
                            </Typography>
                          )}
                          {!room.bills && (
                            <Typography
                              variant="body1"
                              gutterBottom
                              className={classes.textPriceBills}
                            >
                              No incluye servicios
                            </Typography>
                          )}
                        </Typography>
                        <Typography
                          variant="title"
                          gutterBottom
                          className={classes.textTitle}
                        >
                          {room.title}
                          <Typography
                            variant="body1"
                            gutterBottom
                            className={classes.textPriceBills}
                          >
                            Creado ayer
                          </Typography>
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="outlined"
                          color="primary"
                          className={classes.button}
                        >
                          Send request
                        </Button>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <div style={{ width: "100%", backgroundColor: "#f7f7f7" }}>
                  <div className={classes.layout}>
                    <Grid container spacing={16}>
                      {/*ROOM INFO*/}
                      <Grid item xs={12} sm={8}>
                        <div className={classes.roomInfo}>
                          <Typography variant="title" gutterBottom align="left">
                            Descripción
                          </Typography>
                          <Typography variant="body1" gutterBottom align="left">
                            {room.description}
                          </Typography>

                          <Divider className={classes.divider} />

                          <Typography variant="title" gutterBottom align="left">
                            Compañeros de piso
                          </Typography>
                          <Typography variant="body1" gutterBottom align="left">
                            Mujeres: {!room.females && <span>0</span>}{" "}
                            {room.females && <span>{room.females}</span>}
                          </Typography>
                          <Typography variant="body1" gutterBottom align="left">
                            Hombres: {!room.males && <span>0</span>}{" "}
                            {room.males && <span>{room.males}</span>}
                          </Typography>

                          <Divider className={classes.divider} />

                          <Typography variant="title" gutterBottom align="left">
                            Tipo de cama
                          </Typography>
                          <Typography variant="body1" gutterBottom align="left">
                            {room.bed}
                          </Typography>

                          <Divider className={classes.divider} />

                          <Typography variant="title" gutterBottom align="left">
                            Comodidades
                          </Typography>
                          <Grid
                            container
                            spacing={16}
                            className={classes.iconBox}
                          >
                            {room.amenities.length > 0 &&
                              room.amenities.map((amenity, index) => (
                                <Grid
                                  item
                                  xs={4}
                                  sm={4}
                                  key={index}
                                  className={classes.checkboxGrid}
                                >
                                  <img
                                    alt="Icon"
                                    className={classes.iconImg}
                                    src={require(`../../assets/icons/icono_${amenity}.png`)}
                                  />
                                  <span className={classes.iconTitle}>
                                    {amenity}
                                  </span>
                                </Grid>
                              ))}
                          </Grid>

                          <Divider className={classes.divider} />

                          <Typography variant="title" gutterBottom align="left">
                            Reglas
                          </Typography>
                          <Grid
                            container
                            spacing={16}
                            className={classes.iconBox}
                          >
                            {room.rules.length > 0 &&
                              room.rules.map((rule, index) => (
                                <Grid
                                  item
                                  xs={4}
                                  sm={4}
                                  key={index}
                                  className={classes.checkboxGrid}
                                >
                                  <img
                                    alt="Icon"
                                    className={classes.iconImg}
                                    src={require(`../../assets/icons/icono_${rule}.png`)}
                                  />
                                  <span className={classes.iconTitle}>
                                    {rule}
                                  </span>
                                </Grid>
                              ))}
                          </Grid>

                          <Divider className={classes.divider} />

                          <Typography variant="title" gutterBottom align="left">
                            Ubicación
                          </Typography>
                          <div style={{ height: 300, width: "100%" }}>
                            <GoogleMapsComponent
                              zoom={zoom}
                              defaultOptions={mapOptions}
                              onMapMounted={this.onMapMounted}
                              defaultCenter={room.latLng}
                              loadingElement={
                                <div style={{ height: `100%` }} />
                              }
                              containerElement={
                                <div style={{ height: `100%` }} />
                              }
                              mapElement={<div style={{ height: `100%` }} />}
                            >
                              <Circle
                                defaultCenter={room.latLng}
                                defaultOptions={circleOptions}
                              />
                            </GoogleMapsComponent>
                          </div>
                        </div>
                      </Grid>
                      {/*USER INFO*/}
                      <Grid item xs={12} sm={4}>
                        <div className={classes.userInfo}>
                          <img
                            className={classes.imgProfile}
                            src={user.images[0]}
                            title={"profileImage"}
                            alt={"logo"}
                          />
                          <div className={classes.userDetails}>
                            <div className={classes.userInfoCont}>
                              <Typography
                                variant="headline"
                                gutterBottom
                                align="left"
                              >
                                {user.firstName} {user.lastName}, {birthDayUsr}
                              </Typography>
                              <Typography
                                variant="title"
                                gutterBottom
                                align="left"
                              >
                                {user.gender}
                              </Typography>
                              {user.occupation &&
                                (user.occupation === "work" ||
                                  user.occupation === "study") && (
                                  <Typography
                                    variant="title"
                                    gutterBottom
                                    align="left"
                                  >
                                    {user.occupation}
                                  </Typography>
                                )}
                              {user.occupation &&
                                user.occupation === "both" && (
                                  <Typography
                                    variant="title"
                                    gutterBottom
                                    align="left"
                                  >
                                    Trabajo y Estudio
                                  </Typography>
                                )}
                              <Typography
                                variant="title"
                                gutterBottom
                                align="left"
                                style={{ marginTop: 20 }}
                              >
                                Sobre mi
                              </Typography>
                              <Typography
                                variant="subheading"
                                gutterBottom
                                align="left"
                              >
                                {user.userExtra}
                              </Typography>
                              <Typography
                                variant="title"
                                gutterBottom
                                align="left"
                                style={{ marginTop: 20 }}
                              >
                                Idiomas
                              </Typography>
                              {typeof user.languages !== "undefined" &&
                                Array.isArray(user.languages) &&
                                user.languages.length > 0 && (
                                  <Typography
                                    variant="subheading"
                                    gutterBottom
                                    align="left"
                                  >
                                    {user.languages.join(", ")}
                                  </Typography>
                                )}
                              {user.occupation &&
                                user.occupation === "work" && (
                                  <div style={{ marginTop: 20 }}>
                                    <Typography
                                      variant="title"
                                      gutterBottom
                                      align="left"
                                    >
                                      Area profesional
                                    </Typography>
                                    <Typography
                                      variant="subheading"
                                      gutterBottom
                                      align="left"
                                    >
                                      {user.working}
                                    </Typography>
                                  </div>
                                )}
                              {user.occupation &&
                                user.occupation === "study" && (
                                  <div style={{ marginTop: 20 }}>
                                    <Typography
                                      variant="title"
                                      gutterBottom
                                      align="left"
                                    >
                                      Area de estudio
                                    </Typography>
                                    <Typography
                                      variant="subheading"
                                      gutterBottom
                                      align="left"
                                    >
                                      {user.studying}
                                    </Typography>
                                  </div>
                                )}
                              {user.occupation &&
                                user.occupation === "both" && (
                                  <div style={{ marginTop: 20 }}>
                                    <Typography
                                      variant="title"
                                      gutterBottom
                                      align="left"
                                    >
                                      Area profesional
                                    </Typography>
                                    <Typography
                                      variant="subheading"
                                      gutterBottom
                                      align="left"
                                    >
                                      {user.working}
                                    </Typography>

                                    <Typography
                                      variant="title"
                                      gutterBottom
                                      align="left"
                                    >
                                      Area de estudio
                                    </Typography>
                                    <Typography
                                      variant="subheading"
                                      gutterBottom
                                      align="left"
                                    >
                                      {user.studying}
                                    </Typography>
                                  </div>
                                )}
                              <Typography variant="title" gutterBottom align="left" style={{ marginTop: 20 }}>
                                Personalidad
                              </Typography>
                              <div className={classes.chips} style={{ marginBottom: 10 }}>
                                {user.userPersonality.length > 0 &&
                                  user.userPersonality.map((tag, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        className={classes.chip}
                                        label={tag}
                                      />
                                    );
                                  })}
                              </div>
                              <Typography variant="title" gutterBottom align="left" style={{ marginTop: 20 }}>
                                Estilo de vida
                              </Typography>
                              <div className={classes.chips} style={{ marginBottom: 10 }}>
                                {user.userLifeStyle.length > 0 &&
                                  user.userLifeStyle.map((tag, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        className={classes.chip}
                                        label={tag}
                                      />
                                    );
                                  })}
                              </div>
                              <Typography variant="title" gutterBottom align="left" style={{ marginTop: 20 }}>
                                Gustos musicales
                              </Typography>
                              <div className={classes.chips} style={{ marginBottom: 10 }}>
                                {user.userMusic.length > 0 &&
                                  user.userMusic.map((tag, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        className={classes.chip}
                                        label={tag}
                                      />
                                    );
                                  })}
                              </div>
                              <Typography variant="title" gutterBottom align="left" style={{ marginTop: 20 }}>
                                Deportes
                              </Typography>
                              <div className={classes.chips} style={{ marginBottom: 10 }}>
                                {user.userSports.length > 0 &&
                                  user.userSports.map((tag, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        className={classes.chip}
                                        label={tag}
                                      />
                                    );
                                  })}
                              </div>
                              <Typography variant="title" gutterBottom align="left" style={{ marginTop: 20 }}>
                                Películas
                              </Typography>
                              <div className={classes.chips} style={{ marginBottom: 10 }}>
                                {user.userMovies.length > 0 &&
                                  user.userMovies.map((tag, index) => {
                                    return (
                                      <Chip
                                        key={index}
                                        color="primary"
                                        className={classes.chip}
                                        label={tag}
                                      />
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
                <Lightbox
                  currentImage={currentImage}
                  images={lightBoxImgs}
                  onClickNext={() => this.gotoNext()}
                  onClickPrev={() => this.gotoPrevious()}
                  isOpen={lightboxIsOpen}
                  onClose={() => this.closeLightbox()}
                />
              </div>
            );
          }}
        </Query>
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
  textPrice: {
    textAlign: "left",
    display: "block"
  },
  roomInfo: {
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20
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

export default compose(withStyles(styles))(Room);
