import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Page from '../../components/page';
import { AUTH_TOKEN } from '../../../constants.js';
import { setCurrentUser } from '../../../modules/auth';
import { Mutation, compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import cookies from 'js-cookie'
import FacebookLogin from 'react-facebook-login';
import querystring from 'querystring';
import FacebookLoginComponent from './FacebookLoginComponent';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import AlertDialogSlide from './dialogSignUp';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import './login.css';
import { isServer } from '../../../store';


const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
    signup(email: $email, password: $password, firstName: $firstName, lastName: $lastName ) {
      token
      user{
        id
        firstName
        lastName
        gender
        occupation
        studying
        birthDay
        working
        languages
        userPersonality
        userLifeStyle
        userMusic
        userSports
        userMovies
        userExtra
        images
        email
        facebookId
        isVerified
      }
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user{
          id
          firstName
          lastName
          gender
          occupation
          studying
          birthDay
          working
          languages
          userPersonality
          userLifeStyle
          userMusic
          userSports
          userMovies
          userExtra
          images
          email
          facebookId
          isVerified
      }
    }
  }
`

const FACEBOOK_LOGIN = gql`
  mutation FacebookSignIn($code: String!) {
    facebookSignIn(code: $code) {
      token
      user {
          id
          firstName
          lastName
          gender
          occupation
          studying
          birthDay
          working
          languages
          userPersonality
          userLifeStyle
          userMusic
          userSports
          userMovies
          userExtra
          images
          email
          facebookId
          isVerified
      }
    }
  }
`;

class Login extends Component {
  constructor(props) {
    super(props);

    if (!isServer) {
      if (props.location.pathname === '/login/facebook-callback') {
        this.code = querystring.parse(props.location.search)['?code'];
      }
    }



    this.state = {
      login: true, // switch between Login and SignUp
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      anchorEl: null,
      openDialog: false,
      loading: true
    };

  }

  componentWillMount() {
    this.setState({
      loading: true
    });

    if (!this.code) {
      this.setState({
        loading: false
      });
      return;
    }

    this.setState({ loading: true });
    this.props.mutate({
      variables:
        {
          code: this.code
        }
      })
      .then(response => {
        this.setState({
          loading: false
        });
        const { token, user } = response.data.facebookSignIn;
        console.log('user',user);
        this._saveUserData(token, user);
        this.props.history.push(`/`);
      }).catch(e => {
        this.setState({ loading: false });
      });
  }

  _confirm = async data => {
    const { token, user } = this.state.login ? data.login : data.signup

    console.log({user});

    if (data.hasOwnProperty('signup')) {
      console.log('suscrito');
      this.setState({
        openDialog: true,
        token,
        user
       });

    } else {
      this._saveUserData(token, user);
      this.props.history.push(`/`);
    }
  }

  _saveUserData = (token, user) => {
    cookies.set(AUTH_TOKEN, token);
    this.props.setCurrentUser(user);
  }

  _onError = error => {
    console.log({error});
  }

  _responseFacebook = (response) => {
    console.log({response});
  }

  _openDialog = () => {
    this.setState({ openDialog: true });
  };

  _closeDialog = () => {
    this.setState({ openDialog: false });
    this._saveUserData(this.state.token, this.state.user);
    this.props.history.push(`/`);
  };

  _acceptDialog = () => {
    this.setState({ openDialog: false });
    this._saveUserData(this.state.token, this.state.user);
    this.props.history.push(`/user/edit`);
  }



  render(){
    const { login, email, password, firstName, lastName, openDialog, loading } = this.state;
    const { classes, ...rest } = this.props;
    if (loading) return (<CircularProgress className={classes.progress} size={50} />);
    return (
      <Page>
          <div className={classes.layout}>
            <Paper className={classes.paper}>
              <Avatar className={classes.avatar}>
                <LockIcon />
              </Avatar>
              <Typography variant="headline">
                {login ? 'Sign in' : 'Create account'}
              </Typography>
              <form className={classes.form}>
                {!login && (
                    <div>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="firstName">First Name</InputLabel>
                          <Input id="firstName" name="firstName" onChange={e => this.setState({ firstName: e.target.value })} autoComplete="fname" autoFocus />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                          <InputLabel htmlFor="lastName">Last Name</InputLabel>
                          <Input id="lastName" name="lastName" onChange={e => this.setState({ lastName: e.target.value })} autoComplete="lname"  />
                        </FormControl>
                    </div>
                )}
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="email">Email Address</InputLabel>
                  <Input
                    id="email"
                    name="email"
                    autoComplete="email"
                    onChange={e => this.setState({ email: e.target.value })}
                    autoFocus />
                </FormControl>
                <FormControl margin="normal" required fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input
                    name="password"
                    type="password"
                    onChange={e => this.setState({ password: e.target.value })}
                    id="password"
                    autoComplete="current-password"
                  />
                </FormControl>
                <Mutation
                  mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
                  variables={{ email, password, firstName, lastName }}
                  onCompleted={data => this._confirm(data)}
                >
                  {(mutation, {loading, error}) => {
                    if (loading) return (<CircularProgress className={classes.progress} size={50} />);
                    if (error) this._onError(error);
                    return (
                      <Button
                        type="button"
                        fullWidth
                        variant="raised"
                        color="primary"
                        className={classes.submit}
                        onClick={mutation}
                      >
                        {login ? 'Sign in' : 'Create account'}
                      </Button>
                    );
                  }}
                </Mutation>

                <FacebookLoginComponent pathName={'login'} {...rest} />
                <Button
                    fullWidth
                    onClick={() => this.setState({ login: !login })}
                    className={classes.mt10}
                >
                    {login
                      ? 'need to create an account?'
                      : 'already have an account?'}
                </Button>
              </form>
            </Paper>
              <AlertDialogSlide
                handleClose={this._closeDialog}
                handleAccept={this._acceptDialog}
                open={openDialog}/>
          </div>
      </Page>
    );
  }
};

const styles = theme => ({
  progress: {
    margin: theme.spacing.unit * 2,
  },
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
  mt10: {
      marginTop:10
  }
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCurrentUser }, dispatch);

export default compose(connect(
  null,
  mapDispatchToProps
),
withStyles(styles),
graphql(FACEBOOK_LOGIN))(Login);
