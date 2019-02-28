/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import MultiSelect from '../Multiselect';
import t from 'tcomb-form-native';

export default class MultiselectFactory extends t.form.Component {

  constructor(props) {
    super(props);
    this.choices = props.options.choices;
    this.single = props.options.single;
    this.label = props.options.label;
    this.checkVisible = this.checkVisible.bind(this);
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
    this.props.onChange(selectedItems);
  };

  getChoices() {
    let choices = [];
    for (const choice in this.choices) {
      choices.push({id: choice, name: this.choices[choice]})
    }
    return choices
  }

  checkVisible = (isVisible) => {
    console.log('FNORD');
  };

  getTemplate() {
    let self = this;
    return function (locals) {
      const stylesheet = locals.stylesheet;
      // console.log('CAMlocals',locals);
      if (locals.hidden === true) {
        return null;
      }
      return (
        <View style={locals.hasError ? stylesheet.formGroup.error : stylesheet.formGroup.normal}>
          {locals.label
            ? <Text
              style={locals.hasError ? stylesheet.controlLabel.error : stylesheet.controlLabel.normal}>
              {locals.label}
            </Text>
            : null
          }

          <MultiSelect
            // fixedHeight
            hideSubmitButton={true}
            hideDropdown={true}
            hideTags={true}
            single={self.single}
            items={self.getChoices()}
            uniqueKey="id"
            ref={(component) => {
              self.multiSelect = component
            }}
            onSelectedItemsChange={self.onSelectedItemsChange}
            selectedItems={self.state.selectedItems}
            selectText={null}
            searchInputPlaceholderText="Search Items..."
            // onChangeInput={ (text)=> console.log(text)}
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{color: '#CCC'}}
          />
          {/*<View>
            {self.multiSelect && self.multiSelect.getSelectedItemsExt(self.state.selectedItems)}
          </View>*/}
          {locals.config.help
            ? <Text style={locals.hasError ? stylesheet.helpBlock.normal : stylesheet.helpBlock.error}>
              {locals.config.help}
            </Text>
            : null
          }
        </View>
      );
    }
  }
}

