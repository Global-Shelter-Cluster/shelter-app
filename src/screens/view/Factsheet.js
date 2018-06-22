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
  TouchableOpacity,
  View
} from 'react-native';
import type {PublicFactsheetObject} from "../../model/factsheet";
import ContextualNavigation from "../../components/ContextualNavigation";
import ExpandableFitImageContainer from "../../containers/ExpandableFitImageContainer";
import FactsheetNavigationContainer from "../../containers/FactsheetNavigationContainer";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import Button from "../../components/Button";
import vars from "../../vars";
import HTML from 'react-native-render-html';
import Loading from "../../components/Loading";
import Collapsible from "../../components/Collapsible";

export default ({online, factsheet, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  factsheet: PublicFactsheetObject,
  loaded: boolean,
  refresh: () => {},
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'factsheet', id: factsheet.id}}))
    return <Button
      onPress={refresh}
      title="Error loading, please check your connection and try again"
    />;
  if (!loaded)
    return <Loading/>;

  return <View style={{flex: 1}}>
    <ScrollView
      style={{flex: 1}}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
    >
      <FactsheetNavigationContainer factsheet={factsheet}/>
      <ContextualNavigation object={factsheet}/>
      <View>
        <ExpandableFitImageContainer source={{uri: factsheet.image}} full={factsheet.full_image}/>
        {factsheet.photo_credit !== undefined && <Text style={styles.photo_credit}>{factsheet.photo_credit}</Text>}
      </View>
      <View style={styles.highlights}>
        <HTML html={factsheet.highlights}/>
      </View>
      {factsheet.map !== undefined && <Collapsible title="Map" separatorAndMargins>
        <ExpandableFitImageContainer source={{uri: factsheet.map}} full={factsheet.full_map}/>
      </Collapsible>}
      {factsheet.need_analysis !== undefined && <Collapsible title="Need analysis" separatorAndMargins>
        <HTML html={factsheet.need_analysis}/>
      </Collapsible>}
      {factsheet.response !== undefined && <Collapsible title="Response" separatorAndMargins>
        <HTML html={factsheet.response}/>
      </Collapsible>}
      {factsheet.gaps_challenges !== undefined && <Collapsible title="Gaps / challenges" separatorAndMargins>
        <HTML html={factsheet.gaps_challenges}/>
      </Collapsible>}
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  info: {
    flexDirection: "row",
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 10,
    marginBottom: 0,
    color: vars.SHELTER_RED,
  },
  image: {
    width: "100%",
    height: 100,
    resizeMode: "cover",
  },
  photo_credit: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 10,
    color: "white",
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  highlights: {
    margin: 10,
  },
});
