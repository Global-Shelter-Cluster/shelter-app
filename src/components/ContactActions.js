// @flow

import React from 'react';
import {Linking, Modal, Platform, Share, StyleSheet, TouchableOpacity, View, WebView} from 'react-native';
import type {ContactObject} from "../model/contact";
import Button from "./Button";
import {FontAwesome} from '@expo/vector-icons';

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
            Expo.MailComposer.composeAsync({recipients: [address]});
            // Linking.openURL('mailto:' + address); // TODO: is this better?
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

    // buttons.push(<Button
    //   primary style={styles.button}
    //   key="add" title="Add contact to phone" icon="plus" onPress={async () => {
    //   const contact = {
    //     [Expo.Contacts.Fields.FirstName]: "Bird",
    //     [Contacts.Fields.LastName]: "Man",
    //     [Contacts.Fields.Company]: "Young Money",
    //   };
    //   const contactId = await Contacts.addContactAsync(contact);
    // }}
    // />);
    //
    // buttons.push(<Button
    //   style={styles.button}
    //   key="share" title="Share" icon="share" onPress={() => {
    //   Share.share({title: contact.name, message: shareMessage.join("\n")})
    // }}
    // />);

    return <View style={styles.container}>
      {buttons}
    </View>;
  }
};

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
