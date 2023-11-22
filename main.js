const { app, ipcMain, BrowserWindow, dialog } = require('electron');
const XLSX = require('xlsx');
const path = require('node:path');

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

ipcMain.handle('read-config', (event) => {

});


ipcMain.handle('select-file', (event) => {
  // renderer プロセスにデータを返す
  const path = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
  return path;
});

ipcMain.handle('read-xlsx', (event, path) => {
  // renderer プロセスにデータを返す
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets['振込先マスタ'];
  const csv = XLSX.utils.sheet_to_csv(sheet);
  const records = csv.split('\n');

  return records.map(record => record.split(','));
});
