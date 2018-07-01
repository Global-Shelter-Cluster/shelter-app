// @flow

import {StyleSheet} from 'react-native';
import vars from "../vars";
import {hairlineWidth} from "../util";

export default searchResultStyles = StyleSheet.create({
  container: {
    borderColor: vars.LIGHT_GREY,
    borderTopWidth: hairlineWidth,
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  secondary: {
    color: vars.SHELTER_GREY,
  },
});
