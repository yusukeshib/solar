import { Localization } from 'expo-localization'
import i18n from 'i18n-js'

const en = {
  'Settings': 'Settings',
  'Element visibility': 'Element visibility',
  'Show Star Labels': 'Show Star Labels',
  'Show Planet Labels': 'Show Planet Labels',
  'Show Constellations': 'Show Constellations',
  'Show Compass': 'Show Compass',
  'Keep Awake': 'Keep Awake',
  'Misc': 'Misc',
  'If you want to hide star\'s labels, uncheck this': 'If you want to hide star\'s labels, uncheck this.',
  'If you want to hide planet\'s labels, uncheck this': 'If you want to hide planet\'s labels, uncheck this.',
  'If you want to hide constellations, uncheck this': 'If you want to hide constellations, uncheck this.',
  'If you want to hide compass element, uncheck this': 'If you want to hide compass element, uncheck this.',
  'If you want to avoid device sleep, check this':`If you want to avoid device sleep, check this`,
  'Now': 'Now',
  'Change Date': 'Change Date',
  'Change Time': 'Change Time',
  'Select Location': 'Select Location',
  'Here': 'Here',
  'Tokyo': 'Tokyo',
  'New York': 'New York',
  'London': 'London',
  'San Francisco': 'San Francisco'
}
const ja = {
  'Settings': '設定',
  'Element visibility': '要素の表示',
  'Show Star Labels': '星の名称',
  'Show Planet Labels': '惑星の名称',
  'Show Constellations': '星座',
  'Show Compass': '方位',
  'Keep Awake': '画面のスリープを防止',
   'Misc': 'その他',
  'If you want to hide star\'s labels, uncheck this': '星の名称を非表示にしたい場合はチェックを外してください',
  'If you want to hide planet\'s labels, uncheck this': '惑星の名称を非表示にしたい場合はチェックを外してください',
  'If you want to hide constellations, uncheck this': '星座を非表示にしたい場合はチェックを外してください',
  'If you want to hide compass element, uncheck this': '方位を非表示にしたい場合はチェックを外してください',
  'If you want to avoid device sleep, check this': '画面をスリープしないようにするにはチェックしてください',
  'Now': '現在',
  'Change Date': '日付を変更',
  'Change Time': '時刻を変更',
  'Select Location': '場所を変更',
  'Here': '現在地',
  'Tokyo': '東京',
  'New York': 'ニューヨーク',
  'London': 'ロンドン',
  'San Francisco': 'サンフランシスコ'
}

i18n.fallbacks = true;
i18n.translations = {
  en,
  'ja-JP': ja
}
i18n.locale = Localization.locale

export default (...args) => i18n.t(...args)
