export interface IForm {
  formTitle: string;
  saveBtnTitle?: string;
  saveBtnFunction?: string;
  resetBtnTitle?: string;
  calculateBtnTitle?: string;
  prevBtnTitle?: string;
  themeFile: string;
  formSections: IFormSections[];
  class?: string;
}
export interface IFormSections {
  sectionTitle: string;
  visible?: boolean;
  apiEndpoint?: any;
  controlTypeName?: any;
  method?: any;
  isVisible?: boolean;
  formControls: IFormControl[];
  visibleLabel?: boolean;
  sectionButton?: ISectionButton;
  class?: string;
  toolTipText?: string;
}
export interface ISectionButton {
  label?: string;
  class?: string;
  name?: string;
  visible: boolean;
  apiEndpoint?: any;
  method?: any;
  controlTypeName: any;
  formControls: IFormControl[];
  isVisible?: boolean;
}
export interface IFormControl {
  name: string;
  label?: string;
  visibleLabel?: boolean;
  bigFont?: boolean;
  content?: IOptions[];
  text?: string;
  value?: any;
  apiEndpoint?: any;
  method?: any;
  controlTypeName?: any;
  options?: IOptions[];
  idProperty?: any;
  nameProperty?: any;
  class?: string;
  cssClass?: string;
  showBorder?: boolean;
  type?: any;
  subType?: any;
  variableName?: string;
  validators?: IValidator[];
  validationRules?: any[];
  disabled?: boolean;
  dynamicControls?: IDynamicControl[][];
  bannerText?: string;
  image?: Image;
  additionalCovers?: IAdditionalCover[];
  secondarylabel?: string;
  placeholder?: string;
  radioOptions?: IRadioOption[];
  selectCheckboxOptions?: ISelectCheckboxOption[];
  images?: IImage[];
  otherControlName?: any;
  subControls?: ISubControl[][];
  methodName?: any;
  getAllOption?: any;
  onChangeMethod?: any;
  visible?: boolean;
  conditionalVisibility?: IConditionalVisibility;
  popUpFormId?: any;
  showDoneButton?: boolean;
  dependentControls?: string[];
  toolTipText?: string;
  isToolTipVisible?: boolean;
  imagesrc?: string;
  tabs?: ITab[];
  bigFontValue?: string;
  details?: any;
  button?:any;
  icon?:string;
}
export interface ISubControl {
  name: string;
  visibleLabel?: boolean;
  label?: string;
  class?: string;
  type?: any;
  validators?: IValidator[];
  value?: any;
  radioOptions?: IRadioOption[];
  selectCheckboxOptions?: ISelectCheckboxOption[];
  options?: IOptions[];
  visible?: boolean;
  disabled?: boolean;
  method?: string;
  innerSubControls?: ISubControl[];
  bigFont?: boolean;
  getAllOption?: string;
}

export interface ITab {
  name: string;
  label: string;
  content: any;
  selectCheckboxOptions?: ISelectCheckboxOption[];
  type:string;
  class:string;
  visibleLabel:boolean;
}

export interface IConditionalVisibility {
  dependsOn: string; // Name of the control on which this control's visibility depends
  values: any[]; // Array of values for which this control should be visible
}

export interface IRadioOption {
  name: string;
  label: string;
  value: string;
  selected?: boolean;
  year?: string;
  discount?: string;
}

export interface ISelectCheckboxOption {
  label?: string;
  value: string;
  button?: boolean;
  imagePath?: string;
  isIncrement?: boolean;
  name?:string;
  
}

export interface IImage {
  id: number;
  src: string;
  alt: string;
  width?: string;
  height?: string;
  label: string;
}
export interface IAdditionalCover {
  id: number;
  value: string;
  class: string;
  selected: boolean;
  description: string;
  additionalQuestions?: IAdditionalQuestion[];
}
export interface IAdditionalQuestion {
  id?: number;
  label: string;
  type?: string;
  options?: (string | IAdditionalQuestionOption)[];
  selectedOption?: string | null;
}
export interface IAdditionalQuestionOption {
  label: string;
  value: boolean;
  type?: string;
}
export interface Image {
  src: string;
  alt: string;
}
export interface IDynamicControl {
  name: string;
  label: string;
  visibleLabel: boolean;
  key?: string;
  type?: any;
  value?: any;
  apiEndpoint?: any;
  disabled?: boolean;
  class?: string;
  methodName?: any;
  visible?: boolean;
  options?: IOptions[];
  validators?: IValidator[];
  radioOptions?: IRadioOption[];
  selectCheckboxOptions?: ISelectCheckboxOption[];
  bigFont?: boolean;
  subControls?: ISubControl[][];
  image:IImage;
  tabs:ITab[];
  getAllOption?: string;
}
export interface IValidator {
  validatorName?: string;
  message?: string;
  required?: boolean;
  pattern?: string | undefined;
  minLength?: number;
  maxLength?: number;
  email?: string;
}
export interface IOptions {
  id?: any;
  name?: string;
  other?: any;
  value?: any;
  class?: string;
  selected?: boolean;
}