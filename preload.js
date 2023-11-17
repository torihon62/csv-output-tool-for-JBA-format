const { contextBridge, ipcRenderer } =  require('electron');

window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

const selectFile = async (message) => {
  // renderer から Main プロセスを呼び出す
  const data = await ipcRenderer.invoke('select-file');
  return data;
};

contextBridge.exposeInMainWorld('FileOpenContext', {
    open: selectFile,
  }
);
