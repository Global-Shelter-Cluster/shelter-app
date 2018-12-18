// @flow

import React from 'react';
import type {ObjectRequest} from "../persist";
import clone from "clone";
import t from 'tcomb-form-native';
import HTML from 'react-native-render-html';
import type {tabsDefinition} from "../components/Tabs";

export type WebformObject = {
  _last_read?: number,
  _mode: "public",
  _persist?: true,
  id: number,
  groups?: Array<number>,
  title: string,
  form: Array<WebformPage>,
}

type WebformPage = {
  title?: string,
  fields: Array<WebformField>,
}

type WebformField = WebformTextField | WebformMarkupField | WebformTextAreaField;

type WebformTextField = {
  type: "textfield",
  key: string,
  name: string,
  required?: true,
  default?: string,
  description?: string,
}

type WebformTextAreaField = {
  type: "textarea",
  key: string,
  name: string,
  required?: true,
  default?: string,
  description?: string,
}

type WebformMarkupField = {
  type: "markup",
  value: string, // HTML
}

export default class Webform {
  static getRelated(webform: WebformObject): Array<ObjectRequest> {
    const ret = [];

    if (webform.groups !== undefined)
      ret.push(...webform.groups.map(id => ({type: "group", id: id})));

    return ret;
  }

  static getFiles(): [] {
    return [];
  }
}

/**
 * Gets values by field key for the given page.
 * Returns defaults as defined in the webform if values are not found in the allValues property.
 * The allValues property is keyed by page number, e.g. for a form with 2 pages:
 *
 *   [{firstName:"John",lastName:"Smith"}, {favoriteColor:"red"}]
 *
 * In this example, getWebformPageValues(webform, allValues, 1) will return `{favoriteColor:"red"}`.
 */
export const getWebformPageValues = (webform: WebformObject, allValues: Array<{}>, page: number): {} => {
  if (allValues[page] !== undefined)
    return allValues[page];

  const ret = {};

  for (const field of webform.form[page].fields) {
    switch (field.type) {
      case "textfield":
        if (field.default !== undefined) {
          ret[field.key] = field.default;
        }
        break;
      case "textarea":
        if (field.default !== undefined) {
          ret[field.key] = field.default;
        }
        break;
      case "number":
        if (field.default !== undefined) {
          ret[field.key] = field.default;
        }
        break;
      case "date":
        if (field.default !== undefined) {
          ret[field.key] = new Date(field.default);
        }
        break;
      case "time":
        if (field.default !== undefined) {
          let time = new Date();
          time.setHours(field.hours, field.minutes, 0);
          ret[field.key] = time;
        }
        break;
      case "select":
        break;
    }
  }

  return ret;
};

/**
 * Sets the values for the given page on allValues (see getWebformPageValues()).
 * Returns a copy of allValues, without modifying the original.
 */
export const setWebformPageValues = (allValues: Array<{}>, page: number, values: {}) => {
  const ret = clone(allValues);
  ret[page] = values;
  return ret;
};

export const getWebformPageTabs = (webform: WebformObject, page: number, pagesVisited: {[string]: true}): tabsDefinition => {
  const ret: tabsDefinition = {};
  for (let i: number = 0; i < webform.form.length; i++) {
    const label = webform.form[i].title
      ? webform.form[i].title
      : (i === 0 ? 'Start' : '');

    const temp = {
      label,
      icon: 'circle-o',
    };

    if (pagesVisited[i] !== undefined)
      temp.icon = 'circle';

    ret[i] = temp; // all array keys are strings, so `i` gets converted here
  }
  return ret;
};

const markupTemplate = locals => <HTML html={locals.label}/>;

/**
 * Generate the stuff needed for the tcomb-form-native library to render a single form page.
 */
export const getWebformTCombData = (webform: WebformObject, page: number, setFocus: (key: string) => {}, onSubmit: () => {}): {
  type: {},
  fieldOptions: {},
  order: Array<string>,
} => {
  const ret = {type: {}, fieldOptions: {}, order: []};

  const formatDate = (date) => new Date(date).toDateString();
  const formatTime = (date) => new Date(date).toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit', hour12: false});

  let lastEditableField: null | string = null;
  let markupElementCounter: number = 0;
  for (const field of webform.form[page].fields) {
    console.log(field);
    switch (field.type) {
      case "textarea":
        if (field.required) {
          ret.type[field.key] = t.String;
        }
        else {
          ret.type[field.key] = t.maybe(t.String);
        }

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
          multiline: true,
          numberOfLines: 5,
          // @TODO
          // stylesheet: {
          //   textbox: {
          //     normal: {
          //       height: 100
          //     }
          //   }
          // }
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }
        ret.fieldOptions[field.key].text = {
          type: 'textarea'
        };

        ret.order.push(field.key);

        // Good UX: on the last editable field, make the keyboard have a "next" button, which moves
        // you to this field.
        if (lastEditableField !== null) {
          ret.fieldOptions[lastEditableField].returnKeyType = "next";
          ret.fieldOptions[lastEditableField].onSubmitEditing = setFocus(field.key);
        }
        lastEditableField = field.key;
        break;

      case "textfield":

        if (field.required)
          ret.type[field.key] = t.String;
        else
          ret.type[field.key] = t.maybe(t.String);

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }
        ret.order.push(field.key);

        // Good UX: on the last editable field, make the keyboard have a "next" button, which moves
        // you to this field.
        if (lastEditableField !== null) {
          ret.fieldOptions[lastEditableField].returnKeyType = "next";
          ret.fieldOptions[lastEditableField].onSubmitEditing = setFocus(field.key);
        }
        lastEditableField = field.key;
        break;

      case "time":
        if (field.required)
          ret.type[field.key] = t.Date;
        else
          ret.type[field.key] = t.maybe(t.Date);

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
          mode: 'time',
          config: {
            format: formatTime
          }
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }
        ret.order.push(field.key);

        // Good UX: on the last editable field, make the keyboard have a "next" button, which moves
        // you to this field.
        if (lastEditableField !== null) {
          ret.fieldOptions[lastEditableField].returnKeyType = "next";
          ret.fieldOptions[lastEditableField].onSubmitEditing = setFocus(field.key);
        }
        lastEditableField = field.key;
        break;

      case "date":
        if (field.required)
          ret.type[field.key] = t.Date;
        else
          ret.type[field.key] = t.maybe(t.Date);

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
          mode: 'date',
          config: {
            format: formatDate
          }
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }

        ret.order.push(field.key);

        // Good UX: on the last editable field, make the keyboard have a "next" button, which moves
        // you to this field.
        if (lastEditableField !== null) {
          ret.fieldOptions[lastEditableField].returnKeyType = "next";
          ret.fieldOptions[lastEditableField].onSubmitEditing = setFocus(field.key);
        }
        lastEditableField = field.key;
        break;
      case "number":
        if (field.required)
          ret.type[field.key] = t.Number;
        else
          ret.type[field.key] = t.maybe(t.Number);

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }
        ret.order.push(field.key);

        // Good UX: on the last editable field, make the keyboard have a "next" button, which moves
        // you to this field.
        if (lastEditableField !== null) {
          ret.fieldOptions[lastEditableField].returnKeyType = "next";
          ret.fieldOptions[lastEditableField].onSubmitEditing = setFocus(field.key);
        }
        lastEditableField = field.key;
        break;

      case "select":
        console.log(field);
        ret.type[field.key] = t.enums(field.options);

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }
        ret.order.push(field.key);

        // Good UX: on the last editable field, make the keyboard have a "next" button, which moves
        // you to this field.
        if (lastEditableField !== null) {
          ret.fieldOptions[lastEditableField].returnKeyType = "next";
          ret.fieldOptions[lastEditableField].onSubmitEditing = setFocus(field.key);
        }
        lastEditableField = field.key;
        break;

      case "markup": // not very pretty but gets the job done
        const key = "_markup_" + (markupElementCounter++);

        ret.type[key] = t.maybe(t.String);
        ret.fieldOptions[key] = {
          label: field.value,
          template: markupTemplate,
        };
        ret.order.push(key);
        break;
    }
  }

  if (lastEditableField !== null) {
    const isLastPage = page === (webform.form.length - 1);

    if (isLastPage) {
      ret.fieldOptions[lastEditableField].returnKeyType = "send";
      // TODO
    } else {
      ret.fieldOptions[lastEditableField].returnKeyType = "next";
    }

    ret.fieldOptions[lastEditableField].onSubmitEditing = onSubmit;
  }

  ret.type = t.struct(ret.type);
  // console.log(ret);
  return ret;
};
