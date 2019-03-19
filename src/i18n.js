
class Translations {

  translations = {};

  t = (string) => {
    const translation = this.translations[string];
    return translation ? translation: string;
  };

  updateTranslations = (getState) => {
    this.translations = getState().languages.translations;
  }

  reduxMiddleware = ({ getState }) => {
    return next => async action => {
      const returnValue = next(action);
      if (action.type == "UPDATE_TRANSLATIONS") {
        this.updateTranslations(getState);
      }
      return returnValue;
    }
  }
}
const i18n = new Translations();

export default i18n;
