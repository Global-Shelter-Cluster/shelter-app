// @flow

import React from 'react';
import {connect} from 'react-redux';
import PageActions from '../components/PageActions';
import {withNavigation} from 'react-navigation';

const mapStateToProps = (state, props) => ({
  online: state.flags.online,
  viewOnWebsite: () => props.navigation.push('WebsiteViewer', {title: props.page.title, url: props.page.url}),
});

export default withNavigation(connect(mapStateToProps)(PageActions));
