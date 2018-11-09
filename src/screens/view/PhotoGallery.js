// @flow

import React from 'react';
import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import ContextualNavigation from "../../components/ContextualNavigation";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import Button from "../../components/Button";
import vars from "../../vars";
import HTML from 'react-native-render-html';
import Loading from "../../components/Loading";
import {hairlineWidth} from "../../util";
import type {PublicPhotoGalleryPageObject} from "../../model/page";
import Collapsible from "../../components/Collapsible";
import moment from "moment";
import ImagesWithSlideshow from "../../components/ImagesWithSlideshow";

export default ({online, page, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  page: PublicPhotoGalleryPageObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'page', id: page.id}}))
    return <Button
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  const sections = [];

  if (page.sections) {
    page.sections.map((section, sectionIndex) => {
      if (!section.photos)
        return;

      const images = section.photos.map(photo => ({
        title: photo.caption,
        caption: photo.author + (photo.taken ? moment(photo.taken).utc().format(' • D MMM YYYY') : ''),
        thumbnail: photo.url_thumbnail,
        url: photo.url_medium,
      }));

      if (section.title) {
        sections.push(<Collapsible key={sectionIndex} title={section.title} isOpen noHorizontalMargins
                                   badge={section.photos ? section.photos.length : null}>
          {section.description ? <Text style={styles.description}>{section.description}</Text> : null}
          <ImagesWithSlideshow images={images}/>
        </Collapsible>)
      } else {
        sections.push(<View key={sectionIndex}>
          {section.description ? <Text style={styles.description}>{section.description}</Text> : null}
          <ImagesWithSlideshow images={images}/>
        </View>)
      }
    });
  }

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <Text style={styles.title}>{page.title}</Text>
      <ContextualNavigation object={page}/>
      {page.body !== undefined && page.body
        ? <View style={{marginHorizontal: 10}}><HTML html={page.body}/></View>
        : null}
      {sections}
    </ScrollView>
    {/*<DocumentActionsContainer document={document}/>*/}
  </View>
    ;
}

const styles = StyleSheet.create({
  description: {
    marginHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 10,
    color: vars.SHELTER_RED,
  },
  secondary: {
    color: vars.SHELTER_GREY,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  preview: {
    width: 120,
    height: 120,
    resizeMode: "cover",
    borderWidth: hairlineWidth,
    borderColor: vars.SHELTER_GREY,
    marginRight: 10,
  },
});
