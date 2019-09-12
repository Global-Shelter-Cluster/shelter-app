// @flow

import React from 'react';
import {Linking, Modal, Platform, Share, StyleSheet, TouchableOpacity, View, WebView} from 'react-native';
import type {ContactObject} from "../model/contact";
import {createExpoContact} from "../model/contact";
import Button from "./Button";
import {ensurePermissions} from "../permission";
import * as Permissions from 'expo-permissions';
import * as Contacts from 'expo-contacts';
import i18n from "../i18n";

type Props = {
  contact: ContactObject,
  online: boolean,
};

type State = {
  modal: string | null,
}

export default class ContactActions extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modal: null,
    };
  }

  render() {
    const {contact, online} = this.props;
    const buttons = [];
    const shareMessage = [contact.name];

    if (contact.mail !== undefined)
      contact.mail.map((address, i) => {
        buttons.push(<Button
          style={styles.button}
          key={"mail" + i} title={address} icon="envelope-o"
          onPress={() => {
            // MailComposer.composeAsync({recipients: [address]}); (Expo library)
            Linking.openURL('mailto:' + address); // TODO: is this better?
          }}
        />);

        shareMessage.push(address);
      });

    if (contact.phone !== undefined)
      contact.phone.map((number, i) => {
        buttons.push(<Button
          style={styles.button}
          key={"phone" + i} title={number} icon="phone"
          onPress={() => {
            Linking.openURL('tel:' + number);
          }}
        />);

        shareMessage.push(number);
      });

    buttons.push(<Button
      primary style={styles.button}
      key="contact" title={i18n.t("Contact")} icon="address-card-o"
      onPress={async () => {
        try {
          await ensurePermissions(Permissions.CONTACTS);
          Contacts.presentFormAsync(null, createExpoContact(contact));
        } catch(e) {
          console.log('Exception', e);
          return null;
        }
      }}
    />);

    return <View style={styles.container}>
      {buttons}
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  button: {
    marginTop: 10,
  },
});
