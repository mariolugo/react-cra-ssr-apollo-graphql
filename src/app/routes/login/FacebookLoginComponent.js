import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { isServer } from '../../../store';

class FacebookLoginComponent extends Component {
  constructor(props) {
    super(props);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);

    this.appId = '1748924262089537';
    this.redirectUrl = `http://localhost:3000/${props.pathName}/facebook-callback`;

  }

  onFacebookLogin(event) {
    event.preventDefault();
    if (!isServer){
        window.location = `https://www.facebook.com/v2.9/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(this.redirectUrl)}`;
    }

  }

  render() {
    const { classes } = this.props;
    return (
      <Button
        fullWidth
        variant="raised"
        color="primary"
        onClick={this.onFacebookLogin}
        className={classes.submit}
      >
        Login with facebook
      </Button>
    );
  }
}

const styles = theme => ({
  submit: {
    marginTop: 5,
  }
});

export default withStyles(styles)(FacebookLoginComponent);
