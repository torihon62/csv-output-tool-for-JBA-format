const { contextBridge, ipcRenderer } =  require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }
  replaceText('tool-version', process.env.npm_package_version)
});

const outputCsvExec = async (csvArray) => {
  const d = await ipcRenderer.invoke('output-csv-exec', csvArray);
  return d;
};

const makeDataRecord = async (payment, payeeList) => {
  const d = await ipcRenderer.invoke('make-data-record', payment, payeeList);
  return d;
};

const getBankInfo = async (bankCode, branchCode) => {
  const data = await ipcRenderer.invoke('get-bank-branch-info', bankCode, branchCode);
  return data;
};


/**
 * 初期処理
 */
const importConsts = async () => {
  const data = await ipcRenderer.invoke('import-consts');
  return data;
};

/**
 * 設定ファイル関連
 */
const readSettings = async () => {
  const d = await ipcRenderer.invoke('read-settings');
  return d;
};

const readSettingsHashTable = async () => {
  const d = await ipcRenderer.invoke('read-settings-hash-table');
  return d;
};

const saveSettings = async (payload) => {
  await ipcRenderer.invoke('save-settings', payload);
};

const selectPayeeListFile = async (payload) => {
  const d = await ipcRenderer.invoke('select-payee-list');
  return d;
};

const selectCsvDistDirectory = async (payload) => {
  const d = await ipcRenderer.invoke('select-csv-dist-directory');
  return d;
};

const clearSettings = async () => {
  await ipcRenderer.invoke('clear-settings');
};


/**
 * 支払いエクセル読み取り関連
 */
const open = async () => {
  const d = await ipcRenderer.invoke('select-file');
  return d;
};

const readXlsx = async (path, sheetName, header) => {
  const d = await ipcRenderer.invoke('read-xlsx', path, sheetName, header);
  return d;
};

/**
 * コンテキストブリッジ
 */
contextBridge.exposeInMainWorld('initContext', {
    importConsts,
  }
);
contextBridge.exposeInMainWorld('SettingsContext', {
    readSettings,
    readSettingsHashTable,
    saveSettings,
    clearSettings,
    selectPayeeListFile,
    selectCsvDistDirectory,
  }
);
contextBridge.exposeInMainWorld('XlsxContext', {
    open,
    readXlsx,
  }
);
contextBridge.exposeInMainWorld('outputCsvContext', {
    outputCsvExec,
    makeDataRecord,
  }
);
contextBridge.exposeInMainWorld('BankJpContext', {
    getBankInfo,
  }
);
