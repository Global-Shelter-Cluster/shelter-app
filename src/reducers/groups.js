// @flow

export interface Group {
  id: number,
  type: "response" | "geographic-region" | "hub" | "strategic-advisory" | "working-group",
  title: string,
}

const groups = (state: Array<Group> = [], action: { type: string }) => {
  switch (action.type) {
    default:
      return state
  }
};

export default groups;
