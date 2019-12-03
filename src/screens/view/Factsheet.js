// @flow

import React from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import type {PublicFactsheetObject} from "../../model/factsheet";
import ContextualNavigation from "../../components/ContextualNavigation";
import ExpandableFitImageContainer from "../../containers/ExpandableFitImageContainer";
import FactsheetNavigationContainer from "../../containers/FactsheetNavigationContainer";
import equal from 'deep-equal';
import type {lastErrorType} from "../../reducers/lastError";
import vars from "../../vars";
import HTML from '../../components/HTML';
import Loading from "../../components/Loading";
import Collapsible from "../../components/Collapsible";
import MultiLineButton from "../../components/MultiLineButton";
import i18n from "../../i18n";
import TableParagraph from "../../components/paragraphs/TableParagraph";
import DocumentListItemContainer from "../../containers/DocumentListItemContainer";
import SmartLinkContainer from "../../containers/SmartLinkContainer";
import FactsheetKeyFigures from "../../components/factsheets/FactsheetKeyFigures";
import FitImage from "react-native-fit-image";

export default ({online, factsheet, loaded, refresh, loading, lastError}: {
  online: boolean,
  loading: boolean,
  factsheet: PublicFactsheetObject,
  loaded: boolean,
  refresh: () => void,
  lastError: lastErrorType,
}) => {
  if (!loaded && equal(lastError, {type: 'object-load', data: {type: 'factsheet', id: factsheet.id}}))
    return <MultiLineButton
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
      {factsheet.map !== undefined && <Collapsible title={i18n.t("Map")}>
        <ExpandableFitImageContainer source={{uri: factsheet.map}} full={factsheet.full_map}/>
      </Collapsible>}
      {factsheet.coverage_against_targets !== undefined && <Collapsible title={i18n.t("Coverage against targets")} noHorizontalMargins>
        {factsheet.coverage_against_targets.description !== undefined ?
          <Text style={{marginHorizontal: 10}}>
            {factsheet.coverage_against_targets.description}
          </Text> :
          null
        }
        <FitImage source={{uri: factsheet.coverage_against_targets.chart}}/>
      </Collapsible>}
      {factsheet.need_analysis !== undefined && <Collapsible title={i18n.t("Need analysis")}>
        <HTML html={factsheet.need_analysis}/>
      </Collapsible>}
      {factsheet.response !== undefined && <Collapsible title={i18n.t("Response")}>
        <HTML html={factsheet.response}/>
      </Collapsible>}
      {factsheet.gaps_challenges !== undefined && <Collapsible title={i18n.t("Gaps / challenges")}>
        <HTML html={factsheet.gaps_challenges}/>
      </Collapsible>}
      {factsheet.key_figures !== undefined && <Collapsible title={i18n.t("Key figures")} noHorizontalMargins>
        <FactsheetKeyFigures keyFigures={factsheet.key_figures}/>
      </Collapsible>}
      {factsheet.key_dates !== undefined && <Collapsible title={i18n.t("Key dates")} noHorizontalMargins>
        <TableParagraph paragraph={{
          type: "table",
          rows: factsheet.key_dates.map(row => ([
            {title: row.date},
            {title: row.description},
          ])),
        }}/>
      </Collapsible>}
      {factsheet.key_documents !== undefined && <Collapsible title={i18n.t("Key documents")} noHorizontalMargins>
        {factsheet.key_documents.map(id => <DocumentListItemContainer key={id} id={id}/>)}
      </Collapsible>}
      {factsheet.key_links !== undefined && <Collapsible title={i18n.t("Key links")} noHorizontalMargins>
        {factsheet.key_links.map((data, index) => <SmartLinkContainer key={index} {...data}/>)}
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
