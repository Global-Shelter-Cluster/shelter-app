// @flow

import {connect} from 'react-redux';
import NavButton from "../components/NavButton";
import {logout} from "../actions";
import {withNavigation} from 'react-navigation';
import i18n from "../i18n";

const mapStateToProps = (state, props) => ({
  hidden: !state.flags.online,
  right: true,
  title: i18n.t("Log out"),
  navigation: props.navigation,
});

const mapDispatchToProps = (dispatch, props) => ({
  onPress: () => {
    dispatch(logout());
    props.navigation.navigate('Auth');
  }
});

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(NavButton));
