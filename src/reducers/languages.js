const initialState = {
  // @TODO load from disk, consider https://facebook.github.io/react-native/docs/asyncstorage
  translations: {},
  enabled: {en: {name: 'English'}},
  currentLanguage: 'en',
};

const translationReducer = (state = initialState, action) => {
  switch(action.type) {
    case "UPDATE_TRANSLATIONS":
      return {
        ...state,
        translations: action.translations
      };
    case "UPDATE_LANGUAGES":
      return {
        ...state,
        enabled: action.languages
      };
    case "SET_CURRENT_LANGUAGE":
      return {
        ...state,
        currentLanguage: action.language
      };
    default:
      return state;
  }

}

export default translationReducer;
