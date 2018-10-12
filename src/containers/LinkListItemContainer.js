// @flow

import {connect} from 'react-redux';
import LinkListItem from '../components/LinkListItem';
import {withNavigation} from 'react-navigation';

const mapStateToProps = (state, props) => ({
  online: state.flags.online,
  enter: () => props.navigation.push('WebsiteViewer', {title: props.title ? props.title : props.url, url: props.url}),
});

export default withNavigation(connect(mapStateToProps)(LinkListItem));
