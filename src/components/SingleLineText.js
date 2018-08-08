// @flow

import React from 'react';
import {Text} from 'react-native';

const SingleLineText = props => <Text numberOfLines={1} ellipsizeMode="middle" {...props}/>;

export default SingleLineText;
