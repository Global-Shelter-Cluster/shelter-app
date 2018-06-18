// @flow

import {connect} from 'react-redux';
import {withNavigation} from 'react-navigation';
import FactsheetNavigation from "../components/FactsheetNavigation";
import {convertFiles} from "../model/file";
import {getObject} from "../model";

const mapStateToProps = (state, props) => ({
  prev: props.factsheet.prev !== undefined ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', props.factsheet.prev)) : null,
  next: props.factsheet.next !== undefined ? convertFiles(state, 'factsheet', getObject(state, 'factsheet', props.factsheet.next)) : null,
  enter: (id: number) => props.navigation.push('Factsheet', {factsheetId: id}),
});

export default FactsheetNavigationContainer = withNavigation(connect(mapStateToProps)(FactsheetNavigation));
