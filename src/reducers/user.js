// @flow

export interface UserData {
  id: number,
  updated: number,
  groups: Array<number>,
}

export interface User {
  isLoading: boolean,
  data?: UserData,
}

const initial: User = {
  isLoading: true,
};

const user = (state: User = initial, action: { type: string }) => {
  switch (action.type) {
    default:
      return state
  }
};

export default user;
