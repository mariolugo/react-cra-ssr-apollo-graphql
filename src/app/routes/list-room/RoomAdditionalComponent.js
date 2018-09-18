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
import imagesImg from '../../assets/images.png';
import TextField from '@material-ui/core/TextField';
import ReactDropzone from 'react-dropzone';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import StarRateIcon from '@material-ui/icons/StarRate';
import request from 'superagent';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

const CLOUDINARY_UPLOAD_PRESET = 'pizwwixc';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/roomies-ic/upload';

const SortableItem = SortableElement(({value, sortIndex, onRemove, classes,imgLoading }) =>
  <Grid item xs={4} className={classes.imageGrid}>
    <div
      tabIndex={0}
      role="button"
      className={classes.imageButton}

    >
        <IconButton className={classes.button} onClick={() => {
              onRemove(sortIndex)
          }}>
            <CloseIcon />
        </IconButton>
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

class RoomAdditionalComponent extends React.Component {
  state = {
    parentWidth: 0,
    title: "",
    description: "",
    activeStep: 0,
    images: [],
    completed: new Set(),
    imgLoading: false,
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

  onPreviewDrop = (files) => {
    this.setState({
        imgLoading: true
    });
    let length = this.state.images.length + files.length;
    if (length <= 6){
        files.map( file => {
            return this.handleImageUpload(file)
        });
    }

    this.setState({
        imgLoading: false
    });
  }

  _showToast(message) {
     this.setState({
       openToast: true,
       toastMessage: message
     })
   }

   _closeToast = () => {
     this.setState({ openToast: false });
   };

  onSortEnd = ({oldIndex, newIndex}) => {
      this.setState({
        images: arrayMove(this.state.images, oldIndex, newIndex),
      });
    };

  removeImageIndex = (index) => {
    if (this.state.images.length > 0){
        let files = this.state.images;
        files.splice(index,1)
        this.setState({
            images: files
        });
    }
  }

  _postRoom(room) {
    console.log({room});
    this.props.postRoom({
      variables:
      {
        ...room
      }
    })
    .then(response => {
      console.log(response);
      this.props.history.push(`/room/${response.data.postRoom.id}`);
    })
    .catch(err => {
      console.log({err});
    })
  }

  handleImageUpload = (file) => {
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
        }
      });
    }


  _onError = error => {
    console.log({ error });
  };

  render() {
    const { classes, handleNextStep, handleBackStep, room } = this.props;
    const { parentWidth, title, description, images, openToast, toastMessage, } = this.state;

    return (
        <div className={classes.layout}>
          <Grid container spacing={16} className={classes.marginTop15}>
            <Grid item xs={6} className={classes.leftContainer}>
              <form className={classes.formGroup} ref={this.parentWidth}>
                {/*NAMES*/}
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12}>
                    <Paper className={classes.paper}>
                        <ReactDropzone
                          accept="image/*"
                          onDrop={this.onPreviewDrop}
                          style={{width:'100%', height: '100%', minHeight: 250}}
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
                                            {images && images.length}/20
                                        </Typography>
                                    </Grid>

                                    <SortableList
                                        items={images}
                                        pressDelay={100}
                                        onSortEnd={this.onSortEnd}
                                        onRemove={(index) => this.removeImageIndex(index)}
                                        imgLoading={this.state.imgLoading}
                                        classes={classes}
                                        axis={'xy'}/>
                                </Grid>

                            }
                        </ReactDropzone>
                    </Paper>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="title"
                    gutterBottom
                    className={classes.label}
                  >
                    Título del anuncio
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="name"
                      label="Título"
                      className={classes.textField}
                      value={title}
                      onChange={e => this.setState({
                          title: e.target.value
                      })}
                      margin="normal"
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Typography
                    variant="title"
                    gutterBottom
                    className={classes.label}
                  >
                    Cuéntanos mas
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <FormControl className={classes.formControl}>
                    <TextField
                      id="multiline-static"
                      label="Cuéntanos mas"
                      multiline
                      rows="4"
                      value={description}
                      onChange={e => this.setState({
                          description: e.target.value
                      })}
                      className={classes.textField}
                      margin="normal"
                    />
                  </FormControl>
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
                      onClick={() => {
                        this._postRoom({
                          ...room,
                          images,
                          title,
                          description
                        })
                      }}
                    >
                      Finalizar
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <Grid item xs={6} className={classes.rightContainer}>
              <img
              className={classes.imgResponsive}
              src={imagesImg}
              title={"Room Location"}
              alt={"Room Location"}/>
            </Grid>

          </Grid>
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
    width: 100,
    display: "block",
    height: 100,
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
    minHeight: 250
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
    width: '100%'
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
    bottom: 12,
    backgroundColor: "blue",
    left: 27,
    width: 26,
    height: 24
  }
});

export default compose(withStyles(styles))(RoomAdditionalComponent);
