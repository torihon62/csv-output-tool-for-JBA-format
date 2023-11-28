const setSettingFormItemName = () => {
  if (consts === null) return;
  consts.SETTING_FORM_ENV.forEach(env => {
    const elem = document.getElementById(env.formItemId);
    if (elem) elem.setAttribute('name', env.formItemName);
  });
};
