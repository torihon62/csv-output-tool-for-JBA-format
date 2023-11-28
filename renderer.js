let consts = null;

/**
 * 初期処理
 */
window.onload = () => {
  (async () => {
    consts = await window.initContext.importConsts();
    const settings = await window.SettingsContext.readSettings();
    setSettingFormItemName();
    setInitialSettings(settings);
    if (settings.every(setting => setting.value === '')) {
      showAlert('info', '初期設定が行われていません。設定画面にて設定を行ってください');
    }
  })();
};

document.getElementById('v-pills-home-tab').onclick = (event) => {
  closeAlert();
};

document.getElementById('v-pills-setting-tab').onclick = (event) => {
  closeAlert();
};


/**
 * イベントリスナー
 */
document.getElementById('read-payment-list').onclick = (event) => {
  event.preventDefault();

  (async () => {
    const path = await window.XlsxContext.open();
    document.getElementById('payment-list-file-path').value = path[0];
  })();
};

document.getElementById('csv-output-exec-button').onclick = (event) => {
  const progressModal = new bootstrap.Modal(document.getElementById('progressModal'));
  (async () => {
    progressModal.show();
    
    const isInvalidDate = (date) => Number.isNaN(date.getTime());

    const paymentListFilePath = document.getElementById('payment-list-file-path').value;
    const paymentListSheetName = document.getElementById('payment-list-sheet-name').value;
    const paymentDate = new Date(document.getElementById('payment-date').value);
    if (isInvalidDate(paymentDate)) return;

    const month = ("0" + String(paymentDate.getMonth() + 1)).slice(-2);
    const day = ("0" + String(paymentDate.getDate())).slice(-2);
    const paymentDateString = `${month}${day}`;

    await window.outputCsvContext.outputCsvExec(paymentListFilePath, paymentListSheetName, paymentDateString);

    progressModal.hide();
  })();
};

/** 
 * 設定画面関連イベントリスナー
 */
document.getElementById('setting-form').onsubmit = (event) => {
  event.preventDefault();

  const form = document.forms.settingForm;
  if (form === undefined) {
    showAlert('danger', 'フォーム要素が見つかりませんでした');
    return;
  }

  const elements = form.elements;
  if (elements === undefined) {
    showAlert('danger', 'フォーム子要素が見つかりませんでした');
    return;
  }

  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    showAlert('danger', '入力内容に誤りがあります');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    return;
  }

  (async () => {
    await saveSettings(elements);
    const settings = await window.SettingsContext.readSettings();
    setInitialSettings(settings);
  })();
};

document.getElementById('read-payee-list-file-button').onclick = (event) => {
  (async () => {
    const path = await window.SettingsContext.selectPayeeListFile();
    
    if (path && path !== '') document.getElementById('payee-list-file-path').value = path;
  })();
};

document.getElementById('read-output-file-dist').onclick = (event) => {
  (async () => {
    const path = await window.SettingsContext.selectCsvDistDirectory();
    if (path && path !== '') document.getElementById('csv-output-dist').value = path;
  })();
};

document.getElementById('clear-form-button').onclick = (event) => {
  (async () => {
    await window.SettingsContext.clearSettings();
  })();
};
