// @flow

import React from 'react';
import {Modal, StyleSheet, TouchableOpacity, View, Image, Dimensions} from 'react-native';
import {FontAwesome} from '@expo/vector-icons';
import vars from "../vars";
import Slideshow from './Slideshow';

type image = {
  title: string | null,
  caption: string | null,
  thumbnail: string,
  url: string,
}

type Props = {
  images: Array<image>,
};

type State = {
  isModalOpen: boolean,
  modalPosition: number,
}

export default class ImagesWithSlideshow extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalPosition: 0,
    };
  }

  render() {
    const thumbnails = [];

    this.props.images.map((image, imageIndex) => {
      thumbnails.push(<TouchableOpacity
        key={imageIndex}
        onPress={() => this.setState({isModalOpen: true, modalPosition: imageIndex})}
      >
        <Image
          style={styles.thumbnail}
          source={{uri: image.thumbnail}}
        />
      </TouchableOpacity>);
    });

    const {height} = Dimensions.get('window');

    let extraParams = {
      indicatorSelectedColor: "transparent",
      indicatorColor: "transparent",
    };
    if (thumbnails.length === 1)
      extraParams = {
        scrollEnabled: false,
        indicatorSelectedColor: "transparent",
        arrowSize: 0,
      };

    return <View style={styles.container}>
      {thumbnails}
      {this.state.isModalOpen
        ? <Modal
          animationType="slide"
          visible={this.state.isModalOpen}
          onRequestClose={() => this.setState({isModalOpen: false})}
        >
          <Slideshow
            height={height}
            dataSource={this.props.images}
            position={this.state.modalPosition}
            onPositionChanged={position => this.setState({modalPosition: position})}
            {...extraParams}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => this.setState({isModalOpen: false})}
          >
            <FontAwesome name={"times"} size={26} color={vars.SHELTER_DARK_BLUE}/>
          </TouchableOpacity>
        </Modal>
        : null
      }
    </View>;
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 9,
    position: "relative",
  },
  thumbnail: {
    width: 115,
    height: 115,
    margin: 1,
  },
  closeButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: vars.SHELTER_LIGHT_BLUE,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    shadowOpacity: .5,
    elevation: 5, // Shadow works for iOS, elevation for Android
  },
});
