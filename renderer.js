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
  const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));

  const isInvalidDate = (date) => Number.isNaN(date.getTime());
  const progressUpdate = (percent) => {
    const elem = document.getElementById('progress');
    elem.setAttribute('style', `width: ${percent}%`);
  };
  
  (async () => {
    try {
      progressUpdate(0);
      progressModal.show();
      const settings = await window.SettingsContext.readSettingsHashTable();
    
      const paymentListFilePath = document.getElementById('payment-list-file-path').value;
      const paymentListSheetName = document.getElementById('payment-list-sheet-name').value;
      const paymentDate = new Date(document.getElementById('payment-date').value);
      // if (isInvalidDate(paymentDate)) return;
  
      const payeeList = await window.XlsxContext.readXlsx(settings.payeeListFilePath, settings.payeeListFileSheetName, 1);
      const paymentListNotFiltered = await window.XlsxContext.readXlsx(paymentListFilePath, paymentListSheetName, 1);
      const paymentList = paymentListNotFiltered.filter((r, i) => i !== 0).filter(r => r.length);
  
      const month = ("0" + String(paymentDate.getMonth() + 1)).slice(-2);
      const day = ("0" + String(paymentDate.getDate())).slice(-2);
      const paymentDateString = `${month}${day}`;
  
      const headerRecord = [
        '1',
        '21',
        '0',
        settings.consignorCode,
        kanaFullToHalf(settings.consignorName),
        paymentDateString,
        settings.financialInstitutionCode,
        settings.financialInstitutionName,
        settings.financialInstitutionBranchCode,
        settings.financialInstitutionBranchName,
        settings.depositType,
        settings.accountNumber,
        '',
      ];
  
      const dataRecords = [];
      let totalPaymentMoney = 0;
  
      for (let i = 0, l = paymentList.length; i < l; i++) {
        progressUpdate((i / l) * 100);
        const payment = paymentList[i];
        const record = await window.outputCsvContext.makeDataRecord(payment, payeeList);
  
        record[8] = kanaFullToHalf(record[8]);
        totalPaymentMoney += +payment[9];
        dataRecords.push(record);
      }
  
      const trailerRecord = [
        '8',
        dataRecords.length,
        totalPaymentMoney,
        '',
      ];
    
      const endRecord = [
        '9',
        '',
      ];
  
      const csvArray = [
        headerRecord,
        ...dataRecords,
        trailerRecord,
        endRecord,
      ];
      progressUpdate(100);
      const outputCsvPath = await window.outputCsvContext.outputCsvExec(csvArray);
  
      progressModal.hide();
  
      document.getElementById('output-csv-path').innerHTML = outputCsvPath;
      messageModal.show();  
    } catch (e) {
      console.log(e);
      alert(e.message);
    }
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
