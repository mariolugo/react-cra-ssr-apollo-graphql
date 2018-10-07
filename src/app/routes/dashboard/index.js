import React from "react";
import { connect } from "react-redux";
import Page from "../../components/page";
import { compose } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Divider from "@material-ui/core/Divider";
import FavoriteIcon from "@material-ui/icons/Favorite";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import FeedbackIcon from "@material-ui/icons/Feedback";
import ChatIcon from "@material-ui/icons/Chat";
import SettingsIcon from "@material-ui/icons/Settings";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import "./dashboard.css";
import Badge from "@material-ui/core/Badge";
import Profile from "../profile";

class Dashboard extends React.Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { currentUser, classes, ...rest } = this.props;
    const { value } = this.state;
    return (
      <Page
        id="dashboard"
        title="Dashboard"
        styles={{ backgroundColor: "#f7f7f7", paddingTop: 20 }}
      >
        <div className={classes.layout}>
          <div className={classes.root}>
            <Grid item xs={12}>
              <Tabs
                value={value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
              >
                <Tab
                  className={classes.paddingTop5}
                  label="Perfil"
                  icon={<PersonPinIcon />}
                />
                <Tab
                  className={classes.paddingTop5}
                  label="Favoritos"
                  icon={<FavoriteIcon />}
                />
                <Tab
                  className={classes.paddingTop5}
                  label="Solicitudes"
                  icon={
                    <Badge badgeContent={4} color="primary">
                      <FeedbackIcon />
                    </Badge>
                  }
                />
                <Tab
                  className={classes.paddingTop5}
                  label="Chats"
                  icon={
                    <Badge badgeContent={2} color="primary">
                      <ChatIcon />
                    </Badge>
                  }
                />
                <Tab
                  className={classes.paddingTop5}
                  label="Configuración"
                  icon={<SettingsIcon />}
                />
              </Tabs>
            </Grid>
          </div>

          <Profile {...rest} />
          <Divider className={classes.divider} />
        </div>
      </Page>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
});

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
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit,
    paddingTop: 15
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
    width: "auto",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 20,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 1050,
      marginLeft: "auto",
      marginRight: "auto"
    }
  }
});

export default compose(
  connect(
    mapStateToProps,
    null
  ),
  withStyles(styles)
)(Dashboard);
