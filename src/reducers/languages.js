const initialState = {
  translations: {},
  enabled: {
    en: {
      name: 'English',
      native: 'English',
      formula: ''
    }
  },
  currentLanguage: 'en',
};

const translationReducer = (state = initialState, action) => {
  switch(action.type) {
    case "UPDATE_TRANSLATIONS":
      return {
        ...state,
        translations: action.translations || state.translations
      };
    case "UPDATE_LANGUAGES":
      return {
        ...state,
        enabled: action.languages || state.enabled
      };
    case "SET_CURRENT_LANGUAGE":
      return {
        ...state,
        currentLanguage: action.language || state.currentLanguage
      };
    default:
      return state;
  }

}

export default translationReducer;
