// @flow

import type {ObjectRequest} from "../persist";

export interface GroupObject {
  updated: number,
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  id: number,
  title: string,
}

class Group {
  static getChildren(group: GroupObject, deep: boolean = false): Array<ObjectRequest> {
    return [];
  }
}

export default Group;
