import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import amenitiesArrImg from "../../assets/amenities.png";
import AmenitiesUtil from "../list-room/AmenitiesUtil";

export default class AmenitiesDialog extends React.Component {
  state = {
    open: false,
    amenitiesArr: [],
    rulesArr: [],
    amenities: [],
  };

  componentDidMount() {
      this.setState({
        amenitiesArr: AmenitiesUtil
      });
    }

  render() {
    const { open, handleClose, classes, bed, amenities, handleBed, handleAmenities, handleAcceptDialog, handleDeleteFilters } = this.props;
    const {amenitiesArr} = this.state;
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Seleccionar comodidades
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={16}>
            <Grid item xs={12} sm={4}>
              <FormControl className={classes.formControl}>
                <RadioGroup
                  aria-label="Gender"
                  name="gender1"
                  className={classes.group}
                  value={bed}
                  onChange={handleBed}
                >
                  <FormControlLabel
                    value="sofa"
                    control={<Radio />}
                    label="Sofa cama"
                  />
                  <FormControlLabel
                    value="single"
                    control={<Radio />}
                    label="Cama sencilla"
                  />
                  <FormControlLabel
                    value="double"
                    control={<Radio />}
                    label="Cama matrimonial"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="Sin cama"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Grid container spacing={16}>
                    {amenitiesArr.length > 0 &&
                      amenitiesArr.map((amenity, index) => (
                        <Grid
                          item
                          xs={4}
                          sm={4}
                          key={index}
                          className={classes.checkboxGrid}
                        >
                          <input
                            id={amenity.id}
                            type="checkbox"
                            onChange={e => {
                              handleAmenities(amenity.id)
                            }}
                            defaultChecked={amenities.indexOf(amenity.id) > -1}
                          />
                          <label
                            className={"checkbox"}
                            style={{
                              background: `url("${require(`../../assets/icons/${
                                amenity.icon
                            }`)}") no-repeat`,
                            margin:'0 auto',
                            display:'block',
                            }}
                            htmlFor={amenity.id}
                          />
                          <span
                            className={classes.checkBoxLabel}
                            htmlFor={amenity.id}
                          >
                            {amenity.id}
                          </span>
                        </Grid>
                      ))}
                </Grid>

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleDeleteFilters} color="primary" style={{
                    float: 'left'
                }}>
              Borrar Filtros
            </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAcceptDialog} color="primary">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
