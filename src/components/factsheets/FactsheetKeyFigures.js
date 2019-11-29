// @flow

import React from 'react';
import {View} from 'react-native';
import type {FactsheetKeyFigure} from "../../model/factsheet";
import NumberFactsheetKeyFigure from "./NumberFactsheetKeyFigure";
import ChartFactsheetKeyFigure from "./ChartFactsheetKeyFigure";

const FactsheetKeyFigures = ({keyFigures}: { keyFigures: Array<FactsheetKeyFigure> }) => {
  return <View>
    {keyFigures.map((keyFigure, i) => {
      switch (keyFigure.type) {
        case "number":
          return <NumberFactsheetKeyFigure key={i} keyFigure={keyFigure}/>;
        case "chart":
          return <ChartFactsheetKeyFigure key={i} keyFigure={keyFigure}/>;
        default:
          console.warn("Unknown key figure type", keyFigure.type);
      }
    })}
  </View>;
};

export default FactsheetKeyFigures;
