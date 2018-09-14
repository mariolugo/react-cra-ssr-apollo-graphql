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
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import userTagsUtil from '../edit-profile/userTagsUtil';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import HeadsetIcon from '@material-ui/icons/Headset';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import Snackbar from '@material-ui/core/Snackbar';

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

const UPDATE_TAGS = gql`
  mutation EditUserTags($userPersonality: [String!], $userLifeStyle: [String!], $userMusic: [String!], $userSports: [String!], $userMovies: [String!]) {
    editUserTags(userPersonality: $userPersonality, userLifeStyle: $userLifeStyle, userMusic: $userMusic, userSports: $userSports, userMovies: $userMovies) {
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
      loading: false,
      left: false,
      selectedDrawerTab: 'personality',
      userTags: {},
      totalDone: 0
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

  componentDidMount() {


      this.setState({
        userTags: userTagsUtil
      });

      this._updatePercentage();
  }

  componentWillUnmount() {
    this.props.removeCurrentProfile();
  }

  _editUserTags(prop) {
    console.log({prop})
    this.setState({prop});
    const { editUserTags } = this.props;
    const { userPersonality, userLifeStyle, userMusic, userSports, userMovies } = this.state.user;
    editUserTags({
      userPersonality, userLifeStyle, userMusic, userSports, userMovies
    })
    .then((response) => {
      console.log('response',response);
      Cookies.set('br_user',prop);
      this._updatePercentage();
      this._showToast('Gustos actualizados');
    }).catch(e => {
      console.log({e});
      this._showToast('Error');
    });

  }

  _updatePercentage(){
    const { user} = this.state;
    const { userPersonality, userLifeStyle, userMusic, userSports, userMovies, images, languages } = user;

    let total = 0;

    if (user.facebookId){
      total += 100;
    }

    if (user.isVerified){
      total += 100;
    }

    if (languages && languages.length > 0){
      total += 100
    }

    if (userPersonality && userPersonality.length > 0 ){
      total += 100;
    }

    if (userLifeStyle && userLifeStyle.length > 0 ){
      total += 100;
    }

    if (userMusic && userMusic.length > 0 ){
      total += 100;
    }

    if (userSports && userSports.length > 0 ){
      total += 100;
    }

    if (userMovies && userMovies.length > 0 ){
      total += 100;
    }

    if (images && images.length > 0){
      total += 100;
    }

    this.setState({
      totalDone: total/9
    })
  }

  _calculateAge(birthday) { // birthday is a date
    let ageDifMs = Date.now() - birthday.getTime();
    let ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  _handleDrawerTab = panel => (event, expanded) => {
    this.setState({
      selectedDrawerTab: expanded ? panel : false,
    });
  };

  toggleDrawer = (side, open, tab) => () => {
     this.setState({
       [side]: open,
     });

     console.log(open);

     if (!open){
      this._editUserTags({...this.state.user});
     }

     if (typeof tab !== 'undefined') {
       this.setState({
         selectedDrawerTab: tab
       });
     }
  };

  _showToast(message) {
    this.setState({
      openToast: true,
      toastMessage: message
    })
  }

  _closeToast = () => {
    this.setState({ openToast: false });
  };

  render() {
    const { loading, user, selectedDrawerTab, userTags, openToast, toastMessage, totalDone } = this.state;
    const { classes, ...rest } = this.props;
    const { userPersonality, userLifeStyle, userMusic, userSports, userMovies } = user;

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
                      <LinearProgress className={classes.marginTop15} variant="determinate" value={totalDone} />
                      {totalDone.toFixed(0)}%
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
                      {(typeof user.languages !== 'undefined' && Array.isArray(user.languages) && user.languages.length > 0) &&
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

            { (typeof user.images !== 'undefined' && Array.isArray(user.images) && user.images.length > 0) &&
                <Paper className={classes.paperRight}>
                    <Grid item xs={12} className={classes.paddingSides10}>
                        <Typography variant="title" gutterBottom align="left">
                          Imágenes
                        </Typography>
                        <Grid container spacing={24} style={{paddingTop: 20, paddingBottom: 20}}>
                          { user.images.length > 0 && user.images.map((image, index) =>  {

                            return (
                              <Grid item key={index} xs={4} className={classes.imageGrid}>
                                <img
                                  alt="Preview"
                                  src={image}
                                  className={classes.images}
                                />
                              </Grid>
                            );
                         }) }
                       </Grid>
                    </Grid>
                </Paper>
            }

            { (typeof user.userPersonality !== 'undefined' && Array.isArray(user.userPersonality) && user.userPersonality.length > 0) &&
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
                                  onDelete={() => {
                                    let idx = userPersonality.indexOf(tag);
                                    userPersonality.splice(idx,1);
                                    let prop = {...user};
                                    prop.userPersonality;

                                    this._editUserTags(prop);

                                  }}
                                  color="primary" />
                            );
                         }) }
                         <Chip
                            color="secondary"
                            className={classes.chip}
                            label={'Agregar'}
                            deleteIcon={<AddIcon />}
                            onDelete={this.toggleDrawer('left',true,'personality')}/>
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userLifeStyle !== 'undefined' && Array.isArray(user.userLifeStyle) && user.userLifeStyle.length > 0) &&
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
                                  onDelete={() => {
                                    let idx = userLifeStyle.indexOf(tag);
                                    userLifeStyle.splice(idx,1);
                                    let prop = {...user};
                                    prop.userLifeStyle;

                                    this._editUserTags(prop);

                                  }}
                                  color="primary" />
                            );
                         }) }
                         <Chip
                            color="secondary"
                            className={classes.chip}
                            label={'Agregar'}
                            deleteIcon={<AddIcon />}
                            onDelete={this.toggleDrawer('left',true,'lifestyle')}/>
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userMusic !== 'undefined' && Array.isArray(user.userMusic) && user.userMusic.length > 0) &&
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
                                  onDelete={() => {
                                    let idx = userMusic.indexOf(tag);
                                    userMusic.splice(idx,1);
                                    let prop = {...user};
                                    prop.userMusic;

                                    this._editUserTags(prop);

                                  }}
                                  color="primary" />
                            );
                         }) }
                         <Chip
                            color="secondary"
                            className={classes.chip}
                            label={'Agregar'}
                            deleteIcon={<AddIcon />}
                            onDelete={this.toggleDrawer('left',true,'music')}/>
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userSports !== 'undefined' && Array.isArray(user.userSports) && user.userSports.length > 0) &&
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
                                  onDelete={() => {
                                    let idx = userSports.indexOf(tag);
                                    userSports.splice(idx,1);
                                    let prop = {...user};
                                    prop.userSports;

                                    this._editUserTags(prop);

                                  }}
                                  color="primary" />
                            );
                         }) }
                         <Chip
                            color="secondary"
                            className={classes.chip}
                            label={'Agregar'}
                            deleteIcon={<AddIcon />}
                            onDelete={this.toggleDrawer('left',true,'sports')}/>
                        </div>
                    </Grid>
                </Paper>
            }
            { (typeof user.userMovies !== 'undefined' && Array.isArray(user.userMovies) && user.userMovies.length > 0) &&
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
                                  onDelete={() => {
                                    let idx = userMovies.indexOf(tag);
                                    userMovies.splice(idx,1);
                                    let prop = {...user};
                                    prop.userMovies;

                                    this._editUserTags(prop);

                                  }}
                                  color="primary" />
                            );
                         }) }
                         <Chip
                            color="secondary"
                            className={classes.chip}
                            label={'Agregar'}
                            deleteIcon={<AddIcon />}
                            onDelete={this.toggleDrawer('left',true,'movies')}/>
                        </div>
                    </Grid>
                </Paper>
            }

          </Grid>
          <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)} >
                <div style={{backgroundColor:'#F5F5F5', height: '100%', overflow: 'hidden'}}>
                  <div
                    tabIndex={0}
                    role="button"
                    onClick={this.toggleDrawer('left', false)}
                    onKeyDown={this.toggleDrawer('left', false)}
                    style={{width:400}}
                    className={classes.drawerContainer}
                  >
                    <div className={classes.drawerHeader}>
                      <IconButton onClick={this.handleDrawerClose}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                  </div>
                  {/*TABCONTAINER*/}
                  <div style={{width:430}} className={classes.drawerContainer2}>
                    <Typography variant="headline" gutterBottom className={classes.textDrawer}>
                      Cuéntanos más acerca de ti
                    </Typography>
                    <Typography variant="title" style={{fontWeight: 'lighter'}} gutterBottom className={classes.textSubDrawer}>
                      Elige las opciones para cada categoría
                    </Typography>
                    <ExpansionPanel className={classes.expansionPanel} expanded={selectedDrawerTab === 'personality'} onChange={this._handleDrawerTab('personality')}>
                     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                       <Avatar>
                         <FaceIcon />
                       </Avatar>
                       <Typography variant="subheading" style={{fontWeight: 'lighter'}} gutterBottom className={classes.textTabTitle}>
                         Personalidad
                       </Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails style={{display: 'block'}}>
                       { (userTags.hasOwnProperty('personality') && userTags.personality.length > 0) && userTags.personality.map((tag, index) =>  {

                         if (userPersonality && userPersonality.indexOf(tag) !== -1){
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               label={tag}
                               onDelete={() => {
                                 let idx = userPersonality.indexOf(tag);
                                 userPersonality.splice(idx,1);
                                 this.setState({
                                   userPersonality
                                 });
                               }}
                               color="primary" />
                           );
                         } else {
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               deleteIcon={<AddIcon />}
                               onClick={() =>{
                                 userPersonality.push(tag);
                                 this.setState({
                                   userPersonality
                                 });
                               }}
                               label={tag}
                               onDelete={() => {
                                 userPersonality.push(tag);
                                 this.setState({
                                   userPersonality
                                 });
                               }}
                               variant="outlined" />
                           );
                         }

                      }) }
                     </ExpansionPanelDetails>
                   </ExpansionPanel>
                   <ExpansionPanel className={classes.expansionPanel} expanded={selectedDrawerTab === 'lifestyle'} onChange={this._handleDrawerTab('lifestyle')}>
                     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                       <Avatar>
                         <BeachAccessIcon />
                       </Avatar>
                       <Typography variant="subheading" style={{fontWeight: 'lighter'}} gutterBottom className={classes.textTabTitle}>
                         Estilo de vida
                       </Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails style={{display: 'block'}}>
                       { (userTags.hasOwnProperty('lifestyle') && userTags.lifestyle.length > 0) && userTags.lifestyle.map((tag, index) =>  {

                         if (userLifeStyle && userLifeStyle.indexOf(tag) !== -1){
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               label={tag}
                               onDelete={() => {
                                 let idx = userLifeStyle.indexOf(tag);
                                 userLifeStyle.splice(idx,1);
                                 this.setState({
                                   userLifeStyle
                                 });
                               }}
                               color="primary" />
                           );
                         } else {
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               deleteIcon={<AddIcon />}
                               onClick={() =>{
                                 userLifeStyle.push(tag);
                                 this.setState({
                                   userLifeStyle
                                 });
                               }}
                               label={tag}
                               onDelete={() => {
                                 userLifeStyle.push(tag);
                                 this.setState({
                                   userLifeStyle
                                 });
                               }}
                               variant="outlined" />
                           );
                         }

                      }) }
                     </ExpansionPanelDetails>
                   </ExpansionPanel>
                   <ExpansionPanel className={classes.expansionPanel} expanded={selectedDrawerTab === 'music'} onChange={this._handleDrawerTab('music')}>
                     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                       <Avatar>
                         <HeadsetIcon />
                       </Avatar>
                       <Typography variant="subheading" style={{fontWeight: 'lighter'}} gutterBottom className={classes.textTabTitle}>
                         Música
                       </Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails style={{display: 'block'}}>
                       { (userTags.hasOwnProperty('music') && userTags.music.length > 0) && userTags.music.map((tag, index) =>  {

                         if (userMusic && userMusic.indexOf(tag) !== -1){
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               label={tag}
                               onDelete={() => {
                                 let idx = userMusic.indexOf(tag);
                                 userMusic.splice(idx,1);
                                 this.setState({
                                   userMusic
                                 });
                               }}
                               color="primary" />
                           );
                         } else {
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               deleteIcon={<AddIcon />}
                               onClick={() =>{
                                 userMusic.push(tag);
                                 this.setState({
                                   userMusic
                                 });
                               }}
                               label={tag}
                               onDelete={() => {
                                 userMusic.push(tag);
                                 this.setState({
                                   userMusic
                                 });
                               }}
                               variant="outlined" />
                           );
                         }

                      }) }
                     </ExpansionPanelDetails>
                   </ExpansionPanel>
                   <ExpansionPanel className={classes.expansionPanel} expanded={selectedDrawerTab === 'sports'} onChange={this._handleDrawerTab('sports')}>
                     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                       <Avatar>
                         <FitnessCenterIcon />
                       </Avatar>
                       <Typography variant="subheading" style={{fontWeight: 'lighter'}} gutterBottom className={classes.textTabTitle}>
                         Deportes
                       </Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails style={{display: 'block'}}>
                       { (userTags.hasOwnProperty('sports') && userTags.sports.length > 0) && userTags.sports.map((tag, index) =>  {

                         if (userSports && userSports.indexOf(tag) !== -1){
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               label={tag}
                               onDelete={() => {
                                 let idx = userSports.indexOf(tag);
                                 userSports.splice(idx,1);
                                 this.setState({
                                   userSports
                                 });
                               }}
                               color="primary" />
                           );
                         } else {
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               deleteIcon={<AddIcon />}
                               onClick={() =>{
                                 userSports.push(tag);
                                 this.setState({
                                   userSports
                                 });
                               }}
                               label={tag}
                               onDelete={() => {
                                 userSports.push(tag);
                                 this.setState({
                                   userSports
                                 });
                               }}
                               variant="outlined" />
                           );
                         }

                      }) }
                     </ExpansionPanelDetails>
                   </ExpansionPanel>
                   <ExpansionPanel className={classes.expansionPanel} expanded={selectedDrawerTab === 'movies'} onChange={this._handleDrawerTab('movies')}>
                     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                       <Avatar>
                         <MovieFilterIcon />
                       </Avatar>
                       <Typography variant="subheading" style={{fontWeight: 'lighter'}} gutterBottom className={classes.textTabTitle}>
                         Tipos de películas
                       </Typography>
                     </ExpansionPanelSummary>
                     <ExpansionPanelDetails style={{display: 'block'}}>
                       { (userTags.hasOwnProperty('movies') && userTags.movies.length > 0) && userTags.movies.map((tag, index) =>  {

                         if (userMovies && userMovies.indexOf(tag) !== -1){
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               label={tag}
                               onDelete={() => {
                                 let idx = userMovies.indexOf(tag);
                                 userMovies.splice(idx,1);
                                 this.setState({
                                   userMovies
                                 });
                               }}
                               color="primary" />
                           );
                         } else {
                           return(
                             <Chip
                               key={index}
                               color="primary"
                               className={classes.chip}
                               deleteIcon={<AddIcon />}
                               onClick={() =>{
                                 userMovies.push(tag);
                                 this.setState({
                                   userMovies
                                 });
                               }}
                               label={tag}
                               onDelete={() => {
                                 userMovies.push(tag);
                                 this.setState({
                                   userMovies
                                 });
                               }}
                               variant="outlined" />
                           );
                         }

                      }) }
                     </ExpansionPanelDetails>
                   </ExpansionPanel>
                  </div>
                  <div style={{width:430}}>
                    <div className={classes.actionButtons} style={{width: 410, paddingLeft: 11, paddingRight:11}}>
                      <Grid container spacing={16} className={classes.marginTop15}>
                        <Grid item xs={12}>
                          <Button
                            type="button"
                            fullWidth
                            variant="raised"
                            onClick={this.toggleDrawer('left', false)}
                            color="primary"
                            className={classes.submit}
                          >
                            Guardar
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  </div>
                </div>

              </Drawer>
              <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={openToast}
                onClose={this._closeToast}
                autoHideDuration={1500}
                ContentProps={{
                  'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{toastMessage}</span>}
              />
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
     },
     imgResponsive:{
       margin: '0 auto',
       width: '100%',
       marginTop: 15,
       marginBottom: 15
     },
     imageGrid: {
       display: 'flex',
       position: 'relative'
     },
     images:{
       width: 140,
       display: 'block',
       height: 140,
       margin: '0 auto'
     },
     expansionPanel: {
        width: 430
      },
      textTabTitle:{
         paddingLeft: 15,
         marginTop: 10
       },
       drawerHeader: {
         display: 'flex',
         alignItems: 'center',
         justifyContent: 'flex-end',
         padding: '0 8px',
         ...theme.mixins.toolbar,
       },
       drawerContainer: {
          padding: 15,
          backgroundColor: '#F5F5F5'
        },
        drawerContainer2: {
          backgroundColor: '#F5F5F5',
          overflow: 'scroll',
          height: 'calc(100% - 173px)',
        },
        textDrawer: {
           paddingLeft: 15
         },
         textSubDrawer: {
           paddingLeft: 15,
           marginBottom: 20
         },
});

export default compose(connect(
  mapStateToProps,
  mapDispatchToProps
),
withStyles(styles),
graphql(FACEBOOK_CONNECT, {
    name: 'facebookConnect'
}),
graphql(UPDATE_TAGS, {
  name: 'editUserTags'
}))(Profile);
