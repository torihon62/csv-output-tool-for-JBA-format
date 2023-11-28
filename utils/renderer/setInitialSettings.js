const setInitialSettings = (initialSettings) => {
  if (consts === null) return;
  consts.SETTING_FORM_ENV.forEach(env => {
    const initialSetting = initialSettings.find(s => s.key === env.formItemName);
    if(!initialSetting) return;

    const elem = document.getElementById(env.formItemId);
    if (elem) {
      if (elem.options && initialSetting.value !== '') {
        const options = elem.options;
        options[parseInt(initialSetting.value)].selected = true;
      } else {
        elem.value = initialSetting.value;
      }
    }
  });
};
