import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Popper from '@material-ui/core/Popper';

class LocationSearchInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '', achorEl: null };
  }

  handleClick = event => {
    const { currentTarget } = event;
    this.setState(state => ({
      anchorEl: currentTarget,
    }));
  };

  render() {
    const {handleSelect, handleChange, address, type, label, latLngCity} = this.props;
    const {anchorEl} = this.state;

    const searchOptions = {
      types: ['address']
    }

    if (typeof latLngCity.lat !== 'undefined') {
      searchOptions.location = new window.google.maps.LatLng(latLngCity.lat, latLngCity.lng);
      searchOptions.radius = 300;
    }


    return (
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor={type}>{label}</InputLabel>
              <Input
                onClick={this.handleClick}
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
              />
            </FormControl>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {!loading &&
                <Popper
                  open={Boolean(suggestions.length > 0)}
                  anchorEl={anchorEl}
                  style={{
                    width: anchorEl ? anchorEl.clientWidth : null,
                    border: '1px solid #d3d3d3'
                   }}
                >
                  {suggestions.map(suggestion => {

                    const styles ={
                      display: 'block',
                      paddingLeft: 15,
                      paddingTop: 15,
                      paddingBottom: 15
                    };

                    const className = suggestion.active
                      ? 'suggestion-item--active'
                      : 'suggestion-item';
                    // inline style for demonstration purpose
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer', ...styles }
                      : { backgroundColor: '#ffffff', cursor: 'pointer', ...styles };
                    return (
                        <span {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}>{suggestion.description}</span>
                    );
                  })}
                </Popper>
              }
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default LocationSearchInput;
