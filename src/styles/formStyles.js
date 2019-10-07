// @flow

import {StyleSheet} from 'react-native';
import vars from "../vars";
import t from "tcomb-form-native";

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

const Form = t.form.Form;

export const formStylesheet = {
  ...Form.stylesheet,
  formGroup: {
    normal: {
      ...Form.stylesheet.formGroup.normal,
      ...formStyles.fieldContainer,
    },
    error: {
      ...Form.stylesheet.formGroup.error,
      ...formStyles.fieldContainer,
    },
  },
  controlLabel: {
    normal: {
      ...Form.stylesheet.controlLabel.normal,
      ...formStyles.name,
    },
    error: {
      ...Form.stylesheet.controlLabel.error,
      ...formStyles.name,
    },
  },
  helpBlock: {
    normal: {
      ...Form.stylesheet.helpBlock.normal,
      ...formStyles.description,
    },
    error: {
      ...Form.stylesheet.helpBlock.error,
      ...formStyles.description,
    },
  },
  textbox: {
    ...Form.stylesheet.textbox,
    normal: {
      ...Form.stylesheet.textbox.normal,
      borderColor: vars.SHELTER_GREY,
      borderRadius: 2,
    },
    error: {
      ...Form.stylesheet.textbox.error,
      borderColor: vars.ACCENT_RED,
      borderRadius: 2,
    },
  },
};

export const textareaStylesheet = {
  ...formStylesheet,
  textbox: {
    ...formStylesheet.textbox,
    normal: {
      ...formStylesheet.textbox.normal,
      height: 180,
    },
    error: {
      ...formStylesheet.textbox.error,
      height: 180,
    },
  },
};

export const listItemStylesheet = {
  ...formStylesheet,
  formGroup: {
    normal: {
      ...Form.stylesheet.formGroup.normal,
      marginTop: 5,
      marginBottom: 5,
    },
    error: {
      ...Form.stylesheet.formGroup.error,
      marginTop: 5,
      marginBottom: 5,
    },
  },
};
