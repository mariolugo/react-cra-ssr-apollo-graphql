import React, { Component } from "react";
import Page from "../../components/page";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";
import { setCurrentUser } from "../../../modules/auth";
import { Query, compose, graphql } from "react-apollo";
import gql from 'graphql-tag';
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Cookies from "js-cookie";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';

export const USER_REQUESTS_QUERY = gql`
  query UserRequestsQuery($requestUser: ID, $status: Int){
    getUserRequests(requestUser: $requestUser, status: $status){
      id
      createdBy {
        id
        firstName
        lastName
      }
      requestUser
      roomId {
        id
        title
        images
      }
      status
      createdAt
      }
  }
`;

export const USER_REQUEST_SENT_QUERY = gql`
query UserRequestsQuery($createdBy: ID, $status: Int){
  getUserSentRequests(createdBy: $createdBy, status: $status){
    id
    createdBy {
      id
      firstName
      lastName
    }
    requestUser
    roomId {
      id
      title
      images
      postedBy {
        id
        firstName
        lastName
      }
    }
    status
    createdAt
    }
}
`;

export const UPDATE_REQUEST = gql`
  mutation UpdateRequest($id: ID, $status: Int){
    updateRequest(id: $id, status: $status){
      id
      createdBy {
        id
      }
      requestUser
      roomId {
        id
        title
        images
      }
      status
      createdAt
    }
  }
`;

export const CREATE_CHATROOM = gql`
  mutation CreateChatRoom($room: ID, $request: ID, $withUser: ID) {
    createChatRoom(room: $room, request: $request, withUser: $withUser) {
      id
    }
  }
`;

class RequestsComponent extends Component {

  state = {
    open: false
  }

  componentWillMount() {
    let user = Cookies.getJSON("br_user");
    this.setState({
      user
    });

    console.log(this.props);
  }

  acceptRoom = (id) => {
    const { updateRequest } = this.props;


    console.log({id});
    updateRequest({
      variables: {
        id,
        status: 3
      }
    }).then(() => {
      this.setState({
        open: true
      });
    }).catch((e) => {
      console.log(e);
    })
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { classes, history } = this.props;
    const { user } = this.state;
    const status = 1;
    return (
      <div className={classNames(classes.layout, classes.cardGrid)}>
        {/* End hero unit */}
          <Query query={USER_REQUESTS_QUERY} ssr={false} variables={{requestUser: user.id, status: 1}}>
            {({ loading, error, data, subscribeToMore }) => {
              if (loading) return null
              if (error) return <div>Error</div>

              const linksToRender = data.getUserRequests

              console.log('recibidas', linksToRender)

              if (linksToRender.length === 0) {
                  return (
                      <Typography
                        variant="headline"
                        component="h2"
                      >
                        No hay solicitudes recibidas
                      </Typography>
                  )
              }

              return (
              <Grid container spacing={40}>
                  <Grid item xs={12} sm={12} m={12}>
                      <Typography
                        variant="headline"
                        component="h2"
                      >
                        Solicitudes pendientes
                      </Typography>
                  </Grid>
                  {linksToRender.map((request, index) => {
                      if (request.status === 1) {
                        return (<Grid item key={index} sm={6} md={4} lg={3}>
                          <Card className={classes.card}>
                            <CardMedia
                              className={classes.cardMedia}
                              image={request.roomId.images[0]}
                              title={"room title"}
                            />
                            <CardContent className={classes.cardContent}>
                              <Typography
                                gutterBottom
                                variant="headline"
                                component="h2"
                              >
                                {request.createdBy.firstName} {request.createdBy.lastName}
                              </Typography>
                              <Typography>
                                {request.createdAt}
                              </Typography>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="primary" onClick={() => history.push(`/room/${request.roomId.id}`)}>
                                Ver Perfil
                              </Button>
                              {(request.status === 1 || request.status === 2) &&
                                <Button size="small" color="primary">
                                  Rechazar
                                </Button>
                              }
                              {(request.status === 1 || request.status === 2) &&
                                <Button size="small" color="primary" onClick={() => this.acceptRoom(request.id)}>
                                  Aceptar
                                </Button>
                              }
                              {(request.status === 3) &&
                                <Button size="small" color="primary" onClick={() => null}>
                                  Aceptado
                                </Button>
                              }
                              {(request.status === 4) &&
                                <Button size="small" color="primary" onClick={() => null}>
                                  Rechazado
                                </Button>
                              }



                            </CardActions>
                          </Card>
                        </Grid>)
                      }

                  })}
              </Grid>
              );
            }}
          </Query>

          <Query query={USER_REQUEST_SENT_QUERY} ssr={false} variables={{createdBy: user.id, status: 1}}>
            {({ loading, error, data, subscribeToMore }) => {
              if (loading) return null
              if (error) return <div>Error</div>



              const linksToRender = data.getUserSentRequests;

              if (linksToRender.length === 0) {
                  return (
                      <Typography
                        variant="headline"
                        component="h2"
                      >
                        No hay solicitudes enviadas
                      </Typography>
                  )
              }

              console.log(linksToRender);
              return (
              <Grid container spacing={40}>
                  <Grid item xs={12} sm={12} m={12}>
                      <Typography
                        variant="headline"
                        component="h2"
                      >
                        Enviadas
                      </Typography>
                  </Grid>
                  {linksToRender.map((request, index) => (

                      <Grid item key={index} sm={6} md={4} lg={3} onClick={() => history.push(`/room/${request.roomId.id}`)}>
                        <Card className={classes.card}>
                          <CardMedia
                            className={classes.cardMedia}
                            image={request.roomId.images[0]}
                            title={"room title"}
                          />
                          <CardContent className={classes.cardContent}>
                            <Typography
                              gutterBottom
                              variant="headline"
                              component="h2"
                            >
                              {request.roomId.title}
                            </Typography>
                            <Typography>
                              {request.createdAt}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                  ))}
              </Grid>
              );
            }}
          </Query>
          <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Chat creado</span>}
        />
      </div>
    );
  }
}

const styles = theme => ({
  appBar: {
    position: "relative"
  },
  icon: {
    marginRight: theme.spacing.unit * 2
  },
  heroUnit: {
    backgroundColor: theme.palette.background.paper
  },
  heroContent: {
    maxWidth: 600,
    margin: "0 auto",
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  heroButtons: {
    marginTop: theme.spacing.unit * 4
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    },
    height: '100vh'
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing.unit * 6
  }
});

export default compose(
  withStyles(styles),
  graphql(UPDATE_REQUEST, {
     name: "updateRequest"
  }),
  graphql(CREATE_CHATROOM, {
     name: "createChatRoom"
  }),
)(RequestsComponent);
