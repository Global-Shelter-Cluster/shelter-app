
class Translations {

  translations = {};
  test = 'FNORD';

  t = (string) => {
    return 'FNORD';
    const translation = this.translations.translations[string];
    return translation ? translation: string;
  };

  updateTranslations = next => action => {
    if (action.type == 'UPDATE_TRANSLATIONS') {
      console.log('Update the service');
      console.log('state after dispatch', getState().languages.translations);
    }
  }

  // Register this as a redux middleware to be notified of state changes.
  subscribe = ({getState}) => {
    return next => action => {
      if (action.type == 'UPDATE_TRANSLATIONS') {
        this.translations = getState().languages.translations;
        console.log('Update the service');
        console.log('state after dispatch', this.translations);
      }
    };
  };
}
const i18n = new Translations();

export default i18n;
