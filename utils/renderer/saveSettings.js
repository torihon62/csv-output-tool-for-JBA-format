const saveSettings = async (elements) => {
  const bankInfo = await window.BankJpContext.getBankInfo(elements.financialInstitutionCode.value, elements.financialInstitutionBranchCode.value);

  const consignorCode = elements.consignorCode.value;
  const consignorName = elements.consignorName.value;
  const financialInstitutionCode = elements.financialInstitutionCode.value;
  const financialInstitutionName = bankInfo.bank.halfWidthKana;
  const financialInstitutionBranchCode = elements.financialInstitutionBranchCode.value;
  const financialInstitutionBranchName = bankInfo.branches[0].halfWidthKana;
  const depositType = elements.depositType.options[elements.depositType.selectedIndex].value;
  const accountNumber = elements.accountNumber.value;
  const payeeListFilePath = elements.payeeListFilePath.value;
  const payeeListFileSheetName = elements.payeeListFileSheetName.value;
  const csvOutputDist = elements.csvOutputDist.value;
  
  const payload = {
    consignorCode,
    consignorName,
    financialInstitutionCode,
    financialInstitutionName,
    financialInstitutionBranchCode,
    financialInstitutionBranchName,
    depositType,
    accountNumber,
    payeeListFilePath,
    payeeListFileSheetName,
    csvOutputDist
  };

  await window.SettingsContext.saveSettings(payload);
  showAlert('success', '設定を保存しました');
};
