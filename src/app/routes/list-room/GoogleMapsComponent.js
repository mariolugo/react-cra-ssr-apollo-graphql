import React from 'react';
import { GoogleMap,withGoogleMap } from 'react-google-maps';

const MyMapComponent = withGoogleMap((props) =>
  <GoogleMap {...props} ref={props.onMapMounted}>{props.children}</GoogleMap>
);

export default MyMapComponent
