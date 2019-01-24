// @flow

import {StyleSheet} from 'react-native';
import vars from "../vars";
import {hairlineWidth} from "../util";

const formStyles = StyleSheet.create({
  fieldContainer: {
    marginTop: 10,
    marginBottom: 25,
  },
  name: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
    color: vars.LIGHT_GREY,
  },
});

export default formStyles;
