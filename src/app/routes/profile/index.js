import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { frontloadConnect } from 'react-frontload';
import Page from '../../components/page';
import { Mutation, compose, graphql } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import PhoneIcon from '@material-ui/icons/Phone';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import FeedbackIcon from '@material-ui/icons/Feedback'
import ChatIcon from '@material-ui/icons/Chat';
import SettingsIcon from '@material-ui/icons/Settings'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Cookies from 'js-cookie';
import AppBar from '@material-ui/core/AppBar';
import Badge from '@material-ui/core/Badge';
import logo from '../../assets/logo.jpg';
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Chip from '@material-ui/core/Chip';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FacebookLoginComponent from '../login/FacebookLoginComponent';
import { isServer } from '../../../store';
import querystring from 'querystring';

import {
  getCurrentProfile,
  removeCurrentProfile
} from '../../../modules/profile';

const FACEBOOK_CONNECT = gql`
  mutation FacebookConnect($code: String!) {
    facebookConnect(code: $code) {
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
`;


class Profile extends Component {
  constructor(props) {
    super(props);

    if (!isServer) {
      console.log(props);
      if (props.location.pathname === '/dashboard/facebook-callback') {
        this.code = querystring.parse(props.location.search)['?code'];
      }
    }
  }


  state = {
      user: {},
      loading: false
  }

  componentWillMount() {


    this.setState({
      loading: true
    });
     console.log(this.code);
    if (!this.code) {
      this.setState({
        loading: false
      });

      let user = Cookies.getJSON('br_user');
      this.setState({
          user,
          loading: false
      });
      return;
    }

    this.props.facebookConnect({
      variables:
        {
          code: this.code
        }
      })
      .then(response => {
        let user = response.data.facebookConnect;
        Cookies.set('br_user', user);

        this.setState({
            user,
            loading: false
        });
      }).catch(e => {
          let user = Cookies.getJSON('br_user');
          this.setState({
              user,
              loading: false
          });
      });
  }

  // componentDidMount() {
  //     this.setState({
  //         loading: false
  //     });
  // }

  componentWillUnmount() {
    this.props.removeCurrentProfile();
  }

  _calculateAge(birthday) { // birthday is a date
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  render() {
    const { loading, user } = this.state;
    const { classes, ...rest } = this.props;

    if (loading) return (<CircularProgress className={classes.progress} size={50} />);

    let image;

    let birthDayUsr;

    if (typeof user.images !== 'undefined' && Array.isArray(user.images) && user.images.length > 0){
        image = user.images[0];
    } else {
        image = logo;
    }

    if (typeof user.birthDay !== 'undefined' && user.birthDay) {
        birthDayUsr = this._calculateAge(new Date(user.birthDay));
    }

    console.log(birthDayUsr);

    return (
        <Grid container spacing={16} className={classes.marginTop15}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
                <Grid item xs={12} className={classes.paddingSides10}>
                    <Typography variant="title" gutterBottom align="left">
                      Mi perfil
                    </Typography>
                    <div>
                      <LinearProgress className={classes.marginTop15} variant="determinate" value={20} />
                      20%
                    </div>
                </Grid>
              <img
                className={classes.imgResponsive}
                src={image}
                title={"profileImage"}
                alt={"logo"}/>
              <Link to={'user/edit'} style={{display:'block', textDecoration: 'none'}}>
                <Button variant="outlined" color="primary">
                  Editar perfil
                </Button>
              </Link>
              <Grid item xs={12} className={classes.userInformation}>
                  <div className={classes.userInfoCont}>
                      <Typography variant="headline" gutterBottom align="left">
                        {user.firstName} {user.lastName}, {birthDayUsr}
                      </Typography>
                  </div>
                  <div className={classes.userInfoCont}>
                      <Typography variant="title" gutterBottom align="left">
                        {user.gender}
                      </Typography>
                      { (user.occupation && (user.occupation === 'work' || user.occupation === 'study')) &&
                          <Typography variant="title" gutterBottom align="left">
                            {user.occupation}
                          </Typography>
                      }
                      { (user.occupation && user.occupation === 'both') &&
                          <Typography variant="title" gutterBottom align="left">
                            Trabajo y Estudio
                          </Typography>
                      }

                  </div>

                  <div className={classes.userInfoCont}>
                      <Typography variant="title" gutterBottom align="left">
                        Sobre mi
                      </Typography>
                      <Typography variant="subheading" gutterBottom align="left">
                        {user.userExtra}
                      </Typography>
                  </div>

                  <div className={classes.userInfoCont}>

                      <Typography variant="title" gutterBottom align="left">
                        Idiomas
                      </Typography>
                      {(typeof user.languages !== 'undefined' && user.languages.length > 0) &&
                          <div className={classes.chips}>
                            {user.languages.map(language => (
                              <Chip
                                  key={language}
                                  label={language}
                                  color="primary"
                                  className={classes.chip} />
                            ))}
                          </div>
                      }
                  </div>

                  <div className={classes.userInfoCont}>

                      { (user.occupation && user.occupation === 'work') &&
                          <div>
                              <Typography variant="title" gutterBottom align="left">
                                Area profesional
                              </Typography>
                              <div className={classes.chips}>
                                  <Chip
                                      label={user.working}
                                      color="primary"
                                      className={classes.chip} />
                              </div>
                          </div>
                      }
                      { (user.occupation && user.occupation === 'study') &&
                          <div>
                              <Typography variant="title" gutterBottom align="left">
                                Area de estudio
                              </Typography>
                              <div className={classes.chips}>
                                  <Chip
                                      label={user.studying}
                                      color="primary"
                                      className={classes.chip} />
                              </div>
                          </div>
                      }
                      { (user.occupation && user.occupation === 'both') &&
                          <div>
                              <Typography variant="title" gutterBottom align="left">
                                Area profesional
                              </Typography>
                              <div className={classes.chips}>
                                  <Chip
                                      label={user.working}
                                      color="primary"
                                      className={classes.chip} />
                              </div>

                              <Typography variant="title" gutterBottom align="left">
                                Area de estudio
                              </Typography>
                              <div className={classes.chips}>
                                  <Chip
                                      label={user.studying}
                                      color="primary"
                                      className={classes.chip} />
                              </div>
                          </div>
                      }
                  </div>

              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
                <Grid item xs={12} className={classes.paddingSides10}>
                    <Typography style={{marginBottom: 25}} variant="title" gutterBottom align="left">
                      Verifica tu perfil
                    </Typography>

                    <Typography variant="subheading" gutterBottom align="left">
                      Email
                    </Typography>
                    <Grid container spacing={16} className={classes.marginTop15}>
                      <Grid item xs={12} sm={6} className={classes.paddingSides10}>
                        <FormControl required fullWidth>
                          <InputLabel htmlFor="firstName">Email</InputLabel>
                          <Input
                            id="firstName"
                            name="firstName"
                            autoComplete="fname"/>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button variant="contained" color="primary" className={classes.button}>
                          Enviar código
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button variant="outlined" color="primary" className={classes.button}>
                          Tengo un código
                        </Button>
                      </Grid>
                    </Grid>

                    <Divider className={classes.divider} />

                    <Typography style={{marginTop: 20}} variant="subheading" gutterBottom align="left">
                      Teléfono
                    </Typography>
                    <Grid container spacing={16} className={classes.marginTop15}>
                      <Grid item xs={12} sm={6} className={classes.paddingSides10}>
                        <FormControl required fullWidth>
                          <InputLabel htmlFor="firstName">Telefono</InputLabel>
                          <Input
                            id="firstName"
                            name="firstName"
                            autoComplete="fname"/>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button variant="contained" color="primary" className={classes.button}>
                          Enviar código
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Button variant="outlined" color="primary" className={classes.button}>
                          Tengo un código
                        </Button>
                      </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={classes.paperRight}>
                <Grid item xs={12} className={classes.paddingSides10}>
                    <Typography variant="title" gutterBottom align="left">
                      Redes sociales
                    </Typography>

                </Grid>

                { (typeof user.facebookId !== 'undefined' && user.facebookId === null) &&
                    <Grid container spacing={16} className={classes.paddingSides10} style={{marginBottom: 10}}>
                        <Grid item xs={12} >
                            <Typography variant="subheading"  align="left" >
                              Facebook
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="body1" className={classes.facebookText} gutterBottom={false} align="left">
                              Conecta tu perfil a Facebook para acceder de manera más simple y rápida.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} style={{position:'relative', left:20}}>
                            <FacebookLoginComponent pathName={'dashboard'} {...rest} />
                        </Grid>
                    </Grid>

                }

                { (typeof user.facebookId !== 'undefined' && user.facebookId !== null) &&
                    <Grid container spacing={16} className={classes.paddingSides10}>
                        <Grid item xs={12} style={{paddingLeft:10}}>
                            <Typography variant="subheading"  align="left" >
                              Facebook
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography variant="body1"
                                 gutterBottom align="left"
                                 >
                              Tu perfil de facebook está vinculado
                            </Typography>
                        </Grid>
                    </Grid>


                }

            </Paper>
            { (typeof user.userPersonality !== 'undefined' && user.userPersonality.length > 0) &&
                <Paper className={classes.paperRight}>
                    <Grid item xs={12} className={classes.paddingSides10}>
                        <Typography variant="title" gutterBottom align="left">
                          Personalidad
                        </Typography>
                        <div className={classes.chips} style={{marginBottom: 10}}>
                          { user.userPersonality.length > 0 && user.userPersonality.map((tag, index) =>  {

                            return (
                              <Chip
                                  key={index}
                                  color="primary"
                                  className={classes.chip}
                                  label={tag}
                                  color="primary" />
                            );
                         }) }
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userLifeStyle !== 'undefined' && user.userLifeStyle.length > 0) &&
                <Paper className={classes.paperRight}>
                    <Grid item xs={12} className={classes.paddingSides10}>
                        <Typography variant="title" gutterBottom align="left">
                          Estilo de vida
                        </Typography>
                        <div className={classes.chips} style={{marginBottom: 10}}>
                          { user.userLifeStyle.length > 0 && user.userLifeStyle.map((tag, index) =>  {

                            return (
                              <Chip
                                  key={index}
                                  color="primary"
                                  className={classes.chip}
                                  label={tag}
                                  color="primary" />
                            );
                         }) }
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userMusic !== 'undefined' && user.userMusic.length > 0) &&
                <Paper className={classes.paperRight}>
                    <Grid item xs={12} className={classes.paddingSides10}>
                        <Typography variant="title" gutterBottom align="left">
                          Gustos musicales
                        </Typography>
                        <div className={classes.chips} style={{marginBottom: 10}}>
                          { user.userMusic.length > 0 && user.userMusic.map((tag, index) =>  {

                            return (
                              <Chip
                                  key={index}
                                  color="primary"
                                  className={classes.chip}
                                  label={tag}
                                  color="primary" />
                            );
                         }) }
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userSports !== 'undefined' && user.userSports.length > 0) &&
                <Paper className={classes.paperRight}>
                    <Grid item xs={12} className={classes.paddingSides10}>
                        <Typography variant="title" gutterBottom align="left">
                          Deportes
                        </Typography>
                        <div className={classes.chips} style={{marginBottom: 10}}>
                          { user.userSports.length > 0 && user.userSports.map((tag, index) =>  {

                            return (
                              <Chip
                                  key={index}
                                  color="primary"
                                  className={classes.chip}
                                  label={tag}
                                  color="primary" />
                            );
                         }) }
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userMovies !== 'undefined' && user.userMovies.length > 0) &&
                <Paper className={classes.paperRight}>
                    <Grid item xs={12} className={classes.paddingSides10}>
                        <Typography variant="title" gutterBottom align="left">
                          Películas
                        </Typography>
                        <div className={classes.chips} style={{marginBottom: 10}}>
                          { user.userMovies.length > 0 && user.userMovies.map((tag, index) =>  {

                            return (
                              <Chip
                                  key={index}
                                  color="primary"
                                  className={classes.chip}
                                  label={tag}
                                  color="primary" />
                            );
                         }) }
                        </div>
                    </Grid>
                </Paper>
            }

          </Grid>
        </Grid>

    );
  }
}

const mapStateToProps = state => ({
  currentProfile: state.profile.currentProfile
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ getCurrentProfile, removeCurrentProfile }, dispatch);

const styles = theme => ({
   root: {
    flexGrow: 1,
    width: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
   },
   container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridGap: `${theme.spacing.unit * 3}px`,
   },
   paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing.unit,
    paddingTop: 15,
    paddingBottom: 20
   },
   facebookText: {
       position: 'relative',
       top: 10
   },
   paperRight: {
       textAlign: 'center',
       color: theme.palette.text.secondary,
       whiteSpace: 'nowrap',
       marginBottom: theme.spacing.unit,
       paddingTop: 15,
       paddingBottom: 5,
       marginTop: 20
   },
   paddingSides10:{
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10
   },
   userInformation: {
       paddingLeft: 20,
       paddingRight: 20,
       marginTop:20
   },
   paddingTop5:{
      paddingTop: 5
   },
   divider: {
    margin: `${theme.spacing.unit * 2}px 0`,
   },
   padding: {
   padding: `0 ${theme.spacing.unit * 2}px`,
   },
   imgResponsive:{
    margin: '0 auto',
    width: '100%',
    marginTop: 15,
    marginBottom: 15,
    height:270
   },
   marginTop15:{
    marginTop: 15
   },
   layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 20,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
   },
   chips: {
       display: 'flex',
       flexWrap: 'wrap',
     },
     chip: {
       margin: 5
     },
     userInfoCont: {
         marginTop: 15
     }
});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps
),
withStyles(styles),
graphql(FACEBOOK_CONNECT, {
    name: 'facebookConnect'
}))(Profile);
