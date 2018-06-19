// @flow

import {connect} from 'react-redux';
import NavButton from "../components/NavButton";
import {logout} from "../actions";
import {withNavigation} from 'react-navigation';

const mapStateToProps = (state, props) => ({
  right: true,
  title: "Log out",
  navigation: props.navigation,
});

const mapDispatchToProps = (dispatch, props) => ({
  onPress: () => {
    dispatch(logout());
    props.navigation.navigate('Auth');
  }
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(NavButton));
