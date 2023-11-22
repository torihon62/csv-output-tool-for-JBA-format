document.getElementById('csvLoad').onclick = (event) => {
  event.preventDefault();

  // メインプロセスを呼び出し
  (async () => {
    const path = await window.XlsxContext.open();
    const xlsx = await window.XlsxContext.readXlsx(path[0]);
    console.log(xlsx);
  })()
};

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

  saveSettings(elements);
};
