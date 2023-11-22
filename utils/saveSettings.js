const saveSettings = (elements) => {
  const errorMessages = [];

  const consignorCode = elements.consignorCode.value;
  const consignorName = elements.consignorName.value;
  const financialInstitutionCode = elements.financialInstitutionCode.value;
  const financialInstitutionName = elements.financialInstitutionName.value;
  const financialInstitutionBranchCode = elements.financialInstitutionBranchCode.value;
  const financialInstitutionBranchName = elements.financialInstitutionBranchName.value;
  const depositType = elements.depositType.options[elements.depositType.selectedIndex].value;
  const accountNumber = elements.accountNumber.value;
  const payeeListFilePath = elements.payeeListFilePath.value;
  const payeeListFileSheetName = elements.payeeListFileSheetName.value;
  const csvOutputDist = elements.csvOutputDist.value;
  
  showAlert('success', '設定を保存しました');
};
