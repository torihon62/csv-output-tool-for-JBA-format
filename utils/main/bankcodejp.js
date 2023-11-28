const env = require('../../env');

const getBankBranchInfo = async (bankCode, branchCode) => {
  const headers = new Headers();

  headers.append('apikey', env.BANK_CODE_JP_API_KEY);
  const info = await fetch(`https://apis.bankcode-jp.com/v3/banks/${bankCode}/branches?filter=code==${branchCode}`, {
    method: 'GET',
    headers: {
      "apikey": env.BANK_CODE_JP_API_KEY,
    },
  });

  return info.json();
};

module.exports = {
  getBankBranchInfo,
}
