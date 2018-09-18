import React, { Component } from "react";
import Page from "../../components/page";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import classNames from "classnames";
import { setCurrentUser } from "../../../modules/auth";
import { Query, compose } from "react-apollo";
import gql from 'graphql-tag';
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const cards = [1, 2, 3, 4];
export const FEED_QUERY = gql`
  {
    feed {
      rooms {
        id
        images
        title
        price
        postedBy {
          firstName
          images
          birthDay
        }
      }
    }
  }
`;


class HomePage extends Component {
  render() {
    const { classes, history } = this.props;
    return (
      <Page id="homepage">
        <main>
          {/* Hero unit */}
          <div className={classes.heroUnit}>
            <div className={classes.heroContent}>
              <Typography
                variant="display3"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Roomies layout
              </Typography>
              <Typography
                variant="title"
                align="center"
                color="textSecondary"
                paragraph
              >
                Something short and leading about the collection below—its
                contents, the creator, etc. Make it short and sweet, but not too
                short so folks don&apos;t simply skip over it entirely.
              </Typography>
              <div className={classes.heroButtons}>
                <Grid container spacing={16} justify="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => history.push("/list")}
                    >
                      Publicar Piso
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary">
                      Buscar Piso
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
          <div className={classNames(classes.layout, classes.cardGrid)}>
            {/* End hero unit */}
              <Query query={FEED_QUERY} ssr={false}>
                {({ loading, error, data, subscribeToMore }) => {
                  if (loading) return null
                  if (error) return <div>Error</div>

                  const linksToRender = data.feed.rooms
                  console.log(linksToRender);

                  return (
                  <Grid container spacing={40}>
                      {linksToRender.map((room, index) => (
                          <Grid item key={index} sm={6} md={4} lg={3} onClick={() => history.push(`/room/${room.id}`)}>
                            <Card className={classes.card}>
                              <CardMedia
                                className={classes.cardMedia}
                                image={room.images[0]}
                                title={"room title"}
                              />
                              <CardContent className={classes.cardContent}>
                                <Typography
                                  gutterBottom
                                  variant="headline"
                                  component="h2"
                                >
                                  {room.postedBy.firstName}
                                </Typography>
                                <Typography>
                                  {room.title}
                                </Typography>
                              </CardContent>
                              <CardActions>
                                <Button size="small" color="primary" onClick={() => history.push(`/room/${room.id}`)}>
                                  View
                                </Button>
                              </CardActions>
                            </Card>
                          </Grid>
                      ))}
                  </Grid>
                  );
                }}
              </Query>
          </div>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="title" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subheading"
            align="center"
            color="textSecondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
        </footer>
        {/* End footer */}
      </Page>
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
    }
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

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCurrentUser }, dispatch);

export default compose(
  connect(
    null,
    mapDispatchToProps
  ),
  withStyles(styles)
)(HomePage);
