import React from 'react';
import { connect } from 'react-redux';
import Page from '../../components/page';
import { Mutation, compose, graphql } from 'react-apollo'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './edit-profile.css';

class UserEdit extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
    parentWidth: 0
  };

  parentWidth = React.createRef();

  componentWillMount() {
    document.body.classList.add('full-height');
  }

  componentDidMount() {
    this.setState({
      parentWidth: this.parentWidth.current.offsetWidth
    });
  }

  componentWillUnmount() {
    document.body.classList.remove('full-height');
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render(){
    const { classes } = this.props;
    const { parentWidth } = this.state;
    return (
      <Page id="userEdit" title="User Edit">
        <div className={classes.layout}>
          <Grid container spacing={16} className={classes.marginTop15}>
            <Grid item xs={6} className={classes.leftContainer}>
              <Typography variant="display1" gutterBottom className={classes.text}>
                Edición de perfil
              </Typography>
              <div className={classes.formGroup} ref={this.parentWidth}>
                {/*NAMES*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      ¿Cómo te llamas?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="firstName"
                      name="firstName"
                      placeholder="Placeholder"
                      label="First name"
                      fullWidth
                      autoComplete="fname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      placeholder="Placeholder"
                      label="Last name"
                      fullWidth
                      autoComplete="lname"
                    />
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
                    <TextField
                      required
                      id="firstName"
                      name="firstName"
                      placeholder="Placeholder"
                      label="First name"
                      fullWidth
                      autoComplete="fname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      placeholder="Placeholder"
                      label="Last name"
                      fullWidth
                      autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      required
                      id="lastName"
                      name="lastName"
                      placeholder="Placeholder"
                      label="Last name"
                      fullWidth
                      autoComplete="lname"
                    />
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
                      className={classes.group}
                      value={'male'}
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
                      aria-label="Gender"
                      name="gender1"
                      className={classes.groupOccupation}
                      value={'male'}
                      row
                    >
                      <FormControlLabel value="female" control={<Radio />} label="Estudio" />
                      <FormControlLabel value="male" control={<Radio />} label="Trabajo" />
                      <FormControlLabel value="male" control={<Radio />} label="Trabajo y estudio" />
                    </RadioGroup>
                  </Grid>
                </Grid>
                {/*STUDY*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      ¿Que estudias?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Select
                      fullWidth
                      value={10}
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                {/*WORK*/}
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
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
                  </Grid>
                </Grid>
                {/*LANGUAGE*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography variant="title" gutterBottom className={classes.label}>
                      ¿Que idioma hablas?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Select
                      fullWidth
                      value={10}
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                    >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
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
                    <Select
                      value={10}
                      fullWidth
                      inputProps={{
                        name: 'age',
                        id: 'age-native-simple',
                      }}
                    >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                    </Select>
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
                      label="With placeholder multiline"
                      placeholder="Placeholder"
                      multiline
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </div>
              <div className={classes.actionButtons} style={{width: parentWidth}}>
                <Grid container spacing={16} className={classes.marginTop15}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth>
                      Cancelar
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      color="primary"
                      variant="raised"
                      fullWidth>
                      Guardar
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6} className={classes.rightContainer}>
              <Paper className={classes.paper}>

              </Paper>
            </Grid>
          </Grid>
        </div>
        <Drawer anchor="left" open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
            style={{width:400}}
          >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              <CloseIcon />
            </IconButton>
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
    paddingTop: 15,
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
  }
});

export default compose(
  withStyles(styles)
)(UserEdit);
