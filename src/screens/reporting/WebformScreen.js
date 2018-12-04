// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {WebformObject} from "../../model/webform";
import {getWebformPageValues, setWebformPageValues} from "../../model/webform";
import {getObject} from "../../model";
import Webform from './Webform';
import {clearLastError, loadObject} from "../../actions";
import NavTitleContainer from "../../containers/NavTitleContainer";
import type {lastErrorType} from "../../reducers/lastError";
import {convertFiles} from "../../model/file";
import {propEqual} from "../../util";
import type {navigation} from "../../nav";
import analytics from "../../analytics";
import {PageHit} from "expo-analytics";
import clone from "clone";

type Props = {
  online: boolean,
  loading: boolean,
  webform: WebformObject,
  currentPage: number,
  navigation: navigation,
  refresh: () => void,
  lastError: lastErrorType,
}

type State = {
  page: number,
  allFormValues: Array<{}>, // keyed by page, e.g. [{firstName:"John",lastName:"Smith"}, {favoriteColor:"red"}]
  pagesVisited: { [string]: true }, // e.g. {0: true, 1: true} (we've visited the first 2 pages)
}

const mapStateToProps = (state, props) => {
  const webform: WebformObject = convertFiles(state, 'webform', getObject(state, 'webform', props.navigation.getParam('webformId')));

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    lastError: state.lastError,
    webform: webform,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('webform', props.navigation.getParam('webformId'), false, true));
  },
});

class WebformScreen extends React.Component<Props, State> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Assessment form"/>,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      allFormValues: [],
      pagesVisited: {0: true},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['page'])
      || !propEqual(this.props, nextProps, ['online', 'loading'], ['webform', 'lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName + '/' + this.props.webform.id)),
    );
  }

  render() {
    const isLastPage = this.state.page === (this.props.webform.form.length - 1);

    const onSubmit = isLastPage
      ? () => {
        const mergedValues = this.state.allFormValues.reduce((prev, current) => Object.assign(prev, current), {})
        console.log("TODO: submit", mergedValues); // TODO
      }
      : () => {
        const page = this.state.page + 1;
        const pagesVisited = clone(this.state.pagesVisited);
        pagesVisited[page] = true;
        this.setState({page, pagesVisited});
      };

    return <Webform
      {...this.props}
      page={this.state.page}
      formValues={getWebformPageValues(this.props.webform, this.state.allFormValues, this.state.page)}
      pagesVisited={this.state.pagesVisited}
      onPageChange={newPage => {
        const page = parseInt(newPage, 10);
        const pagesVisited = clone(this.state.pagesVisited);
        pagesVisited[page] = true;
        this.setState({page, pagesVisited});
      }}
      onChange={formValues => this.setState({allFormValues: setWebformPageValues(this.state.allFormValues, this.state.page, formValues)})}
      onSubmit={onSubmit}
    />;
  }
}

export default WebformScreen = connect(mapStateToProps, mapDispatchToProps)(WebformScreen);
