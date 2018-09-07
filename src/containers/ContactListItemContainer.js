// @flow

import React from 'react';
import {connect} from 'react-redux';
import ContactListItem from '../components/ContactListItem';
import {getObject} from "../model";
import {withNavigation} from 'react-navigation';
import {convertFiles} from "../model/file";
import type {ContactObject} from "../model/contact";

const mapStateToProps = (state, props) => {
  const contact: ContactObject = convertFiles(state, 'contact', getObject(state, 'contact', props.id));

  return {
    contact,
    enter: () => props.navigation.push('Contact', {contactId: contact.id}),
  };
};

export default withNavigation(connect(mapStateToProps)(ContactListItem));
