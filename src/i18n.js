class Translations {

  translations = {};
  enabledLanguages = {};
  currentLanguage = {};
  pluralFormula = '';

  /**
   * t('You have @count @items', countVar, {'@items': 'snail(s)'}, 'You have no snails')
   * t('You have @count object', countVar, {}, 'You have no objects')
   * t('The current version is @version', null, {'@version': 'v1.2.3'})
   */
  t = (string, count = null, replacements = {}, zeroString = null) => {
    let countToken = '@count';

    if (count === 0 && zeroString !== null) {
      string = zeroString;
    }
    else if (count !== null) {
      // Get the plural index for languages with multiple plurals.
      const pluralIndex = eval(this.formula);

      if (pluralIndex > 0) {
        countToken = '@count[' + pluralIndex + ']';
        string = string.replace('@count', countToken);
      }
    }

    let translatedText = this.translations[string] || string;

    // Replace the variables.
    for (let i in replacements) {
      translatedText = translatedText.replace(i, replacements[i]);
    }

    // Replace @count for count value.
    if (count !== null) {
      translatedText = translatedText.replace(countToken, count);
    }
    return translatedText;
  };

  updateLanguages = async (getState) => {
    this.enabledLanguages = await getState().languages.enabled;
  }

  setCurrentLanguages = async (getState) => {
    this.currentLanguage = await getState().languages.currentLanguage;
    this.pluralFormula = this.enabledLanguages[this.currentLanguage].formula;
  }

  updateTranslations = (getState) => {
    this.translations = getState().languages.translations || {};
  }

  // Inspect component for language change and force update if necessary.
  forceUpdate = (component, title) => {
    if (component.props.currentLanguage !== component.state.currentLanguage) {
      component.setState({currentLanguage: component.props.currentLanguage});
      component.props.navigation.setParams({
        i18nTitle: i18n.t(title),
      });
      component.forceUpdate();
    }
  }

  reduxMiddleware = ({ getState }) => {
    return next => async action => {
      const returnValue = next(action);
      if (action.type == "UPDATE_TRANSLATIONS") {
        this.updateTranslations(getState);
      }
      if (action.type == "UPDATE_LANGUAGES") {
        this.updateLanguages(getState);
      }
      if (action.type == "SET_CURRENT_LANGUAGE") {
        this.setCurrentLanguages(getState);
      }
      return returnValue;
    }
  }
}
const i18n = new Translations();

export default i18n;
