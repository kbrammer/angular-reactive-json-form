import { AbstractControl, FormGroup, ValidatorFn } from "@angular/forms";
import { LinqSpecification } from "../shared/specification";
import { LinqSpecification2 } from "../shared/specification2";

export interface FormGroupConfigResponse {
    groups: Array<FormSection>;
}

export interface FormGroupResponse {
    sections: Array<FormSection>;
    formGroup: FormGroup;
}

export interface FormSection {
    id: number;
    title: string;
    subtitle?: string;
    questions: QuestionBase<any>[];
    visible: boolean;
    displayRules?: DisplayRuleConfig[];
}

export interface DisplayRuleConfig {
    and?: FieldSpecification[];
    or?: FieldSpecification[];
    not?: FieldSpecification[];
}

export class DisplayRuleSpecification<T> extends LinqSpecification<T> {
    expression: (o: T) => boolean;
    constructor(expression: (o: T) => boolean) {
        super();
        this.expression = expression;
    }
}

export class DisplayRuleSpecification2<T1, T2> extends LinqSpecification2<
    T1,
    T2
> {
    expression: (o: T1, f: T2) => boolean;
    constructor(expression: (o: T1, f: T2) => boolean) {
        super();
        this.expression = expression;
    }
}

export class QuestionBase<T> {
    key: string;
    tag: string;
    controlType: string;
    type: string;
    value: T;
    label: string;
    placeholder: string;
    order: number;
    visible: boolean;
    validationRules: Array<AsyncValidationRule>;
    choices: { key: string; value: string }[];
    workflows: WorkflowRule[];
    displayRules: DisplayRuleConfig[];

    constructor(
        options: {
            value?: T;
            key?: string;
            tag?: string;
            label?: string;
            placeholder?: string;
            order?: number;
            controlType?: string;
            type?: string;
            validationRules?: Array<AsyncValidationRule>;
            choices?: { key: string; value: string }[];
            workflows?: WorkflowRule[];
            visible?: boolean;
            displayRules?: DisplayRuleConfig[];
        } = {}
    ) {
        this.value = options.value;
        this.key = options.key || "";
        this.tag = options.tag || "";
        this.label = options.label || "";
        this.placeholder = options.placeholder || "";
        this.order = options.order === undefined ? 1 : options.order;
        this.controlType = options.controlType || "";
        this.type = options.type || "";
        this.validationRules = options.validationRules || [];
        this.choices = options.choices || [];
        this.workflows = options.workflows || undefined;
        this.visible = options.visible || true;
        this.displayRules = options.displayRules || undefined;
    }

    get validations() {
        const rules: any = {};
        this.validationRules.forEach((r) => {
            rules[r.type] = r.message;
        });
        return rules;
    }

    validateWorkflow(formGroup: FormGroup) {
        let result: number = undefined;
        if (this.workflows) {
            this.workflows.forEach((workflow) => {
                // ands
                let isAndMatch: boolean = true;
                workflow.and?.forEach((w) => {
                    let control = formGroup.get(w.key);
                    switch (w.operator) {
                        case "=":
                            if (w.value !== control.value) {
                                isAndMatch = false;
                            }
                            break;
                    }
                });

                // ors
                let orResults: boolean[] = [];
                workflow.or?.forEach((w) => {
                    let control = formGroup.get(w.key);
                    switch (w.operator) {
                        case "=":
                            orResults.push(w.value === control.value);
                            break;
                    }
                });
                let isOrMatch = orResults.find((a) => a === true);

                console.log("validateWorkflow", {
                    transitionTo: workflow.transitionTo,
                    orResults,
                    isAndMatch,
                    isOrMatch,
                });

                if (isAndMatch === true) {
                    result = workflow.transitionTo;
                } else if (isOrMatch === true) {
                    result = workflow.transitionTo;
                }
            });
        }

        return result;
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
    custom?: string; // TODO pass selector/name of custom validation function or directive?
}

export interface WorkflowModel {
    // question: QuestionBase<any>;
    control: AbstractControl;
    workflow: FieldSpecification;
}

export interface WorkflowRule {
    transitionTo?: number;
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

// /bob/i
export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const forbidden = nameRe.test(control.value);
        return forbidden ? { forbiddenName: { value: control.value } } : null;
    };
}
