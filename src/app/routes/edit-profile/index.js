import React from 'react';
import { connect } from 'react-redux';
import Page from '../../components/page';
import { Mutation, compose, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './edit-profile.css';
import Cookies from 'js-cookie';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import days from './datesUtil';
import jobsUtl from './workUtil';
import studiesUtil from './studiesUtil';
import languagesUtil from './languagesUtil';
import Chip from '@material-ui/core/Chip';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import StarRateIcon from '@material-ui/icons/StarRate';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FaceIcon from '@material-ui/icons/Face';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import HeadsetIcon from '@material-ui/icons/Headset';
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter';
import MovieFilterIcon from '@material-ui/icons/MovieFilter';
import AddIcon from '@material-ui/icons/Add';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import userTagsUtil from './userTagsUtil';
import ReactDropzone from 'react-dropzone';
import {Image, Video, Transformation, CloudinaryContext} from 'cloudinary-react';
import request from 'superagent';
import { isServer } from '../../../store';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const CLOUDINARY_UPLOAD_PRESET = 'pizwwixc';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/roomies-ic/upload';
const CLOUDINARY_DELETE_URL = 'https://api.cloudinary.com/v1_1/roomies-ic/delete_by_token'


const EDIT_USER_MUTATION = gql`
  mutation EditUserMutation($firstName: String!, $lastName: String!, $gender: String, $occupation: String, $studying: String, $birthDay: DateTime, $working: String, $languages: [String!], $userPersonality: [String!], $userLifeStyle: [String!], $userMusic: [String!], $userSports: [String!], $userMovies: [String!], $userExtra: String, $images: [String!]) {
    editUser(firstName: $firstName, lastName: $lastName, gender: $gender, occupation: $occupation, studying: $studying, birthDay: $birthDay, working: $working, languages: $languages, userPersonality: $userPersonality, userLifeStyle: $userLifeStyle, userMusic: $userMusic, userSports: $userSports, userMovies: $userMovies, userExtra: $userExtra, images: $images) {
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const SortableItem = SortableElement(({value, sortIndex, onRemove, classes,imgLoading }) =>
  <Grid item xs={4} className={classes.imageGrid}>
    <div
      tabIndex={0}
      role="button"
      className={classes.imageButton}
      onClick={() => {
           console.log('aaa');
            onRemove(sortIndex)
        }}
    >
       <Button variant="fab" mini color="secondary" aria-label="Delete" className={classes.button} >
         <CloseIcon />
       </Button>
    </div>
    {sortIndex === 0 &&
        <div className={classes.starDiv}>
          <StarRateIcon style={{color:'white'}} />
        </div>
    }
    <img
      alt="Preview"
      src={value}
      className={classes.images}
    />
  </Grid>
);

const SortableList = SortableContainer(({items, onRemove, classes}) => {
   return (
    <Grid container spacing={24}>
       {items.map((image, index) => (
         <SortableItem key={`item-${index}`} index={index} value={image} sortIndex={index} onRemove={onRemove} classes={classes} />
       ))}
     </Grid>

 );
});



class UserEdit extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
    parentWidth: 0,
    firstName: '',
    lastName: '',
    gender: '',
    occupation: '',
    studying: '',
    working: '',
    birthDay: '',
    languages: [],
    userPersonality: [],
    userLifeStyle: [],
    userMusic: [],
    userSports: [],
    userMovies: [],
    userExtra: '',
    images: [],
    dates: {},
    jobs: [],
    studies: [],
    languagesArr: [],
    selectedDrawerTab: 'personality',
    userTags: {},
    files: [],
    imgLoading: false,
    dayBirth: '',
    monthBirth: '',
    yearBirth: ''
  };


  parentWidth = React.createRef();

  componentWillMount() {
    if (!isServer){
      document.body.classList.add('full-height');
    }

    let user = Cookies.getJSON('br_user');

    this.setState({
      ...user
    });
  }

  componentDidMount() {
    this.setState({
      parentWidth: this.parentWidth.current.offsetWidth,
      dates: days,
      jobs: jobsUtl,
      studies: studiesUtil,
      languagesArr: languagesUtil,
      userTags: userTagsUtil
    });

    if(!this.state.languages){
      this.setState({
        languages: []
      });
    }

    if (!this.state.userPersonality){
      this.setState({
        userPersonality: []
      });
    }

    if (!this.state.userLifeStyle){
      this.setState({
        userLifeStyle: []
      });
    }

    if (!this.state.userMusic){
      this.setState({
        userMusic: []
      });
    }

    if (!this.state.userSports){
      this.setState({
        userSports: []
      });
    }

    if (!this.state.userMovies){
      this.setState({
        userMovies: []
      });
    }

    if (!this.state.images){
      this.setState({
        images: []
      });
    }

    if (this.state.birthDay) {
      let date = new Date(this.state.birthDay);

      this.setState({
        dayBirth: date.getUTCDate().toString(),
        monthBirth: this.numToMonth(date.getUTCMonth()),
        yearBirth: date.getUTCFullYear().toString()
      });
    }
  }

  componentWillUnmount() {
    if (!isServer){
      document.body.classList.remove('full-height');
    }

  }

  _confirm = async data => {
    Cookies.set('br_user',data.editUser);
    this.props.history.push('/dashboard')
  }

  toggleDrawer = (side, open, tab) => () => {
    this.setState({
      [side]: open,
    });

    if (typeof tab !== 'undefined') {
      this.setState({
        selectedDrawerTab: tab
      });
    }
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState({
      images: arrayMove(this.state.images, oldIndex, newIndex),
    });
    console.log(this.state.images, oldIndex, newIndex);
  };

  monthToNumb = (mth) => {
      const months = [
        'january', 'february', 'march', 'april', 'may',
        'june', 'july', 'august', 'september',
        'october', 'november', 'december'
      ];
      let month = months.indexOf(mth);
      return month ? month + 1 : 0;
  };

  numToMonth = (num) => {
    const months = [
      'january', 'february', 'march', 'april', 'may',
      'june', 'july', 'august', 'september',
      'october', 'november', 'december'
    ];
    console.log('aaaa',months[num-1]);
    return months[num-1];
  };

  _handleDrawerTab = panel => (event, expanded) => {
    this.setState({
      selectedDrawerTab: expanded ? panel : false,
    });
  };

  _onError = error => {
    console.log({error});
  }

  handleImageUpload = (file) => {
      console.log({file});
    let upload = request.post(CLOUDINARY_UPLOAD_URL)
                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                        .field('file', file);

    upload.end((err, response) => {
      if (err) {
        console.error(err);
      }

      if (response.body.secure_url !== '') {

          this.setState({
            images: this.state.images.concat(response.body.secure_url),
          });

          console.log(this.state.images);
      }
    });
  }

  onPreviewDrop = (files) => {
      this.setState({
          imgLoading: true
      });
      let length = this.state.images.length + files.length;
      if (length <= 6){
          files.map( file => {
              this.handleImageUpload(file)
          });
      }
      this.setState({
          imgLoading: false
      });
  }

  removeImageIndex = (index) => {
      if (this.state.images.length > 0){
          let files = this.state.images;
          files.splice(index,1)
          this.setState({
              images: files
          });
      }

  }

  render(){
    const { classes } = this.props;
    const { parentWidth, firstName, lastName, gender, occupation, studying, working, languages, userPersonality, userLifeStyle, userMusic, userSports, userMovies, userExtra, images, birthDay, dates, jobs, studies, languagesArr, selectedDrawerTab, userTags, id, dayBirth, monthBirth, yearBirth } = this.state;

    console.log(dayBirth, monthBirth, yearBirth)



    let finalDate = new Date(yearBirth, this.monthToNumb(monthBirth) -1, dayBirth);

    let dropzoneRef;

    return (
      <Page id="userEdit" title="User Edit" styles={{backgroundColor: '#fff', paddingTop: 20}} >
        <div className={classes.layout}>
          <Grid container spacing={16} className={classes.marginTop15}>
            <Grid item xs={6} className={classes.leftContainer}>
              <Typography variant="display1" gutterBottom className={classes.text}>
                Edición de perfil
              </Typography>
              <form className={classes.formGroup} ref={this.parentWidth}>
                {/*NAMES*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      ¿Cómo te llamas?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl margin="normal" fullWidth>
                      <InputLabel htmlFor="firstName">First Name</InputLabel>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={firstName}
                        onChange={e =>
                          this.setState({ firstName: e.target.value })
                        }
                        autoComplete="fname"/>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl margin="normal" fullWidth>
                      <InputLabel htmlFor="lastName">Last Name</InputLabel>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={lastName}
                        onChange={e =>
                          this.setState({ lastName: e.target.value })
                        }
                        autoComplete="fname"/>
                    </FormControl>
                  </Grid>
                </Grid>
                {/*DATES*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      Fecha de nacimiento
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl margin="normal" fullWidth>
                      <InputLabel shrink htmlFor="age-label-placeholder">
                        Día
                      </InputLabel>
                      <Select
                        fullWidth
                        placeholder="Día"
                        label="Día"
                        onChange={e =>
                          this.setState({ dayBirth: e.target.value })
                        }
                        value={dayBirth}
                      >
                        { (dates.hasOwnProperty('days') && dates.days.length > 0) && dates.days.map((day,index) => {
                          return (<MenuItem value={day} key={index}>{day}</MenuItem>)
                        }) }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl margin="normal" fullWidth>
                      <InputLabel shrink htmlFor="age-label-placeholder">
                        Mes
                      </InputLabel>
                      <Select
                        fullWidth
                        placeholder="Mes"
                        label="Mes"
                        onChange={e =>
                          this.setState({ monthBirth: e.target.value })
                        }
                        value={monthBirth}
                      >
                        { (dates.hasOwnProperty('months') && dates.months.length > 0) && dates.months.map((month,index) => {
                          return (<MenuItem value={month} key={index}>{month}</MenuItem>)
                        }) }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <FormControl margin="normal" fullWidth>
                      <InputLabel shrink htmlFor="age-label-placeholder">
                        Año
                      </InputLabel>
                      <Select
                        fullWidth
                        placeholder="Año"
                        label="Año"
                        onChange={e =>
                          this.setState({ yearBirth: e.target.value })
                        }
                        value={yearBirth}
                      >
                        { (dates.hasOwnProperty('years') && dates.years.length > 0) && dates.years.map((year,index) => {
                          return (<MenuItem value={year} key={index}>{year}</MenuItem>)
                        }) }
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                {/*GENDER*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      Escoge tu género
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <RadioGroup
                      aria-label="Gender"
                      name="gender1"
                      value={gender}
                      className={classes.group}
                      onChange={e =>
                        this.setState({ gender: e.target.value })
                      }
                      row
                    >
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                    </RadioGroup>
                  </Grid>
                </Grid>
                {/*OCCUPATION*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      ¿A qué te dedicas?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <RadioGroup
                      aria-label="Occupation"
                      name="occupation"
                      className={classes.groupOccupation}
                      value={occupation}
                      onChange={e =>
                        this.setState({ occupation: e.target.value })
                      }
                      row
                    >
                      <FormControlLabel value="study" control={<Radio />} label="Estudio" />
                      <FormControlLabel value="work" control={<Radio />} label="Trabajo" />
                      <FormControlLabel value="both" control={<Radio />} label="Trabajo y estudio" />
                    </RadioGroup>
                  </Grid>
                </Grid>
                {/*STUDY*/}
                { (occupation === 'study' || occupation === 'both') &&
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                      <Typography variant="title" gutterBottom className={classes.label}>
                        ¿Que estudias?
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Select
                        fullWidth
                        value={studying}
                        inputProps={{
                          name: 'age',
                          id: 'age-native-simple',
                        }}
                        onChange={e =>
                          this.setState({ studying: e.target.value })
                        }
                      >
                        { studies.length > 0 && studies.map((study,index) => {
                          return (<MenuItem value={study} key={index}>{study}</MenuItem>)
                        }) }
                      </Select>
                    </Grid>
                  </Grid>
                }
                {/*WORK*/}
                { (occupation === 'work' || occupation === 'both') &&
                  <Grid container spacing={24}>
                    <Grid item xs={12} sm={12}>
                      <Typography variant="title" gutterBottom className={classes.label}>
                        ¿En que trabajas?
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <Select
                        value={10}
                        fullWidth
                        value={working}
                        onChange={e =>
                          this.setState({
                            working: e.target.value
                          })
                        }
                        inputProps={{
                          name: 'age',
                          id: 'age-native-simple',
                        }}
                      >
                        { jobs.length > 0 && jobs.map((job,index) => {
                          return (<MenuItem value={job} key={index}>{job}</MenuItem>)
                        }) }
                      </Select>
                    </Grid>
                  </Grid>
                }
                {/*LANGUAGE*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      ¿Que idioma hablas?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Select
                      multiple
                      fullWidth
                      value={languages}
                      input={<Input id="select-multiple-chip" />}
                      MenuProps={MenuProps}
                      onChange={e =>
                        this.setState({ languages: e.target.value })
                      }
                      renderValue={selected => (
                        <div className={classes.chips}>
                          {selected.map(value => (
                            <Chip key={value} label={value} className={classes.chip} />
                          ))}
                        </div>
                      )}
                    >

                      { (languages && languagesArr.length > 0) && languagesArr.map((language,index) => (
                        (
                          <MenuItem key={language} value={language}>
                            <Checkbox checked={languages.indexOf(language) > -1} />
                            <ListItemText primary={language} />
                          </MenuItem>
                        )
                      )) }
                    </Select>
                  </Grid>
                </Grid>
                {/*MORE*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      Acerca de ti
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <List style={{padding:0}}>
                      <ListItem  style={{paddingRight:0, paddingLeft: 0}}>
                        <Avatar>
                          <FaceIcon />
                        </Avatar>
                        <ListItemText primary="¿Cómo eres?" />
                        <div className={classes.drawerHeader} onClick={this.toggleDrawer('left',true,'personality')}>
                          <IconButton onClick={this.handleDrawerClose}>
                            <AddCircleIcon />
                          </IconButton>
                        </div>

                      </ListItem>
                      <div className={classes.chips} style={{marginBottom: 10}}>
                        { (userPersonality && userPersonality.length > 0) && userPersonality.map((tag, index) =>  {

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
                      <Divider />
                      <ListItem style={{paddingRight:0, paddingLeft: 0}}>
                        <Avatar>
                          <BeachAccessIcon />
                        </Avatar>
                        <ListItemText primary="¿Cúal es tu estilo de vida?" />
                        <div className={classes.drawerHeader} onClick={this.toggleDrawer('left',true,'lifestyle')}>
                          <IconButton onClick={this.handleDrawerClose}>
                            <AddCircleIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                      <div className={classes.chips} style={{marginBottom: 10}}>
                        { (userLifeStyle && userLifeStyle.length > 0) && userLifeStyle.map((tag, index) =>  {

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
                      <Divider />
                      <ListItem style={{paddingRight:0, paddingLeft: 0}}>
                        <Avatar>
                          <HeadsetIcon />
                        </Avatar>
                        <ListItemText primary="¿Qué música escuchas?" />
                        <div className={classes.drawerHeader} onClick={this.toggleDrawer('left',true,'music')}>
                          <IconButton onClick={this.handleDrawerClose}>
                            <AddCircleIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                      <div className={classes.chips} style={{marginBottom: 10}}>
                        { (userMusic && userMusic.length > 0) && userMusic.map((tag, index) =>  {

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
                      <Divider />
                      <ListItem style={{paddingRight:0, paddingLeft: 0}}>
                        <Avatar>
                          <FitnessCenterIcon />
                        </Avatar>
                        <ListItemText primary="¿Que deporte practicas?" />
                        <div className={classes.drawerHeader} onClick={this.toggleDrawer('left',true,'sports')}>
                          <IconButton onClick={this.handleDrawerClose}>
                            <AddCircleIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                      <div className={classes.chips} style={{marginBottom: 10}}>
                        { (userSports && userSports.length > 0) && userSports.map((tag, index) =>  {

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
                      <Divider />
                      <ListItem style={{paddingRight:0, paddingLeft: 0}}>
                        <Avatar>
                          <MovieFilterIcon />
                        </Avatar>
                        <ListItemText primary="¿Que tipo de películas te gustan?" />
                        <div className={classes.drawerHeader} onClick={this.toggleDrawer('left',true,'movies')}>
                          <IconButton onClick={this.handleDrawerClose}>
                            <AddCircleIcon />
                          </IconButton>
                        </div>
                      </ListItem>
                      <div className={classes.chips} style={{marginBottom: 10}}>
                        { (userMovies && userMovies.length > 0) && userMovies.map((tag, index) =>  {

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
                      <Divider />
                    </List>
                  </Grid>
                </Grid>
                {/*EXTRA*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      Información adicional
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="textarea"
                      placeholder="Información adicional"
                      rows={5}
                      multiline
                      value={userExtra}
                      onChange={e =>
                        this.setState({ userExtra: e.target.value })
                      }
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </form>
              <div className={classes.actionButtons} style={{width: parentWidth}}>
                <Grid container spacing={16} className={classes.marginTop15}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={() => {
                          this.props.history.push('/dashboard')
                      }}>
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Mutation
                      mutation={EDIT_USER_MUTATION}
                      variables={{firstName, lastName, gender, occupation, studying, working, languages, userPersonality, userLifeStyle, userMusic, userSports, userMovies, userExtra, images, birthDay: finalDate}}
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
                            Guardar
                          </Button>
                        );
                      }}
                    </Mutation>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6} className={classes.rightContainer}>
              <Paper className={classes.paper}>
                <ReactDropzone
                  accept="image/*"
                  onDrop={this.onPreviewDrop}
                  style={{width:'100%', height: '100%'}}
                  ref={(node) => { dropzoneRef = node; }}
                  disableClick
                >
                    {images && images.length === 0 &&
                        <Typography variant="title" gutterBottom className={classes.text}>
                          Arrastra fotos aquí
                        </Typography>
                    }
                    {(images && images.length > 0) &&
                        <Grid container spacing={16} >
                            <Grid item xs={12}>
                                <Typography variant="title" gutterBottom className={classes.textInline} style={{float:'left'}} >
                                  Añade fotos
                                </Typography>
                                <Typography variant="body1" gutterBottom align="right" style={{float:'right'}} className={classes.textInline}>
                                    {images && images.length}/6
                                </Typography>
                            </Grid>

                            <SortableList items={images} onSortEnd={this.onSortEnd} onRemove={(index) => this.removeImageIndex(index)} imgLoading={this.state.imgLoading} classes={classes} axis={'xy'}/>


                        </Grid>

                    }
                </ReactDropzone>

              </Paper>
            </Grid>
          </Grid>
        </div>
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
                      color="primary"
                      onClick={this.toggleDrawer('left', false)}
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
      </Page>
    );
  }
};

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
  formGroup: {
  },
  leftContainer: {
    overflow:'scroll',
    marginBottom: 150,
    paddingRight: '50px !important'
  },
  rightContainer: {
    height: '100%',
  },
  actionButtons: {
    position: 'fixed',
    bottom: 0,
    backgroundColor: '#fff',
    height: 80,
    borderTop: '1px solid #d5d5d5',
  },
  imageButton: {
    position: 'absolute',
    right: 19,
    top: 14
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
  drawerContainer: {
    padding: 15,
    backgroundColor: '#F5F5F5'
  },
  drawerContainer2: {
    backgroundColor: '#F5F5F5',
    overflow: 'scroll',
    height: 'calc(100% - 173px)'
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
  text: {
    textAlign: 'left',
    color: 'black'
  },
  textInline: {
      display:'inline-block',
      color: 'black'
  },
  textDrawer: {
    paddingLeft: 15
  },
  textSubDrawer: {
    paddingLeft: 15,
    marginBottom: 20
  },
  label: {
    textAlign: 'left',
    paddingBottom: 0,
    marginTop: 20,
    marginBottom: -10
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
    marginBottom: theme.spacing.unit,
    padding: 15,
    backgroundColor: '#F5F5F5',
    height: 'calc(100vh - 180px)'
  },
  paddingSides10:{
    paddingLeft: 10,
    paddingRight: 10
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
    marginBottom: 15
  },
  marginTop15:{
    marginTop: 15
  },
  layout: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 30,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    flex: 1,
    boxSizing: 'border-box',
    borderBottom: 'none',
    margin: 15,
    height: 'calc(100vh - 30px)',
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: 'auto',
    width: 200,
  },
  groupOccupation: {
    margin: 'auto',
    width: 400,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 5
  },
  starDiv: {
    position: 'absolute',
    bottom: 8,
    backgroundColor: 'blue',
    left: 10,
    width: 31,
    height: 31,
  }
});

export default compose(
  withStyles(styles)
)(UserEdit);
