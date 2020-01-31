// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {PublicFactsheetObject} from "../../model/factsheet";
import {detailLevels, getObject, OBJECT_MODE_PUBLIC} from "../../model";
import Factsheet from './Factsheet';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import moment from "moment/moment";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import {hitPage} from "../../analytics";

type Props = {
  online: boolean,
  loading: boolean,
  factsheet: PublicFactsheetObject,
  loaded: boolean,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

const mapStateToProps = (state, props) => {
  const factsheet: PublicFactsheetObject = convertFiles(state, 'factsheet', getObject(state, 'factsheet', props.navigation.getParam('factsheetId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    factsheet: factsheet,
    loaded: detailLevels[factsheet._mode] >= detailLevels[OBJECT_MODE_PUBLIC],
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('factsheet', props.navigation.getParam('factsheetId'), false, true));
  },
});

class FactsheetScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}) => ({
    headerTitle: <NavTitleContainer title={navigation.getParam('title', 'Loading...')}/>,
  });

  shouldComponentUpdate(nextProps) {
    return !propEqual(this.props, nextProps, ['online', 'loading', 'loaded'], ['factsheet', 'lastError']);
  }

  componentWillMount() {
    if (!this.props.loaded)
      this.props.refresh();

    this.props.navigation.setParams({title: this.title(this.props.factsheet.date)});
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => hitPage(payload.state.routeName + '/' + this.props.factsheet.id),
    );
  }

  componentDidUpdate() {
    if (this.title(this.props.factsheet.date) !== this.props.navigation.getParam('title'))
      this.props.navigation.setParams({title: this.title(this.props.factsheet.date)});
  }

  title(date) {
    // "factsheet.date" is a string like "2019-03", not a timestamp, so we don't do ".utc()" here
    return moment(date).format('MMM YYYY') + ' Factsheet';
  }

  render() {
    return <Factsheet {...this.props}/>;
  }
}

export default FactsheetScreen = connect(mapStateToProps, mapDispatchToProps)(FactsheetScreen);
