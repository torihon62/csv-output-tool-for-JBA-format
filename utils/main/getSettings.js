const consts = require('../../consts');
const Store = require('electron-store');

const store = new Store();

const getSettings = () => {
  let settings = [];
  consts.SETTING_FORM_ENV.forEach(env => {
    settings.push({ 
      key: env.formItemName,
      value: store.has(env.formItemName) ? store.get(env.formItemName) : '',
    });
  });
  return settings;
}

const getSettingsHashTable = () => {
  let settings = {};
  consts.SETTING_FORM_ENV.forEach(env => {
    settings[env.formItemName] = store.has(env.formItemName) ? store.get(env.formItemName) : '';
  });
  return settings;
}

module.exports = {
  getSettings,
  getSettingsHashTable,
}
