const { app, ipcMain, BrowserWindow, dialog } = require('electron');
const { setTimeout } = require('timers/promises');
const Store = require('electron-store');
const XLSX = require('xlsx');
const path = require('node:path');
const fs = require('fs');
const Iconv = require('iconv-lite');

const consts = require('./consts');
const settingUtil = require('./utils/main/getSettings');
const bankcodejp = require('./utils/main/bankcodejp');

const store = new Store();

/**
 * アプリ起動時のお作法
 */
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  win.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();

  // for Mac
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  });  
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


/**
 * 初期処理
 */
ipcMain.handle('import-consts', (event) => {
  return consts;
});

/**
 * 設定ファイル関連
 */
ipcMain.handle('read-settings', (event) => {
  return settingUtil.getSettings();
});

ipcMain.handle('read-settings-hash-table', (event) => {
  return settingUtil.getSettingsHashTable();
});

ipcMain.handle('save-settings', (event, payload) => {
  consts.SETTING_FORM_ENV.forEach(env => {
    store.set(env.formItemName, payload[env.formItemName].trim());
  });
});

ipcMain.handle('select-payee-list', (event) => {
  // renderer プロセスにデータを返す
  const path = dialog.showOpenDialogSync({ properties: ['openFile'] });
  return path;
});

ipcMain.handle('select-csv-dist-directory', (event) => {
  // renderer プロセスにデータを返す
  const path = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
  return path;
});


ipcMain.handle('clear-settings', (event) => {
  store.clear();
});


/**
 * 
 */
ipcMain.handle('select-file', (event) => {
  // renderer プロセスにデータを返す
  const path = dialog.showOpenDialogSync({ properties: ['openFile'] });
  return path;
});

ipcMain.handle('read-xlsx', async (event, path, sheetName, header) => {
  const workbook = XLSX.readFile(path, { type: 'binary', cellText: false, cellDates: true, dense: true });
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { header, raw: false, dateNF: 'yyyy-mm-dd'});
});

ipcMain.handle('make-data-record', async (event, payment, payeeList) => {
  const paymentNo = payment[4];
  const payee = payeeList.find(p => p[0] === paymentNo);
  if (!payee) return [`支払先No${payment[0]}: 振込先マスタに振込先の情報がありません`];

  const bankInfo = await bankcodejp.getBankBranchInfo(payee[2], payee[4]);
  await setTimeout(2000);
  if (!bankInfo.bank || !bankInfo.branches.length) {
    console.log(`code: ${payee[2]}, branch: ${payee[4]}`);
    return [`支店が見つかりませんでした。code: ${payee[2]}, branch: ${payee[4]}`]
  }
  
  return [
    '2',
    payee[2],
    bankInfo.bank.halfWidthKana,
    payee[4],
    bankInfo.branches[0].halfWidthKana,
    '',
    payee[6],
    payee[7],
    payee[8],
    payment[9],
    '',
    '',
    '',
    '',
    '',
    '',
  ];
});


ipcMain.handle('output-csv-exec', async (event, csvArray) => {
  await setTimeout(2000);

  const settings = settingUtil.getSettingsHashTable();
  const csv = csvArray.map(record => record.join(',')).join('\r\n');
  const csvSjis = Iconv.encode(csv, 'Shift_JIS');

  const today = new Date();
  const year = today.getFullYear();
  const month = ("0" + String(today.getMonth() + 1)).slice(-2);
  const day = ("0" + String(today.getDate())).slice(-2);
  const hour = ("0" + String(today.getHours())).slice(-2);
  const minute = ("0" + String(today.getMinutes())).slice(-2);
  const second = ("0" + String(today.getSeconds())).slice(-2);

  const filename = path.join(settings.csvOutputDist, `output_${year}${month}${day}${hour}${minute}${second}.csv`);

  fs.writeFileSync(filename, csvSjis);

  return filename;
});


ipcMain.handle('get-bank-branch-info', async (event, bankCode, branchCode) => {
  // renderer プロセスにデータを返す
  const info = await bankcodejp.getBankBranchInfo(bankCode, branchCode);
  return info;
});
