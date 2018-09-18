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
import bedImg from '../../assets/bed.png';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import NumberFormat from 'react-number-format';
import Checkbox from '@material-ui/core/Checkbox';

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="€"
    />
  );
}

class RoomPriceComponent extends React.Component {
  state = {
    parentWidth: 0,
    activeStep: 0,
    completed: new Set(),
    bed: '',
    fromDate: new Date(),
    toEnabled: false,
    toDate: null,
    minMonths: '',
    price: '',
    bills: false,
    numberformat: '',
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
      parentWidth: this.parentWidth.current.offsetWidth
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
    const { classes, handleNextStep, handleBackStep, room } = this.props;
    const { parentWidth,numberformat,bed, fromDate, toDate, minMonths, price, bills, toEnabled } = this.state;

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
                      Tipo de cama
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControl className={classes.formControl}>
                      <RadioGroup
                        aria-label="Gender"
                        name="gender1"
                        className={classes.group}
                        value={bed}
                        onChange={e => {
                          this.setState({
                            bed: e.target.value
                          })
                        }}
                      >
                        <FormControlLabel value="sofa" control={<Radio />} label="Sofa cama" />
                        <FormControlLabel value="single" control={<Radio />} label="Cama sencilla" />
                        <FormControlLabel value="double" control={<Radio />} label="Cama matrimonial" />
                        <FormControlLabel value="none" control={<Radio />} label="Sin cama" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="title"
                      gutterBottom
                      className={classes.label}
                    >
                      Disponibilidad
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <FormControlLabel
                      style={{float:'left'}}
                      control={
                        <Switch
                          checked={toEnabled}
                          onChange={()=>{
                            this.setState({
                              toEnabled: !toEnabled,
                              toDate: new Date()
                            });
                          }}
                          value="checkedA"
                        />
                      }
                      label="Fecha de salida"
                    />
                  </Grid>
                  <Grid item xs={6} sm={6}>
                    <FormControl className={classes.formControl}>
                      <TextField
                        id="date"
                        label="From"
                        type="date"
                        defaultValue={fromDate.toLocaleDateString("en-Us")}
                        onChange={e => {
                          this.setState({
                            fromDate: new Date(e.target.value)
                          })
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </FormControl>
                  </Grid>
                  {toEnabled &&
                    <Grid item xs={6} sm={6}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          id="date"
                          label="To"
                          type="date"
                          defaultValue={toDate.toLocaleDateString("en-Us")}
                          onChange={e => {
                            this.setState({
                              toDate: new Date(e.target.value)
                            })
                          }}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </FormControl>
                    </Grid>
                  }
                  <Grid item xs={12} sm={12}>
                     <Typography variant="title" gutterBottom className={classes.label}>
                       Estancia mínima
                     </Typography>
                   </Grid>
                   <Grid item xs={12} sm={12}>
                     <RadioGroup
                       aria-label="Occupation"
                       name="occupation"
                       className={classes.groupOccupation}
                       value={minMonths}
                       onChange={e =>
                         this.setState({ minMonths: e.target.value })
                       }
                       row
                     >
                       <FormControlLabel className={classes.inlineLabel} value="1" control={<Radio />} label="1" />
                       <FormControlLabel className={classes.inlineLabel} value="2" control={<Radio />} label="2" />
                       <FormControlLabel className={classes.inlineLabel} value="3" control={<Radio />} label="3" />
                       <FormControlLabel className={classes.inlineLabel} value="6" control={<Radio />} label="6" />
                       <FormControlLabel className={classes.inlineLabel} value="12" control={<Radio />} label="12" />
                     </RadioGroup>
                   </Grid>
                   <Grid item xs={12} sm={12}>
                      <Typography variant="title" gutterBottom className={classes.label}>
                        Precio
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <FormControl className={classes.formControl}>
                        <TextField
                          className={classes.formControl}
                          label="Precio (€) / mes"
                          value={price}
                          onChange={e => {
                            this.setState({
                              price: e.target.value
                            })
                          }}
                          id="formatted-numberformat-input"
                          InputProps={{
                            inputComponent: NumberFormatCustom,
                          }}
                        />
                      </FormControl>
                      <FormControlLabel
                        style={{float:'left'}}
                        control={
                          <Checkbox
                            checked={bills}
                            onChange={() => this.setState({
                              bills: !bills
                            })}
                            value="checkedA"
                          />
                        }
                        label="Incluye servicios"
                      />
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
                          bed,
                          fromDate,
                          toDate,
                          minMonths,
                          price,
                          bills
                      })}>
                      Continuar
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6} className={classes.rightContainer}>
              <img
              className={classes.imgResponsive}
              src={bedImg}
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
  formGroup: {
    height: '100vh'
  },
  leftContainer: {
    overflow: "scroll",
    marginBottom: 150,
    paddingRight: "50px !important"
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
  inlineLabel: {
    margin: '0 auto'
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
    padding: 15,
    backgroundColor: "#F5F5F5",
    height: "calc(100vh - 180px)"
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
  group: {
    width:'100% !important'
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

export default compose(withStyles(styles))(RoomPriceComponent);
