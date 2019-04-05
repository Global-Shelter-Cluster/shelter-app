const initialState = {
  appConfigs: {
    updatedAt: 0,
    lastLocaleUpdate: 0,
  },
};

const configsReducer = (state = initialState, action) => {
  switch(action.type) {
    case "UPDATE_APP_CONFIG":
      return {
        ...state,
        ...action.appRemoteConfig
      };
    default:
      return state;
  }
}

export default configsReducer;
