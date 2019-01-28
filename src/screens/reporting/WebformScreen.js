// @flow

import React from 'react';
import {connect} from 'react-redux';
import type {WebformObject} from "../../model/webform";
import {getWebformPageValues, setWebformPageValues} from "../../model/webform";
import {getObject} from "../../model";
import Webform from './Webform';
import {clearLastError, loadObject, submitAssessmentForm} from "../../actions";
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
  submitting: boolean,
  webform: WebformObject,
  currentPage: number,
  navigation: navigation,
  refresh: () => void,
  submit: (values: {}) => void,
  clearLastError: () => void,
  lastError: lastErrorType,
}

type State = {
  page: number,
  allFormValues: Array<{}>, // keyed by page, e.g. [{firstName:"John",lastName:"Smith"}, {favoriteColor:"red"}]
  pagesVisited: { [string]: true }, // e.g. {0: true, 1: true} (we've visited the first 2 pages)
  submitted: boolean,
}

const initialState = {
  page: 0,
  allFormValues: [],
  pagesVisited: {0: true},
  submitted: false,
};

const mapStateToProps = (state, props) => {
  const webform: WebformObject = convertFiles(state, 'webform', getObject(state, 'webform', props.navigation.getParam('webformId')));

  const tempwebform: WebformObject = clone(webform);
  tempwebform.form[tempwebform.form.length-1].fields.push({
    type: 'geolocation',
    key: 'geo',
    name: 'Test geo location',
    description: 'hey there',
  });

  console.log("CAM", tempwebform);

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    submitting: state.flags.submitting,
    lastError: state.lastError,
    webform: tempwebform,
    queued: state.bgProgress.assessmentFormSubmissions.filter(s => s.type === "webform" && s.id === webform.id).length,
  };
};

const mapDispatchToProps = (dispatch, props) => ({
  refresh: () => {
    dispatch(clearLastError());
    dispatch(loadObject('webform', props.navigation.getParam('webformId'), false, true));
  },
  submit: (values: {}) => {
    dispatch(submitAssessmentForm('webform', props.navigation.getParam('webformId'), values));
  },
  clearLastError: () => {
    dispatch(clearLastError());
  },
});

class WebformScreen extends React.Component<Props, State> {
  static navigationOptions = {
    headerTitle: <NavTitleContainer title="Assessment form"/>,
  };

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['page', 'submitted'])
      || !propEqual(this.props, nextProps, ['online', 'loading', 'submitting', 'queued'], ['webform', 'lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName + '/' + this.props.webform.id)),
    );
  }

  render() {
    const isLastPage = this.state.page === (this.props.webform.form.length - 1);

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
      onSubmit={isLastPage
        ? () => {
          const mergedValues = this.state.allFormValues.reduce((prev, current) => Object.assign(prev, current), {})
          if (!this.props.submitting) {
            this.props.submit(mergedValues);
            this.setState({submitted: true});
          }
        }
        : () => {
          const page = this.state.page + 1;
          const pagesVisited = clone(this.state.pagesVisited);
          pagesVisited[page] = true;
          this.setState({page, pagesVisited});
        }}
      submitted={this.state.submitted}
      resetSubmitted={() => this.setState({submitted: false})}
      resetForm={() => {
        this.setState(initialState);
        this.props.clearLastError();
      }}
    />;
  }
}

export default WebformScreen = connect(mapStateToProps, mapDispatchToProps)(WebformScreen);
