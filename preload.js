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

const open = async (message) => {
  const data = await ipcRenderer.invoke('select-file');
  return data;
};

const readXlsx = async (path) => {
  const data = await ipcRenderer.invoke('read-xlsx', path);
  return data;
};

contextBridge.exposeInMainWorld('XlsxContext', {
    open,
    readXlsx,
  }
);
