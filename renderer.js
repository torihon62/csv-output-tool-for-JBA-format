document.getElementById('csvLoad').onclick = (event) => {
  event.preventDefault();

  // メインプロセスを呼び出し
  (async () => {
    const path = await window.FileOpenContext.open();
    document.getElementById('file-name').innerText = path;
  })()
};
