/**
 * @file Adapted from tcomb-form-native/lib/templates/bootstrap/list.js
 */

import {FontAwesome} from "@expo/vector-icons";
import vars from "../../vars";

var React = require("react");
var { View, Text, TouchableHighlight } = require("react-native");

function renderRowWithoutButtons(item) {
  return <View key={item.key}>{item.input}</View>;
}

function renderRowButton(button, stylesheet, style) {
  let icon = null;
  console.log('CAM btnType',button.type);
  switch (button.type) {
    case 'add':
      icon = 'plus';
      break;
    case 'remove':
      icon = 'trash';
      break;
    default:
      return null; // hide other buttons
  }

  return (
    <TouchableHighlight
      key={button.type}
      style={[{alignSelf: "flex-end", paddingVertical: 8, paddingHorizontal: 12}]}
      onPress={button.click}
    >
      <FontAwesome name={icon} size={24} color={vars.SHELTER_GREY}/>
    </TouchableHighlight>
  );
}

function renderButtonGroup(buttons, stylesheet) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "center" }}>
      {buttons.map(button =>
        renderRowButton(button, stylesheet, { width: 50 })
      )}
    </View>
  );
}

function renderRow(item, stylesheet) {
  item.input.props.ctx.label = null; // Hide label for each item

  return (
    <View key={item.key} style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={{ flex: 1 }}>{item.input}</View>
      <View style={{}}>
        {renderButtonGroup(item.buttons, stylesheet)}
      </View>
    </View>
  );
}

function ListTemplate(locals) {
  if (locals.hidden) {
    return null;
  }

  var stylesheet = locals.stylesheet;
  var fieldsetStyle = stylesheet.fieldset;
  var controlLabelStyle = stylesheet.controlLabel.normal;

  if (locals.hasError) {
    controlLabelStyle = stylesheet.controlLabel.error;
  }

  var label = locals.label ? (
    <Text style={controlLabelStyle}>{locals.label}</Text>
  ) : null;
  var error =
    locals.hasError && locals.error ? (
      <Text accessibilityLiveRegion="polite" style={stylesheet.errorBlock}>
        {locals.error}
      </Text>
    ) : null;

  var rows = locals.items.map(function(item) {
    return item.buttons.length === 0
      ? renderRowWithoutButtons(item)
      : renderRow(item, stylesheet);
  });

  var addButton = locals.add ? renderRowButton(locals.add, stylesheet) : null;

  return (
    <View style={fieldsetStyle}>
      {label}
      {error}
      {rows}
      {addButton}
    </View>
  );
}

module.exports = ListTemplate;
