// @flow

import React from 'react';
import {View} from 'react-native';
import type {ObjectRequest} from "../persist";
import clone from "clone";
import t from 'tcomb-form-native';
import HTML from 'react-native-render-html';
import type {tabsDefinition} from "../components/Tabs";
import ImageFactory from "../components/tcomb/ImageFactory";
import MultiselectFactory from "../components/tcomb/MultiselectFactory";
import {Permissions} from "expo";
import {textareaStylesheet} from "../styles/formStyles";
import GeolocationFactory from "../components/tcomb/GeolocationFactory";
import i18n from "../i18n";

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

type WebformField =
  WebformTextField
  | WebformMarkupField
  | WebformTextAreaField
  | WebformFileField
  | WebformGeolocationField;

type conditional = {
  field: string,
  value: string,
  op?: "eq" | "gt" | "gte" | "neq",
};

type WebformTextField = {
  type: "textfield",
  key: string,
  name: string,
  required?: true,
  default?: string,
  description?: string,
  visible: boolean,
  conditional: conditional,
}

type WebformTextAreaField = {
  type: "textarea",
  key: string,
  name: string,
  required?: true,
  default?: string,
  description?: string,
  visible: boolean,
  conditional: conditional,
}

type WebformFileField = {
  type: "file",
  key: string,
  name: string,
  required?: true,
  description?: string,
  file_type: "image", // TODO: maybe add others, for now "image" means an image widget (camera / camera roll)
  file_extensions?: Array<string>, // e.g. ["gif", "jpg", "jpeg", "png"]
  visible: boolean,
  conditional: conditional,
}

type WebformGeolocationField = {
  type: "geolocation",
  key: string,
  name: string,
  required?: true,
  description?: string,
  visible: boolean,
  conditional: conditional,
  current_coordinates?: true,
}

type WebformMarkupField = {
  type: "markup",
  value: string, // HTML
  visible: boolean,
  conditional: conditional,
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
 * Calculates which permissions are required to fill the given form, based on its fields.
 * For example, if the form has an image field, we need the "camera" and "camera roll" permissions.
 *
 * @returns Array<string>
 */
export const getPermissionsForWebform = (webform: WebformObject) => {
  const list = {}; // e.g. {"camera": true, "calendar": true}

  for (const page of webform.form) {
    for (const field of page.fields) {
      switch (field.type) {
        case "file":
          list[Permissions.CAMERA_ROLL] = true;
          list[Permissions.CAMERA] = true;
          break;

        case "geolocation":
          list[Permissions.LOCATION] = true;
          break;

      }
    }
  }

  return Object.keys(list); // Array of strings
};

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
  // console.log('CAM setWebformPageValues ', ret);

  return ret;
};

export const getWebformPageTabs = (webform: WebformObject, page: number, pagesVisited: { [string]: true }): tabsDefinition => {
  const ret: tabsDefinition = {};
  for (let i: number = 0; i < webform.form.length; i++) {
    const label = webform.form[i].title
      ? webform.form[i].title
      : (i === 0 ? i18n.t('Start') : '');

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

/**
 * Evaluate any conditional rules against the current form values.
 */
const fieldIsVisible = (field, flattenedValues) :boolean => {
  // No conditional rules - field is normaly visible.
  if (field.conditional == undefined) {
    return true;
  }

  // Since there are no values, conditions cannot be met.
  if (Object.keys(flattenedValues).length == 0) {
    return false;
  }

  let visible = true;

  // AND condition
  if (field.conditional.or == undefined) {
    // If any of the rules is not met, set visible to false.
    field.conditional.rules.forEach((test) => {
      if (flattenedValues[test.field] instanceof Array && flattenedValues[test.field].indexOf(test.value) == -1) {
        visible = false;
      }
    });
  }

  // OR condition
  if (field.conditional.or == true) {
    // If any of the rules is met, set visible to true.
    visible = false;
    field.conditional.rules.forEach((test) => {
      if (flattenedValues[test.field] instanceof Array && flattenedValues[test.field].indexOf(test.value) > -1) {
        visible = true;
      }
    });
  }

  return visible;
}

const markupTemplate = locals => <View style={{marginBottom: 20}}><HTML html={locals.label}/></View>;

/**
 * Generate the stuff needed for the tcomb-form-native library to render a single form page.
 */
export const getWebformTCombData = (webform: WebformObject, page: number, setFocus: (key: string) => {}, onSubmit: () => {}, flattenedValues: {}): {
  type: {},
  fieldOptions: {},
  order: Array<string>,
} => {
  const ret = {type: {}, fieldOptions: {}, order: []};

  const formatDate = (date) => new Date(date).toDateString();
  const formatTime = (date) => new Date(date).toLocaleTimeString(navigator.language, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  let lastKeyboardField: null | string = null;
  let lastField: null | string = null;



  // Good UX: this function helps connect the previous field's "enter key" to the given field so it moves focus automatically.
  const connectKeyboardNextKey = (current) => {
    const k = lastKeyboardField;
    lastKeyboardField = current;

    if (k === null)
      return; // There is no previous field, nothing to do.

    if (k !== lastField)
      return; // The last field isn't a keyboard field, so don't connect them.

    if (
      ret.fieldOptions[k] !== undefined
      && ret.fieldOptions[k].text !== undefined
      && ret.fieldOptions[k].text.type === 'textarea'
    )
      return; // Previous field is "textarea" so it needs its enter key to do normal newlines.

    // All good, let's make the connection.
    ret.fieldOptions[k].returnKeyType = "next";
    ret.fieldOptions[k].onSubmitEditing = setFocus(current);
  };

  let markupElementCounter: number = 0;
  for (const field of webform.form[page].fields) {
    field.visible = fieldIsVisible(field, flattenedValues);

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
          stylesheet: textareaStylesheet,
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description;
        }
        ret.fieldOptions[field.key].text = {
          type: 'textarea'
        };

        ret.order.push(field.key);

        connectKeyboardNextKey(field.key);
        lastField = field.key;
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

        connectKeyboardNextKey(field.key);
        lastField = field.key;
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

        lastField = field.key;
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

        lastField = field.key;
        break;

      case "number":
        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
        };

        // Validation functions.
        let refinementFunctions = [];
        let refinementDescriptions = [];
        if (field.max !== undefined) {
          refinementFunctions.push((n) => n <= field.max);
          refinementDescriptions.push(`Max ${field.max}.`);
        }

        if (field.min !== undefined) {
          refinementFunctions.push((n) => n >= field.min);
          refinementDescriptions.push(`Min ${field.min}.`);
        }

        if (field.integer !== undefined) {
          refinementFunctions.push((n) => Number.isInteger(n));
          refinementDescriptions.push(i18n.t("Integer"));
        }

        const refinements = (n) => {
          for (let i in refinementFunctions) {
            if (!refinementFunctions[i](n)) return false;
          }
          return true;
        };

        if (field.required)
          ret.type[field.key] = t.refinement(t.Number, refinements, 'Validation');
        else
          ret.type[field.key] = t.maybe(t.refinement(t.Number, refinements, 'Validation'));

        ret.fieldOptions[field.key].help = refinementDescriptions.join(' ');
        if (field.description !== undefined) {
          ret.fieldOptions[field.key].help = field.description + ret.fieldOptions[field.key].help;
        }
        ret.order.push(field.key);
        connectKeyboardNextKey(field.key);
        lastField = field.key;
        break;

      case "select":

        if (field.required)
          ret.type[field.key] = t.list(t.String);
        else
          ret.type[field.key] = t.maybe(t.list(t.String));

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
          single: !(field.multiple),
          choices: field.options,
          factory: MultiselectFactory,
          config: {},
          hidden: true,
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].config.help = field.description;
        }

        ret.order.push(field.key);

        connectKeyboardNextKey(field.key);
        lastField = field.key;
        break;

      case "file":
        switch (field.file_type) {
          case "image":
            if (field.required)
              ret.type[field.key] = t.String;
            else
              ret.type[field.key] = t.maybe(t.String);

            ret.fieldOptions[field.key] = {
              label: field.name + (field.required ? ' *' : ''),
              factory: ImageFactory,
              config: {title: field.name + (field.required ? ' *' : '')},
            };

            if (field.description !== undefined) {
              ret.fieldOptions[field.key].config.help = field.description;
            }
            ret.order.push(field.key);

            lastField = field.key;
            break;

          default:
            console.warn("Widget not implemented for this field type", field);
        }
        break;

      case "geolocation":
        if (field.required)
          ret.type[field.key] = t.struct({lat: t.Number, lon: t.Number});
        else
          ret.type[field.key] = t.maybe(t.struct({lat: t.Number, lon: t.Number}));

        ret.fieldOptions[field.key] = {
          label: field.name + (field.required ? ' *' : ''),
          factory: GeolocationFactory,
          config: {
            title: field.name + (field.required ? ' *' : ''),
            current_coordinates: field.current_coordinates ? true : false,
          },
        };

        if (field.description !== undefined) {
          ret.fieldOptions[field.key].config.help = field.description;
        }
        ret.order.push(field.key);

        lastField = field.key;
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

      default:
        console.warn("Widget not implemented for this field type", field);
    }

    // @TODO consider setting up default values for all field options instead of individually in switch.
    if (ret.fieldOptions[field.key] != undefined) {
      ret.fieldOptions[field.key].hidden = !field.visible;
    }

  }

  if (
    lastKeyboardField !== null
    && lastKeyboardField === lastField // Only do this if the last field has a keyboard
  ) {
    const isLastPage = page === (webform.form.length - 1);

    ret.fieldOptions[lastKeyboardField].returnKeyType = isLastPage ? "send" : "next";
    ret.fieldOptions[lastKeyboardField].onSubmitEditing = onSubmit;
  }

  ret.type = t.struct(ret.type);
  return ret;
};
