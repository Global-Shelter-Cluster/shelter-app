// @flow

import {connect} from 'react-redux';
import PageListItem from '../components/PageListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import type {PageObject} from "../model/page";
import {getPageEnter} from "../model/page";
import {convertFiles} from "../model/file";

const mapStateToProps = (state, props) => {
  // const page: PageObject = convertFiles(state, 'page', getObject(state, 'page', props.id));
  const page: PageObject = getObject(state, 'page', props.id);

  return {
    page: page,
    enter: getPageEnter(state, page.id, props.navigation),
  };
};

export default withNavigation(connect(mapStateToProps)(PageListItem));
