const { app, ipcMain, BrowserWindow, dialog } = require('electron');
const path = require('node:path');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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

ipcMain.handle('select-file', (event) => {
  // renderer プロセスにデータを返す
  const path = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
  return path;
})
