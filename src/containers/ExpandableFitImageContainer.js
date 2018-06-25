// @flow

import {connect} from 'react-redux';
import ExpandableFitImage from "../components/ExpandableFitImage";

const mapStateToProps = state => ({
  online: state.flags.online,
});

export default ExpandableFitImageContainer = connect(mapStateToProps)(ExpandableFitImage);
