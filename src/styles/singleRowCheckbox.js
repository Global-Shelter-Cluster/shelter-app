import React from 'react';
import {Switch, Text, TouchableWithoutFeedback, View} from 'react-native';

// Shows the title and checkbox in the same row, and allows the user to tap on the title to change the value.
//
// Adapted from the regular checkbox template: tcomb-form-native/lib/templates/bootstrap/checkbox.js

function singleRowCheckbox(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var formGroupStyle = stylesheet.formGroup.normal;
  var controlLabelStyle = stylesheet.controlLabel.normal;
  var checkboxStyle = stylesheet.checkbox.normal;
  var helpBlockStyle = stylesheet.helpBlock.normal;
  var errorBlockStyle = stylesheet.errorBlock;

  if (locals.hasError) {
    formGroupStyle = stylesheet.formGroup.error;
    controlLabelStyle = stylesheet.controlLabel.error;
    checkboxStyle = stylesheet.checkbox.error;
    helpBlockStyle = stylesheet.helpBlock.error;
  }

  var label = locals.label ? (
    <TouchableWithoutFeedback onPress={() => locals.onChange(!locals.value)}>
      <Text style={[controlLabelStyle, {flex: 1}]}>{locals.label}</Text>
    </TouchableWithoutFeedback>
  ) : null;
  var help = locals.help ? (
    <Text style={helpBlockStyle}>{locals.help}</Text>
  ) : null;
  var error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
        {locals.error}
      </Text>
    ) : null;

  return (
    <View style={formGroupStyle}>
      <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-end"}}>
        {label}
        <Switch
          accessibilityLabel={locals.label}
          ref="input"
          disabled={locals.disabled}
          onTintColor={locals.onTintColor}
          thumbTintColor={locals.thumbTintColor}
          tintColor={locals.tintColor}
          style={checkboxStyle}
          onValueChange={value => locals.onChange(value)}
          value={locals.value}
        />
      </View>
      {help}
      {error}
    </View>
  );
}

export default singleRowCheckbox;
