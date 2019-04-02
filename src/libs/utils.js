// 报错语言
const LangKey = 'User-Lang'
export function setLang (data) {
  const LangValue = data
  localStorage.setItem(LangKey, LangValue)
}

export function getLang () {
  return localStorage.getItem(LangKey)
}

// 保存交易对
const tradeKey = 'trade-name'
export function setTrade (data) {
  sessionStorage.setItem(tradeKey, data)
}

export function getTrade () {
  return sessionStorage.getItem(tradeKey)
}


// 保存是否显示资产
const moneyShowKey = 'money-show'
export function setMoneyShow (data) {
  localStorage.setItem(moneyShowKey, data)
}

export function getMoneyShow () {
  return localStorage.getItem(moneyShowKey)
}