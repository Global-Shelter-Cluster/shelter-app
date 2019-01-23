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
import MultiSelect from 'react-native-multiple-select';
import t from 'tcomb-form-native';

export default class Multiselect extends t.form.Component {

  constructor(props) {
    super(props)
    this.choices = props.options.choices
    this.single = props.options.single
    this.label = props.options.label
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({ selectedItems })
    this.props.onChange(selectedItems);
  }

  getChoices() {
    let choices = []
    for (const choice in this.choices) {
      choices.push({id: choice, name: this.choices[choice]})
    }
    return choices
  }

  getTemplate() {
    let self = this;
    return function(locals) {
      return (
        <View>
          <MultiSelect
            single={self.single}
            hideTags
            items={self.getChoices()}
            uniqueKey="id"
            ref={(component) => { self.multiSelect = component }}
            onSelectedItemsChange={self.onSelectedItemsChange}
            selectedItems={self.state.selectedItems}
            selectText={self.label}
            searchInputPlaceholderText="Search Items..."
            // onChangeInput={ (text)=> console.log(text)}
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            displayKey="name"
            searchInputStyle={{ color: '#CCC' }}
            submitButtonColor="#CCC"
            submitButtonText="Make your choice"
          />
          <View>
            {self.multiSelect && self.multiSelect.getSelectedItemsExt(self.state.selectedItems)}
          </View>
        </View>
      );
    }
  }
}

