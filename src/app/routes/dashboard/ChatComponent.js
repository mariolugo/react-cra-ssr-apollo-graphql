import React, { Component } from "react";
import Page from "../../components/page";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";
import { setCurrentUser } from "../../../modules/auth";
import { Query, compose, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Cookies from "js-cookie";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import TextField from "@material-ui/core/TextField";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import "./chat.css";

export const USER_REQUESTS_QUERY = gql`
  query UserRequestsQuery($requestUser: ID, $status: Int) {
    getUserRequests(requestUser: $requestUser, status: $status) {
      id
      createdBy {
        id
        firstName
        lastName
        images
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
          images
        }
      }
      status
      createdAt
    }
  }
`;

export const USER_REQUEST_SENT_QUERY = gql`
  query UserRequestsQuery($createdBy: ID, $status: Int) {
    getUserSentRequests(createdBy: $createdBy, status: $status) {
      id
      createdBy {
        id
        firstName
        lastName
        images
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
          images
        }
      }
      status
      createdAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query GetMessages($chat: ID) {
    getMessages(chat: $chat) {
      id
      message
      author {
        id
        firstName
        lastName
      }
    }
  }
`;

export const CHAT_SEND_MESSAGE = gql`
  mutation CreateMessage($chat: ID, $message: String) {
    createMessage(chat: $chat, message: $message) {
      id
      message
      author {
        id
        firstName
        lastName
      }
    }
  }
`;

const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      node {
        id
        message
        author {
            id
            firstName
            lastName
        }
      }
    }
  }
`

class ChatComponent extends Component {
  state = {
    open: false,
    chatSelected: null,
    loadingChat: false,
    message: ""
  };

  componentWillMount() {
    let user = Cookies.getJSON("br_user");
    this.setState({
      user
    });
  }

  acceptRoom() {
    this.setState({
      open: true
    });
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  _selectChat = chatId => {
    console.log(chatId);
    this.setState({
      chatSelected: chatId
    });
  };

  _confirm = async data => {
    console.log("dataa", data);
    this.setState({
        message: ""
    })
  };

  _subscribeToNewMessages = subscribeToMore => {
    subscribeToMore({
      document: NEW_MESSAGES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        console.log('subscriptionData',subscriptionData);

        const newMessage = subscriptionData.data.newMessage.node;

        return Object.assign({}, prev,  {
            getMessages:  [ ...prev.getMessages, newMessage]
          });
      }
    });
  };

  render() {
    const { classes, history } = this.props;
    const { user, chatSelected, message } = this.state;
    console.log(user);
    const status = 1;
    return (
      <div className={classNames(classes.layout, classes.cardGrid)}>
        {/* End hero unit */}
        <Grid container spacing={0}>
          <Grid item xs={3}>
            <Query
              query={USER_REQUESTS_QUERY}
              ssr={false}
              variables={{ requestUser: user.id, status: 3 }}
            >
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return null;
                if (error) return <div>Error</div>;

                console.log("data1", data);

                const linksToRender = data.getUserRequests;

                console.log("recibidas", linksToRender);

                if (linksToRender.length === 0) {
                  return (
                    <Typography variant="headline" component="h2">
                      No hay solicitudes recibidas
                    </Typography>
                  );
                }

                return (
                  <Grid container spacing={40}>
                    <List>
                      {linksToRender.map((request, index) => {
                        request;
                        if (request.status === 3) {
                          return (
                            <ListItem
                              key={index}
                              onClick={() => this._selectChat(request.id)}
                            >
                              <Avatar>
                                <img
                                  className={classes.imgResponsive}
                                  src={request.createdBy.images[0]}
                                  title={"profileImage"}
                                  alt={"logo"}
                                />
                              </Avatar>
                              <ListItemText
                                primary={`${request.createdBy.firstName} ${
                                  request.createdBy.lastName
                                }`}
                                secondary={request.createdAt}
                              />
                            </ListItem>
                          );
                        }
                      })}
                    </List>
                  </Grid>
                );
              }}
            </Query>
            <Query
              query={USER_REQUEST_SENT_QUERY}
              ssr={false}
              variables={{ createdBy: user.id, status: 3 }}
            >
              {({ loading, error, data, subscribeToMore }) => {
                if (loading) return null;
                if (error) return <div>Error</div>;

                console.log("data2", data);

                const linksToRender = data.getUserSentRequests;

                console.log("recibidas", linksToRender);

                if (linksToRender.length === 0) {
                  return (
                    <Typography variant="headline" component="h2">
                      No hay solicitudes recibidas
                    </Typography>
                  );
                }

                return (
                  <Grid container spacing={40}>
                    <List>
                      {linksToRender.map((request, index) => {
                        request;
                        if (request.status === 3) {
                          return (
                            <ListItem
                              key={index}
                              onClick={() => this._selectChat(request.id)}
                            >
                              <Avatar>
                                <img
                                  className={classes.imgResponsive}
                                  src={request.roomId.postedBy.images[0]}
                                  title={"profileImage"}
                                  alt={"logo"}
                                />
                              </Avatar>
                              <ListItemText
                                primary={`${
                                  request.roomId.postedBy.firstName
                                } ${request.roomId.postedBy.lastName}`}
                                secondary={request.createdAt}
                              />
                            </ListItem>
                          );
                        }
                      })}
                    </List>
                  </Grid>
                );
              }}
            </Query>
          </Grid>
          <Grid item xs={9}>
            {chatSelected === null && <div>selecciona un chat</div>}
            {chatSelected !== null && (
            <div>
                <div className="chat">
                    <Query
                      query={GET_MESSAGES}
                      ssr={false}
                      variables={{ chat: chatSelected }}
                    >
                      {({ loading, error, data, subscribeToMore }) => {
                        if (loading) return null;
                        if (error) return <div>Error</div>;

                        console.log("data2", data);

                        this._subscribeToNewMessages(subscribeToMore);

                        let messagesToRender = data.getMessages;

                        console.log("mensajes", messagesToRender);

                        messagesToRender = messagesToRender.filter((item, index, self) =>
                            index === self.findIndex((t) =>
                                t.id === item.id
                            )
                        )

                        if (messagesToRender.length === 0) {
                          return (
                            <Typography variant="headline" component="h2">
                              No hay mensajes
                            </Typography>
                          );
                        }

                        return (
                            <ul
                              style={{
                                padding: 20
                              }}
                              className="discussion"
                            >
                            {
                                messagesToRender.map((msg, index) => {
                                  if (msg.author.id !== user.id) {
                                      return (
                                        <div
                                          key={index}
                                          className={classNames("bubble", "recipient")}
                                        >
                                          {msg.message}
                                        </div>
                                      );
                                  }
                                  return (
                                    <li
                                      key={index}
                                      className={classNames("bubble", "sender")}
                                    >
                                      {msg.message}
                                    </li>
                                  );
                                })
                            }
                            </ul>
                        )

                      }}
                    </Query>

                </div>
                <div className="inputChat">
                  <TextField
                    id="standard-full-width"
                    label="Label"
                    style={{ margin: 8 }}
                    placeholder="Placeholder"
                    helperText="Full width!"
                    fullWidth
                    value={message}
                    onChange={e => this.setState({ message: e.target.value })}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />

                  <Mutation
                    mutation={CHAT_SEND_MESSAGE}
                    variables={{ message, chat: chatSelected }}
                    onCompleted={data => this._confirm(data)}
                  >
                    {(mutation, { loading, error }) => {
                      return (
                        <Button
                          type="button"
                          fullWidth
                          variant="raised"
                          color="primary"
                          className={classes.submit}
                          onClick={mutation}
                        >
                          Enviar
                        </Button>
                      );
                    }}
                  </Mutation>
                </div>
            </div>
            )}
          </Grid>
        </Grid>

        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center"
          }}
          open={this.state.open}
          autoHideDuration={6000}
          onClose={this.handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
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
    backgroundColor: "white",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    },
    height: "100vh"
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

export default compose(withStyles(styles))(ChatComponent);
