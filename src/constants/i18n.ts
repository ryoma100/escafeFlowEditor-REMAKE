export type I18nDict = typeof i18nEnDict;

export const i18nEnDict = {
  // menu
  file: "FIle",
  new: "New",
  open: "Open",
  save: "Save",
  setting: "Setting",
  edit: "Edit",
  selectAll: "Select All",
  delete: "Delete",
  property: "Property",
  package: "Package",
  process: "Process",
  actor: "Actor",
  add: "Add",
  help: "Help",
  about: "About this Editor",

  // toolbar
  select: "Select",
  transition: "Transition",
  manualActivity: "Manual Activity",
  autoActivity: "Auto Activity",
  manualTimerActivity: "Manual Timer Activity",
  autoTimerActivity: "Auto Timer Activity",
  handWork: "Hand Work",
  start: "Start",
  end: "End",
  comment: "Comment",

  // package
  editPackage: "Edit package",

  // process
  editProcess: "Edit workflow process",
  name: "Name",
  value: "Value",
  extendedSetting: "Extended Setting",
  application: "Application",
  expireLimit: "Expire Limit",
  inputExample: "Input Example",
  extendedName: "Extended Name",
  extendedValue: "Extended Value",

  // actor
  editActor: "Edit Actor",

  // activity
  editActivity: "Edit Activity",
  jobTitle: "Job Title",
  editTransition: "Edit Transition",
  beginning: "Beginning",
  work: "Work",
  termination: "Termination",
  previousWork: "Previous Work...",
  whenOneDone: "When one of term is done",
  whenAllOver: "When it's all over",
  executeJob: "Execute this job.",
  processingDetails: "Processing Details (OGNL)",
  whenRunAutomatically: "When does it run automatically? (OGNL)",
  nextJobCondition: "Next job connection conditions...",
  oneOfThese: "one of these",
  all: "all",
  processContinues: "process continues.",

  // comment
  editComment: "Edit Comment",

  // transition
  connectCondition: "Connect condition",
  conditionOn: "On",
  conditionOff: "Off",
  conditionExpression: "Condition expression",

  // load
  openXpdl: "Load XPDL",
  inputXpdl: "Enter the contents of the XPDL file by copy-pasting.",
  loadFile: "Load from file",
  readXpdl: "Read the entered XPDL",
  close: "Close",

  // save
  saveXpdl: "Save XPDL",
  copyXpdl: "Copy-paste and save the contents of the XPDL below.",
  saveFile: "Save to file",

  // setting
  language: "Language",
  en: "English",
  ja: "Japanese",
  appearance: "Appearance",
  auto: "Auto",
  light: "Light",
  dark: "Dark",
  theme: "Theme",
  themeMaterial: "Default (Used By Material Icons)",
  themeCrab: "Crab (Made By Image Creator from Microsoft Designer)",
  color: "Color",
  colorGreen: "Green",
  colorRed: "Red",

  // message
  idExists: "This ID already exists.",
  actorCannotDelete: "This actor has work to do and cannot be removed.",
  initAllConfirm: "Delete all. Are you sure?",
  deleteProcessConfirm: "Delete this process. Are you sure?",
  duplicateApplicationId: "Please do not duplicate Application IDs.",
  applicationCannotDelete: "This Application is already in use and cannot be removed.",
  registerProcessApp: "Register process application.",
  exit: "Do you want to exit this application?",
};
