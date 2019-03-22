
const translate = (text, count = null, replacements = {}, zero_string = null) => {
  let count_replace = '@count';

  // If count = 0 and we provide a string for when count is 0.
  if (count === 0 && zero_string !== null) {
    text = zero_string;
  }
  else if (count !== null) {
    // Get the plural index for languages with multiple plurals.
    const formula = G.languages[G.language].formula;
    const $n = count;
    const pluralIndex = eval(formula);

    if (pluralIndex > 0) {
      count_replace = '@count[' + pluralIndex + ']';
    }

    // Replace count in text first.
    text = text.replace('@count', count_replace);
  }

  // Replace the text.
  const dictionary = G.dictionary[G.language];
  let translated_text = dictionary[text] || text;

  for (let i in replacements) {
    translated_text = translated_text.replace(i, replacements[i]);
  }

  // Replace @count for count.
  if (count !== null) {
    translated_text = translated_text.replace(count_replace, count);
  }

  return translated_text;
}

class Translations {

  translations = {};

  t = (string) => {
    const translation = this.translations[string];
    return translation ? translation: string;
  };

  updateLanguages = (getState) => {
    //console.log(getState().languages.enabled);
  }

  updateTranslations = (getState) => {
    this.translations = getState().languages.translations;
  }

  reduxMiddleware = ({ getState }) => {
    return next => async action => {
      const returnValue = next(action);
      if (action.type == "UPDATE_TRANSLATIONS") {
        this.updateTranslations(getState);
      }
      // if (action.type == "UPDATE_LANGUAGES") {
      //   this.updateLanguages(getState);
      // }
      return returnValue;
    }
  }
}
const i18n = new Translations();

export default i18n;
