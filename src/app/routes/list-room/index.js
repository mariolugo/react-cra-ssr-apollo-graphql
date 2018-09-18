import React from "react";
import Page from "../../components/page";
import { compose, graphql } from "react-apollo";
import gql from 'graphql-tag'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Cookies from "js-cookie";
import { isServer } from "../../../store";
import "./list-room.css";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import HomeIcon from "@material-ui/icons/Home";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import RoomLocationComponent from './RoomLocationComponent';
import RoomDetailsComponent from './RoomDetailsComponent';
import RoomPriceComponent from './RoomPriceComponent';
import RoomAdditionalComponent from './RoomAdditionalComponent';
import { setCurrentRoom } from '../../../modules/room';

const POST_ROOM_MUTATION = gql`
  mutation PostRoomMutation($title: String!, $description: String!, $city: String!, $address: String!, $country: String!, $latLng: Json, $amenities: [String!], $type: String!, $males: Int, $females: Int, $rules: [String!], $bed: String, $fromDate: DateTime, $toDate: DateTime, $minMonths: Int, $price: Int, $bills: Boolean, $images: [String!]) {
    postRoom(title: $title, description: $description, city: $city, address: $address, country: $country, latLng: $latLng, amenities: $amenities,, type: $type, males: $males, females: $females, rules: $rules,, bed: $bed, fromDate: $fromDate, toDate: $toDate, minMonths: $minMonths, price: $price, bills: $bills, images: $images) {
      id
      title
      postedBy {
        firstName
        lastName
        email
      }
    }
  }
`

function getSteps() {
  return ['Seleccionar ubicacion', 'Detalles del piso', 'Fecha y Precio', 'Información adicional'];
}

class ListRoom extends React.Component {
  state = {
    parentWidth: 0,
    activeStep: 0,
    completed: new Set(),
  };

  componentWillMount() {
    if (!isServer) {
      document.body.classList.add("full-height");
    }
  }

  componentDidMount() {
    console.log(this.props);
  }

  componentWillUnmount() {
    if (!isServer) {
      document.body.classList.remove("full-height");
    }
  }

  _confirm = async data => {
    Cookies.set("br_user", data.editUser);
    this.props.history.push("/dashboard");
  };

  totalSteps = () => {
    return getSteps().length;
  };

  handleNextStep = (room) => {
    this.props.setCurrentRoom(room);
    this.handleCompleteStep();

    let activeStep;

    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed
      // find the first step that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !this.state.completed.has(i));
    } else {
      activeStep = this.state.activeStep + 1;
    }

    this.setState({
      activeStep,
    });
  };

  handleStep = step => () => {
    this.setState({
      activeStep: step
    });
  };

  handleBackStep = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleCompleteStep = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const completed = new Set(this.state.completed);
    completed.add(this.state.activeStep);
    this.setState({
      completed,
    });
  };

  isStepComplete(step) {
    return this.state.completed.has(step);
  }

  completedSteps() {
    return this.state.completed.size;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps();
  }

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  _onError = error => {
    console.log({ error });
  };

  render() {
    const { classes, ...rest } = this.props;
    const steps = getSteps();
    const { activeStep } = this.state;
    return (
      <Page
        id="userEdit"
        title="User Edit"
        styles={{ backgroundColor: "#fff", paddingTop: 20 }}
      >
        <div className={classes.layout}>
          <Grid container spacing={16} className={classes.marginTop15}>
            <Grid item xs={12} sm={12}>
              <Stepper alternativeLabel nonLinear activeStep={activeStep}>
                {steps.map((label, index) => {
                  const props = {};
                  const buttonProps = {};
                  const icon = (index) => {
                    if (index === 0) return this.isStepComplete(index) ? (<LocationOnIcon style={{color:'green'}}/>) : (<LocationOnIcon/>)
                    if (index === 1) return this.isStepComplete(index) ? (<HomeIcon style={{color:'green'}}/>) : (<HomeIcon/>)
                    if (index === 2) return this.isStepComplete(index) ? (<AttachMoneyIcon style={{color:'green'}}/>) : (<AttachMoneyIcon/>)
                    if (index === 3) return this.isStepComplete(index) ? (<AddPhotoAlternateIcon style={{color:'green'}}/>) : (<AddPhotoAlternateIcon/>)
                  };
                  return (
                    <Step key={label} {...props}>
                      <StepButton
                        icon={icon(index)}
                        disabled
                        completed={this.isStepComplete(index)}
                        {...buttonProps}
                      >
                        {label}
                      </StepButton>
                    </Step>
                  );
                })}
              </Stepper>
            </Grid>
            { activeStep === 0 &&
              <RoomLocationComponent
                handleNextStep={this.handleNextStep}
                handleBackStep={this.handleBackStep}
                isStepComplete={this.isStepComplete}
                {...rest} />
            }
            { activeStep === 1 &&
              <RoomDetailsComponent
                handleNextStep={this.handleNextStep}
                handleBackStep={this.handleBackStep}
                {...rest} />
            }
            { activeStep === 2 &&
              <RoomPriceComponent
                handleNextStep={this.handleNextStep}
                handleBackStep={this.handleBackStep}
                {...rest} />
            }
            { activeStep === 3 &&
              <RoomAdditionalComponent
                handleNextStep={this.handleNextStep}
                handleBackStep={this.handleBackStep}
                {...rest} />
            }
          </Grid>
        </div>
      </Page>
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
  formGroup: {},
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
  layout: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: 30,
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
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: "auto",
    width: 200
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

const mapStateToProps = ({ room }) => {
    return {
        ...room
    };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ setCurrentRoom }, dispatch);

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles),
  graphql(POST_ROOM_MUTATION, {
    name: 'postRoom'
  })
)(ListRoom);
