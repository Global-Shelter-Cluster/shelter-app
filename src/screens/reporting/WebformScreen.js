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
import i18n from "../../i18n";

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

  return {
    online: state.flags.online,
    loading: state.flags.loading,
    submitting: state.flags.submitting,
    lastError: state.lastError,
    webform,
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
    headerTitle: <NavTitleContainer title={i18n.t("Data collection")}/>,
  };

  constructor(props: Props) {
    super(props);
    this.state = initialState;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !propEqual(this.state, nextState, ['page', 'submitted'], ['allFormValues'])
      || !propEqual(this.props, nextProps, ['online', 'loading', 'submitting', 'queued'], ['webform', 'lastError']);
  }

  componentDidMount() {
    this.props.navigation.addListener(
      'didFocus',
      payload => analytics.hit(new PageHit(payload.state.routeName + '/' + this.props.webform.id)),
    );
  }

  render() {
    const {webform, submitting, submit, clearLastError} = this.props;
    const {page, allFormValues, pagesVisited, submitted} = this.state;
    const isLastPage = webform.form !== undefined ? (page === (webform.form.length - 1)) : true;

    return <Webform
      {...this.props}
      page={page}
      formValues={getWebformPageValues(webform, allFormValues, page)}
      flattenedValues={allFormValues.reduce((prev, current) => Object.assign(prev, current), {})}
      pagesVisited={pagesVisited}
      onPageChange={newPage => {
        const page = parseInt(newPage, 10);
        const pagesVisited = clone(this.state.pagesVisited);
        pagesVisited[page] = true;
        this.setState({page, pagesVisited});
      }}
      onChange={formValues => this.setState({allFormValues: setWebformPageValues(allFormValues, page, formValues)})}
      onSubmit={isLastPage
        ? () => {
          const mergedValues = allFormValues.reduce((prev, current) => Object.assign(prev, current), {})
          if (!submitting) {
            submit(mergedValues);
            this.setState({submitted: true});
          }
        }
        : () => {
          const page = this.state.page + 1;
          const pagesVisited = clone(this.state.pagesVisited);
          pagesVisited[page] = true;
          this.setState({page, pagesVisited});
        }}
      submitted={submitted}
      resetSubmitted={() => this.setState({submitted: false})}
      resetForm={() => {
        this.setState(initialState);
        clearLastError();
      }}
    />;
  }
}

export default WebformScreen = connect(mapStateToProps, mapDispatchToProps)(WebformScreen);
