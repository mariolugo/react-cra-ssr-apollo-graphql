import React from "react";
import { compose } from "react-apollo";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import { isServer } from "../../../store";
import "./list-room.css";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import amenitiesArrImg from '../../assets/amenities.png';
import AmenitiesUtil from './AmenitiesUtil';
import Rulesutil from './RulesUtil';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

class RoomDetailsComponent extends React.Component {
  state = {
    parentWidth: 0,
    activeStep: 0,
    completed: new Set(),
    amenitiesArr: [],
    rulesArr: [],
    amenities: [],
    rules: [],
    males: 0,
    females: 0,
    type: ''
  };

  parentWidth = React.createRef();

  componentWillMount() {
      const {room} = this.props;

      if (Object.keys(room).length > 0 && room.constructor === Object) {
          this.setState({
            ...room
          });
      }
  }

  componentDidMount() {
    if (!isServer) {
      document.body.classList.add("full-height");
    }
    this.setState({
      parentWidth: this.parentWidth.current.offsetWidth,
      amenitiesArr: AmenitiesUtil,
      rulesArr: Rulesutil
    });
  }

  componentWillUnmount() {
    if (!isServer) {
      document.body.classList.remove("full-height");
    }
  }

  _onError = error => {
    console.log({ error });
  };

  render() {
    const { classes, handleNextStep, handleBackStep, room} = this.props;
    const { parentWidth, amenitiesArr, rulesArr, males, females, type, amenities, rules } = this.state;

    return (
        <div className={classes.layout}>
          <Grid container spacing={16} className={classes.marginTop15}>
            <Grid item xs={6} className={classes.leftContainer}>
              <form className={classes.formGroup} ref={this.parentWidth}>
                {/*NAMES*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.label}
                    >
                      Que estás rentando?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl className={classes.formControl}>
                      <RadioGroup
                        aria-label="Room Type"
                        name="room_type"
                        value={type}
                        className={classes.group}
                        onChange={e =>
                          this.setState({ type: e.target.value })
                        }
                      >
                        <FormControlLabel value="private" control={<Radio />} label="Piso privado" />
                        <FormControlLabel value="shared" control={<Radio />} label="Piso compartido" />
                        <FormControlLabel value="complete" control={<Radio />} label="Propiedad completa" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.label}
                    >
                      Cuantos viven?
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12} style={{borderBottom: '1px solid #dedede'}}>
                    <Typography
                      variant="body1"
                      gutterBottom
                      style={{display: 'inline', float: 'left'}}
                      className={classes.label}
                    >
                      Hombres
                    </Typography>
                    <div style={{float:'right', display: 'inline-block', width: 109}}>
                      <IconButton
                        className={classes.button}
                        style={{display:'inline-block', float: 'left'}}
                        aria-label="Decrease"
                        onClick={() => {
                          if (males !== 0){
                            this.setState({
                              males: males-1
                            })
                          }
                        }}>
                        <RemoveIcon />
                      </IconButton>
                      <div
                        id='counter'
                        style={{display: 'inline-block', position: 'relative', top:12, fontSize: 19}}>{males}</div>
                      <IconButton
                        className={classes.button}
                        style={{display:'inline-block', float: 'right'}}
                        aria-label="Increase"
                        onClick={() => {
                          this.setState({
                            males: males+1
                          })
                        }}>
                        <AddIcon />
                      </IconButton>
                    </div>

                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="body1"
                      gutterBottom
                      style={{display: 'inline', float: 'left'}}
                      className={classes.label}
                    >
                      Mujeres
                    </Typography>
                    <div style={{float:'right', display: 'inline-block', width: 109}}>
                      <IconButton
                        className={classes.button}
                        style={{display:'inline-block', float: 'left'}}
                        aria-label="Decrease"
                        onClick={() => {
                          if (females !== 0){
                            this.setState({
                              females: females-1
                            })
                          }
                        }}>
                        <RemoveIcon />
                      </IconButton>
                      <div
                        id='counter'
                        style={{display: 'inline-block', position: 'relative', top:12, fontSize: 19}}>{females}</div>
                      <IconButton
                        className={classes.button}
                        style={{display:'inline-block', float: 'right'}}
                        aria-label="Increase"
                        onClick={() => {
                          this.setState({
                            females: females+1
                          })
                        }}>
                        <AddIcon />
                      </IconButton>
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.label}
                    >
                      Amenities
                    </Typography>
                  </Grid>
                  <Grid container spacing={16}>
                      {amenitiesArr.length > 0 &&
                        amenitiesArr.map((amenity,index) => (
                          <Grid item xs={3} sm={3} key={index} className={classes.checkboxGrid}>
                            <input
                              id={amenity.id}
                              type="checkbox"
                              onChange={e => {
                                if (amenities.indexOf(amenity.id) > -1){
                                  amenities.splice(amenities.indexOf(amenity.id), 1)
                                  this.setState({
                                    amenities
                                  })
                                } else {
                                  amenities.push(amenity.id)
                                  this.setState({
                                    amenities
                                  });
                                }

                              }}
                              defaultChecked={amenities.indexOf(amenity.id) >  -1}/>
                            <label
                              className={"checkbox"}
                              style={{  background: `url("${require(`../../assets/icons/${amenity.icon}`)}") no-repeat`}}
                              htmlFor={amenity.id}></label>
                            <span
                              className={classes.checkBoxLabel}
                              htmlFor={amenity.id}>{amenity.id}</span>
                          </Grid>
                        ))
                      }
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.label}
                    >
                      Rules
                    </Typography>
                  </Grid>
                  <Grid container spacing={16}>
                    {rulesArr.length > 0 &&
                      rulesArr.map((rule,index) => (
                        <Grid item xs={3} sm={3} key={index} className={classes.checkboxGrid}>
                          <input
                            id={rule.id}
                            type="checkbox"
                            onChange={e => {
                              if (rules.indexOf(rule.id) > -1){

                                this.setState({
                                  rules: rules.splice(rules.indexOf(rule.id), 1)
                                })
                              } else {
                                rules.push(rule.id)
                                this.setState({
                                  rules
                                });
                              }

                            }}
                            defaultChecked={rules.indexOf(rule.id) >  -1}/>
                          <label
                            className={"checkbox"}
                            style={{  background: `url("${require(`../../assets/icons/${rule.icon}`)}") no-repeat`}}
                            htmlFor={rule.id}></label>
                          <span
                            className={classes.checkBoxLabel}
                            htmlFor={rule.id}>{rule.id}</span>
                        </Grid>
                      ))
                    }
                  </Grid>
                </Grid>
              </form>
              <div
                className={classes.actionButtons}
                style={{ width: parentWidth }}
              >
                <Grid container spacing={16} className={classes.marginTop15}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      onClick={handleBackStep}
                    >
                      Atrás
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      type="button"
                      fullWidth
                      variant="raised"
                      color="primary"
                      className={classes.submit}
                      onClick={() => handleNextStep({
                            ...room,
                            amenities,
                            rules,
                            males,
                            females,
                            type
                        })}
                    >
                      Continuar
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6} className={classes.rightContainer}>
              <img
              className={classes.imgResponsive}
              src={amenitiesArrImg}
              title={"Room Location"}
              alt={"Room Location"}/>
            </Grid>
          </Grid>
        </div>
    );
  }
}

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
  checkboxGrid: {
    marginTop: 10,
    padding: '11px !important'
  },
  checkBoxLabel:{
    display: 'block',
    marginTop: 14
  },
  formGroup: {
    height: '100vh'
  },
  leftContainer: {
    overflow: "scroll",
    marginBottom: 300,
    paddingRight: "50px !important",
  },
  rightContainer: {
    height: "100%"
  },
  actionButtons: {
    position: "fixed",
    bottom: 0,
    backgroundColor: "#fff",
    height: 80,
    borderTop: "1px solid #d5d5d5"
  },
  imageButton: {
    position: "absolute",
    right: 19,
    top: 14
  },
  imageGrid: {
    display: "flex",
    position: "relative"
  },
  images: {
    width: 140,
    display: "block",
    height: 140,
    margin: "0 auto"
  },
  drawerContainer: {
    padding: 15,
    backgroundColor: "#F5F5F5"
  },
  drawerContainer2: {
    backgroundColor: "#F5F5F5",
    overflow: "scroll",
    height: "calc(100% - 173px)"
  },
  expansionPanel: {
    width: 430
  },
  textTabTitle: {
    paddingLeft: 15,
    marginTop: 10
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  text: {
    textAlign: "left",
    color: "black"
  },
  textInline: {
    display: "inline-block",
    color: "black"
  },
  textDrawer: {
    paddingLeft: 15
  },
  group: {
    width:'100% !important'
  },
  textSubDrawer: {
    paddingLeft: 15,
    marginBottom: 20
  },
  label: {
    textAlign: "left",
    paddingBottom: 0,
    marginTop: 20,
    marginBottom: -10
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    whiteSpace: "nowrap",
    marginBottom: theme.spacing.unit,
    height: "calc(100vh - 305px)"
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
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 0,
    [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
      width: 1000,
      marginLeft: "auto",
      marginRight: "auto"
    },
    flex: 1,
    boxSizing: "border-box",
    borderBottom: "none",
    margin: 15,
    height: "calc(100vh - 30px)",
    display: "flex",
    flexDirection: "column"
  },
  formControl: {
    width:'100%',
  },
  groupOccupation: {
    margin: "auto",
    width: 400
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 5
  },
  starDiv: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "blue",
    left: 10,
    width: 31,
    height: 31
  }
});

export default compose(withStyles(styles))(RoomDetailsComponent);
