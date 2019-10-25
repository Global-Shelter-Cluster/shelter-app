// @flow

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {TableParagraph as TableParagraphType, TableParagraphCell} from "../../model/paragraphs";
import ParagraphTitle from "./ParagraphTitle";
import {Row, Table, TableWrapper, Cell} from 'react-native-table-component';
import vars from "../../vars";
import {hairlineWidth} from "../../util";
import * as WebBrowser from 'expo-web-browser';

/**
 * Calculates column widths based on the string length of the data.
 *
 * @param {string[][]} data
 * @return {Array<number>}
 */
const calculateColumnWidths = data => {
  const maxLengths = [];

  for (const row of data) {
    while (maxLengths.length < row.length)
      maxLengths.push(0);

    for (const i in row)
      maxLengths[i] = Math.max(maxLengths[i], row[i].length);
  }

  // Do some mathematical magic so that the column widths are somewhat normalized
  return maxLengths
    .map(length => Math.max(5, length))
    .map(length => Math.pow(length, .8));
};

/**
 * @param {TableParagraphCell} cell
 * @return {string}
 */
const extractTextValue = cell => {
  if (cell.title !== undefined)
    return cell.title;
  else if (cell.url !== undefined)
    return cell.url;
  return '';
};

/**
 *
 * @param {TableParagraphCell} cell
 * @param {number} cellIndex
 * @return {*}
 */
const renderCell = (cell, cellIndex, flex) => {
  let data = cell.title !== undefined ? cell.title : cell.url;

  if (cell.url !== undefined)
    data = <TouchableOpacity
      onPress={() => WebBrowser.openBrowserAsync(cell.url)}
    >
      <Text style={styles.link}>
        {cell.title ? cell.title : cell.url}
      </Text>
    </TouchableOpacity>;

  return <Cell
    key={cellIndex}
    flex={flex}
    data={data}
    textStyle={styles.text}
  />;
};

const TableParagraph = ({paragraph}: {paragraph: TableParagraphType}) => {
  const rawData = [];
  if (paragraph.headers)
    rawData.push(paragraph.headers);
  if (paragraph.rows)
    paragraph.rows.map(row => rawData.push(row.map(extractTextValue)));

  const flexArr = calculateColumnWidths(rawData);

  const content = [];

  if (paragraph.headers)
    content.push(<Row
      key="headers"
      flexArr={flexArr}
      data={paragraph.headers}
      style={styles.header}
      textStyle={styles.headerText}
    />);

  if (paragraph.rows !== undefined)
    paragraph.rows.map((row, rowIndex) => {
      content.push(<TableWrapper
        key={rowIndex}
        style={styles.row}
      >
        {row.map((cell, cellIndex) => renderCell(cell, cellIndex, flexArr[cellIndex]))}
      </TableWrapper>);
    });

  return <View style={styles.container}>
    <ParagraphTitle paragraph={paragraph}/>
    <Table
    >
      {content}
    </Table>
  </View>;
};

export default TableParagraph;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    backgroundColor: vars.SHELTER_RED,
  },
  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    paddingHorizontal: 5,
    paddingVertical: 7,
  },
  row: {
    borderColor: vars.LIGHT_GREY,
    borderBottomWidth: hairlineWidth,
    flexDirection: "row",
  },
  text: {
    fontSize: 12,
    padding: 5,
  },
  link: {
    fontSize: 12,
    padding: 5,
    textDecorationLine: "underline",
    color: "#245dc1",
  },
});
