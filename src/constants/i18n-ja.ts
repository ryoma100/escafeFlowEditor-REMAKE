import { I18nDict } from "@/constants/i18n";

export const i18nJaDict: I18nDict = {
  // menu
  file: "ファイル",
  new: "新規作成",
  open: "開く",
  save: "保存",
  setting: "設定",
  edit: "編集",
  selectAll: "すべて選択",
  delete: "削除",
  property: "プロパティ",
  package: "パッケージ",
  process: "プロセス",
  actor: "アクター",
  add: "追加",
  help: "ヘルプ",
  about: "このエディタについて",

  // toolbar
  select: "選択",
  transition: "トランジション",
  manualActivity: "手動アクティビティ",
  autoActivity: "自動アクティビティ",
  manualTimerActivity: "手動(時間制限)アクティビティ",
  autoTimerActivity: "自動(時間制限)アクティビティ",
  handWork: "手作業",
  start: "開始",
  end: "終了",
  comment: "コメント",

  // package
  editPackage: "パッケージの編集",

  // process
  editProcess: "ワークフロープロセスの編集",
  name: "名前",
  value: "値",
  extendedSetting: "拡張設定",
  application: "アプリケーション",
  expireLimit: "有効期限",
  inputExample: "入力例",
  extendedName: "拡張名",
  extendedValue: "拡張値",

  // actor
  editActor: "アクターの編集",

  // activity
  editActivity: "仕事の編集",
  jobTitle: "仕事名",
  editTransition: "接続の編集",
  beginning: "はじまり",
  work: "仕事",
  termination: "終わったら",
  previousWork: "前の仕事が・・・",
  whenOneDone: "ひとつでも終わったら",
  whenAllOver: "すべて終わったら",
  executeJob: "この仕事を行う。",
  processingDetails: "処理内容 (OGNL)",
  whenRunAutomatically: "自動で実行するのはいつ？ (OGNL)",
  nextJobCondition: "後続の仕事への接続条件を満たす・・・",
  oneOfThese: "どれかひとつ",
  all: "すべて",
  processContinues: "に続く。",

  // comment
  editComment: "コメントの編集",

  // transition
  connectCondition: "接続条件",
  conditionOn: "あり",
  conditionOff: "なし",
  conditionExpression: "条件式",

  // load
  openXpdl: "XPDLを開く",
  inputXpdl: "XPDLファイルの内容をコピーペーストで入力してください。",
  loadFile: "ファイルから読み込む",
  readXpdl: "入力したXPDLを読み込む",
  close: "閉じる",

  // save
  saveXpdl: "XPDLを保存",
  copyXpdl: "下記のXPDLの内容をコピーペーストで保存してください。",
  saveFile: "ファイルに保存",

  // setting
  language: "言語",
  en: "英語",
  ja: "日本語",

  // message
  idExists: "このIDは既に存在します。",
  actorCannotDelete: "このアクアーの仕事が残っているので、削除できません。",
  initAllConfirm: "全てを削除します。よろしいですか？",
  deleteProcessConfirm: "このプロセスを削除します。よろしいですか？",
  duplicateApplicationId: "ApplicationのIDは重複しないようにして下さい。",
  applicationCannotDelete: "このアプリケーションは既に使われているので、削除できません。",
  registerProcessApp: "プロセスのアプリケーションを登録して下さい。",
};
