import React, {Component} from 'react';
import {FlatList, Text, TextInput, TouchableWithoutFeedback, UIManager, View} from 'react-native';
import reject from 'lodash/reject';
import get from 'lodash/get';
import InViewPort from './InViewPort';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";

const colorPack = {
  primary: '#00A5FF',
  primaryDark: '#215191',
  light: "transparent",
  textPrimary: '#525966',
  placeholderTextColor: '#A9A9A9',
  danger: '#C62828',
  borderColor: "transparent",
  backgroundColor: "transparent",
};

const iconSize = 22;
const iconColor = vars.SHELTER_GREY;

const styles = {
  footerWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  footerWrapperNC: {
    width: 320,
    flexDirection: 'column',
  },
  subSection: {
    backgroundColor: colorPack.light,
    borderBottomWidth: 1,
    borderColor: colorPack.borderColor,
    paddingLeft: 0,
    paddingRight: 20,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greyButton: {
    height: 40,
    borderRadius: 5,
    elevation: 0,
    backgroundColor: colorPack.backgroundColor,
  },
  indicator: {
    fontSize: 30,
    color: colorPack.placeholderTextColor,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
    paddingTop: 3,
    paddingRight: 3,
    paddingBottom: 3,
    margin: 3,
    borderRadius: 20,
    borderWidth: 2,
  },
  button: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colorPack.light,
    fontSize: 14,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    backgroundColor: colorPack.light,
  },
  dropdownView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    marginBottom: 10,
  },
  icon: {
    width: 25,
  },
};

export default class MultiSelect extends Component {
  static defaultProps = {
    single: false,
    selectedItems: [],
    items: [],
    uniqueKey: '_id',
    tagBorderColor: colorPack.primary,
    tagTextColor: colorPack.primary,
    fontFamily: '',
    tagRemoveIconColor: colorPack.danger,
    onSelectedItemsChange: () => {
    },
    selectedItemFontFamily: '',
    selectedItemTextColor: colorPack.primary,
    itemFontFamily: '',
    itemTextColor: colorPack.textPrimary,
    itemFontSize: 16,
    selectedItemIconColor: colorPack.primary,
    searchInputPlaceholderText: 'Search',
    searchInputStyle: {color: colorPack.textPrimary},
    textColor: colorPack.textPrimary,
    selectText: 'Select',
    altFontFamily: '',
    hideSubmitButton: false,
    autoFocusInput: true,
    submitButtonColor: '#CCC',
    submitButtonText: 'Submit',
    fontSize: 14,
    fixedHeight: false,
    hideTags: false,
    onChangeInput: () => {
    },
    displayKey: 'name',
    canAddItems: false,
    onAddItem: () => {
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: ''
    };
  }

  shouldComponentUpdate() {
    // console.log('Component Updating: ', nextProps.selectedItems);
    return true;
  }

  _onChangeInput = value => {
    const {onChangeInput} = this.props;
    if (onChangeInput) {
      onChangeInput(value);
    }
    this.setState({searchTerm: value});
  };

  _clearSearchTerm = () => {
    this.setState({
      searchTerm: ''
    });
  };

  _submitSelection = () => {
    // reset searchTerm
    this._clearSearchTerm();
  };

  _itemSelected = item => {
    const {uniqueKey, selectedItems} = this.props;
    return selectedItems.indexOf(item[uniqueKey]) !== -1;
  };

  _addItem = () => {
    const {
      uniqueKey,
      items,
      selectedItems,
      onSelectedItemsChange,
      onAddItem
    } = this.props;
    let newItems = [];
    let newSelectedItems = [];
    const newItemName = this.state.searchTerm;
    if (newItemName) {
      const newItemId = newItemName
        .split(' ')
        .filter(word => word.length)
        .join('-');
      newItems = [...items, {[uniqueKey]: newItemId, name: newItemName}];
      newSelectedItems = [...selectedItems, newItemId];
      onAddItem(newItems);
      onSelectedItemsChange(newSelectedItems);
      this._clearSearchTerm();
    }
  };

  _toggleItem = item => {
    const {
      single,
      uniqueKey,
      selectedItems,
      onSelectedItemsChange
    } = this.props;
    if (single) {
      this._submitSelection();
      onSelectedItemsChange([item[uniqueKey]]);
    } else {
      const status = this._itemSelected(item);
      let newItems = [];
      if (status) {
        newItems = reject(
          selectedItems,
          singleItem => item[uniqueKey] === singleItem
        );
      } else {
        newItems = [...selectedItems, item[uniqueKey]];
      }
      // broadcast new selected items state to parent component
      onSelectedItemsChange(newItems);
    }
  };

  _getRow = item => {
    const {displayKey, single} = this.props;
    return (
      <TouchableWithoutFeedback
        disabled={item.disabled}
        onPress={() => this._toggleItem(item)}
      >
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10}}>
            {single
              ? (this._itemSelected(item)
                  ? <FontAwesome name={"check-circle"} size={iconSize} color={iconColor} style={styles.icon}/>
                  : <FontAwesome name={"circle-thin"} size={iconSize} color={iconColor} style={styles.icon}/>
              )
              : (this._itemSelected(item)
                  ? <FontAwesome name={"check-square"} size={iconSize} color={iconColor} style={styles.icon}/>
                  : <FontAwesome name={"square-o"} size={iconSize} color={iconColor} style={styles.icon}/>
              )
            }
            <Text
              style={[
                {
                  flex: 1,
                  fontSize: 16,
                  paddingTop: 5,
                  paddingBottom: 5
                },
                item.disabled ? {color: 'grey'} : {}
              ]}
            >
              {item[displayKey]}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _filterItems = searchTerm => {
    const {items, displayKey} = this.props;
    const filteredItems = [];
    items.forEach(item => {
      const parts = searchTerm.trim().split(/[ \-:]+/);
      const regex = new RegExp(`(${parts.join('|')})`, 'ig');
      if (regex.test(get(item, displayKey))) {
        filteredItems.push(item);
      }
    });
    return filteredItems;
  };

  _renderItems = () => {
    const {
      canAddItems,
      items,
      fontFamily,
      uniqueKey,
      selectedItems
    } = this.props;
    const {searchTerm} = this.state;
    // If searchTerm matches an item in the list, we should not add a new
    // element to the list.
    let itemList;
    const renderItems = searchTerm ? this._filterItems(searchTerm) : items;
    if (renderItems.length) {
      itemList = (
        <FlatList
          data={renderItems}
          extraData={selectedItems}
          keyExtractor={item => item[uniqueKey]}
          renderItem={rowData => this._getRow(rowData.item)}
        />
      );
    } else if (!canAddItems) {
      itemList = (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={[
              {
                flex: 1,
                marginTop: 20,
                textAlign: 'center',
                color: colorPack.danger
              },
              fontFamily ? {fontFamily} : {}
            ]}
          >
            No item to display.
          </Text>
        </View>
      );
    }

    return <View>{itemList}</View>;
  };

  checkVisible = (isVisible) => {
    console.log(this.props.selectedItems);
  };

  render() {
    const {
      searchInputPlaceholderText,
      searchInputStyle,
      autoFocusInput,
    } = this.props;
    const {searchTerm} = this.state;

    return (
      <View
        style={{
          flexDirection: 'column',
          marginBottom: 10
        }}
      >
        <InViewPort onChange={(isVisible) => this.checkVisible(isVisible)}>
          <View style={{
            flexDirection: 'column',
            // maxHeight: 100, // TODO: if there are too many options, limit the height, make it scrollable, and turn on the "search" box
          }}>
            {false && <View style={styles.inputGroup}>
              {/*<Icon
                name="magnify"
                size={20}
                color={colorPack.placeholderTextColor}
                style={{marginRight: 10}}
              />*/}
              <TextInput
                autoFocus={autoFocusInput}
                onChangeText={this._onChangeInput}
                blurOnSubmit={false}
                onSubmitEditing={this._addItem}
                placeholder={searchInputPlaceholderText}
                placeholderTextColor={colorPack.placeholderTextColor}
                underlineColorAndroid="transparent"
                style={[searchInputStyle, {flex: 1}]}
                value={searchTerm}
              />
            </View>}
            <View
              style={{
                flexDirection: 'column',
              }}
            >
              <View>{this._renderItems()}</View>
            </View>
          </View>
        </InViewPort>
      </View>
    );
  }
}
