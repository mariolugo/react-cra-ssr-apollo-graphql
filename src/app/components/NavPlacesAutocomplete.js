import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Popper from '@material-ui/core/Popper';
import SearchIcon from '@material-ui/icons/Search';

class NavPlacesAutocomplete extends React.Component {
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
    const {handleSelect, handleChange, classes, address, type, label} = this.props;
    const {anchorEl} = this.state;

    const searchOptions = {
      types: ['(cities)'],
      componentRestrictions: {country: "es"}
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
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
              <Input
                placeholder="Search…"
                disableUnderline
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onClick={this.handleClick}
                {...getInputProps({
                  placeholder: 'Search Places ...',
                  className: 'location-search-input',
                })}
              />
            <div className="autocomplete-dropdown-container">
              {loading &&
                <Popper
                  open
                  anchorEl={anchorEl}
                  style={{
                    width: anchorEl ? anchorEl.clientWidth : null,
                    border: '1px solid #d3d3d3',
                    zIndex: 100
                   }}
                >
                  <div>Loading...</div>
                </Popper>
              }

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

export default NavPlacesAutocomplete;
