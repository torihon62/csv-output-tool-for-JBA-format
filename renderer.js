document.getElementById('csvLoad').onclick = (event) => {
  event.preventDefault();

  // メインプロセスを呼び出し
  (async () => {
    const path = await window.XlsxContext.open();
    const xlsx = await window.XlsxContext.readXlsx(path[0]);
    console.log(xlsx);
  })()
};
