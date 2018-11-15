// @flow

import type {GlobalObject} from "./global";

export const generateIndexName = (global: GlobalObject, name: string) => global.algolia_prefix + name.charAt(0).toUpperCase() + name.substr(1);
