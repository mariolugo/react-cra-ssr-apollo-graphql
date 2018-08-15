import React, { Component } from 'react';

class FacebookLoginComponent extends Component {
  constructor(props) {
    super(props);
    this.onFacebookLogin = this.onFacebookLogin.bind(this);

    this.appId = '1748924262089537';
    this.redirectUrl = `${document.location.protocol}//${document.location.host}/login/facebook-callback`;

  }

  onFacebookLogin(event) {
    event.preventDefault();
    window.location = `https://www.facebook.com/v2.9/dialog/oauth?client_id=${this.appId}&redirect_uri=${encodeURIComponent(this.redirectUrl)}`;
  }

  render() {
    return (
      <a onClick={this.onFacebookLogin}>Facebook Login </a>
    );
  }
}

export default FacebookLoginComponent;
