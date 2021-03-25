export interface FormGroupConfigResponse {
  groups: Array<FormSection>;
}

export interface FormSection {
  id: number;
  title: string;
  subtitle?: string;
  visible: boolean;
  questions: QuestionBase<any>[];
  displayRules?: DisplayRule[];
}

export class QuestionBase<T> {
  key: string;
  controlType: string;
  type: string;
  value: T;
  label: string;
  placeholder: string;
  choices: { key: string; value: string }[];
  order: number;
  validationRules: Array<AsyncValidationRule>;
  visible: boolean;
  displayRules: DisplayRule[];

  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      placeholder?: string;
      order?: number;
      controlType?: string;
      type?: string;
      visible?: boolean;
      validationRules?: Array<AsyncValidationRule>;
      choices?: { key: string; value: string }[];
      displayRules?: DisplayRule[];
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || "";
    this.label = options.label || "";
    this.placeholder = options.placeholder || "";
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || "";
    this.type = options.type || "";
    this.visible = options.visible || true;
    this.validationRules = options.validationRules || [];
    this.choices = options.choices || [];
    this.displayRules = options.displayRules || undefined;
  }

  get validations() {
    const rules: any = {};
    this.validationRules.forEach(r => {
      rules[r.type] = r.message;
    });
    return rules;
  }
}

export interface AsyncValidationRule {
  type?:
    | "required"
    | "minLength"
    | "maxLength"
    | "min"
    | "max"
    | "email"
    | "phone"
    | "pattern"
    | "custom";

  message?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  custom?: string; // TODO
}

export interface DisplayRule {
  and?: FieldSpecification[];
  or?: FieldSpecification[];
  not?: FieldSpecification[];
}

export interface FieldSpecification {
  key: string;
  operator:
    | "="
    | "<>"
    | "<"
    | ">"
    | "<="
    | ">="
    | "contains"
    | "endswith"
    | "startswith"
    | "isblank"
    | "isnotblank"
    | "notcontains"
    | "between"
    | "hasvalue"
    | "selected";
  value: any;
}

export class ContentBox extends QuestionBase<string> {
  controlType = "";
}

export class DateBoxQuestion extends QuestionBase<Date> {
  controlType = "datebox";
  type = "date";
}

export class CheckBoxQuestion extends QuestionBase<string> {
  controlType = "checkbox";
  type = "checkbox";
}

export class RadiobuttonQuestion extends QuestionBase<string> {
  controlType = "radiobutton";
  type = "radio";
}

export class TextboxQuestion extends QuestionBase<string> {
  controlType = "textbox";
  type = "text";
}

export class DropdownQuestion extends QuestionBase<string> {
  controlType = "dropdown";
}
