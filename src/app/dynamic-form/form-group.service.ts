import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import {
    ContentBox,
    DateBoxQuestion,
    CheckBoxQuestion,
    RadiobuttonQuestion,
    DropdownQuestion,
    TextboxQuestion,
    FormSection,
    FormGroupConfigResponse,
    QuestionBase,
    FormGroupResponse,
    DisplayRuleConfig,
} from "./dynamic-form.models";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { phoneNumberValidator } from "../shared/validators/phone.directive";
import {
    contains,
    equals,
    greaterThan,
    isblank,
    isnotblank,
    lessThan,
    notcontains,
    notEquals,
} from "./display-rules";

const yesNoOptions = [
    { key: "Yes", value: "Yes" },
    { key: "No", value: "No" },
];

@Injectable()
export class FormGroupService {
    private apiUrl: string;
    private httpOptions = {
        headers: new HttpHeaders({
            "Content-Type": "application/json",
        }),
    };

    constructor(private http: HttpClient) {
        this.apiUrl = "";
    }

    getSections(): Observable<Array<FormSection>> {
        return this.http
            .get<FormGroupConfigResponse>(
                `${this.apiUrl}/assets/form-groups.json`,
                this.httpOptions
            )
            .pipe(
                tap((config: FormGroupConfigResponse) => {
                    this.log(`get config`, config);
                }),
                map((config) => {
                    let sections =
                        config.groups.map((section) => {
                            if (!section.questions) section.questions = [];
                            return {
                                ...section,
                                questions: section.questions.map((question) => {
                                    switch (question.controlType) {
                                        case "textbox":
                                            return new TextboxQuestion(
                                                question
                                            );
                                        case "radiobutton":
                                            return new RadiobuttonQuestion(
                                                question
                                            );
                                        case "datebox":
                                            return new DateBoxQuestion(
                                                question
                                            );
                                        case "checkbox":
                                            return new CheckBoxQuestion(
                                                question
                                            );
                                        case "dropdown":
                                            return new DropdownQuestion(
                                                question
                                            );
                                        default:
                                            return new ContentBox(question);
                                    }
                                }),
                            };
                        }) || [];

                    sections.forEach(
                        (s) =>
                            (s.questions = s.questions.sort(
                                (a, b) => a.order - b.order
                            ))
                    );

                    // console.log(JSON.stringify(sections));
                    return sections;
                }),
                catchError((error: any): Observable<any> => {
                    console.warn(error);
                    return of();
                })
            );
    }

    getFormGroup(): Observable<FormGroupResponse> {
        return this.getSections().pipe(
            map((sections) => {
                // get flat list of questions from all sections
                const allQuestions =
                    sections?.flatMap((s) => s.questions) || [];

                // build group of form controls
                const group: any = {};

                // add validation functions
                allQuestions.forEach((question) => {
                    let valFns = [];

                    question.validationRules.forEach((rule) => {
                        // console.log("rule", rule);
                        switch (rule.type) {
                            case "required":
                                valFns.push(Validators.required);
                                break;
                            case "minLength":
                                if (rule.minLength)
                                    valFns.push(
                                        Validators.minLength(rule.minLength)
                                    );
                                break;
                            case "maxLength":
                                if (rule.maxLength)
                                    valFns.push(
                                        Validators.maxLength(rule.maxLength)
                                    );
                                break;
                            case "min":
                                if (rule.min)
                                    valFns.push(Validators.min(rule.min));
                                break;
                            case "max":
                                if (rule.max)
                                    valFns.push(Validators.max(rule.max));
                                break;
                            case "pattern":
                                if (rule.pattern)
                                    valFns.push(
                                        Validators.pattern(rule.pattern)
                                    );
                                break;
                            case "phone":
                                valFns.push(phoneNumberValidator());
                                break;
                            case "email":
                                valFns.push(Validators.email);
                                break;
                            case "custom": // TODO
                                if (rule.custom) {
                                    switch (rule.custom) {
                                        case "something":
                                            valFns.push(Validators.required);
                                            break;
                                    }
                                }
                                break;
                        }
                    });

                    let ctl = new FormControl(question.value, valFns);
                    group[question.key] = ctl;
                });
                // return new FormGroup(group);
                return {
                    sections: sections,
                    formGroup: new FormGroup(group),
                };
            }),
            catchError((error: any): Observable<any> => {
                console.warn(error);
                return of();
            })
        );
    }

    private log(message?: any, optionalParams?: any): void {
        console.log(message, optionalParams);
    }

    private checkDisplayRules(
        displayRules: DisplayRuleConfig[],
        formGroup: FormGroup
    ): boolean {
        let result = true;

        // let displayRuleFactory = new DisplayRuleFactory(formGroup);

        if (displayRules) {
            let isVisible = true;
            displayRules.forEach((displayRule) => {
                this.log(" - displayRule", displayRule);

                // ands
                if (displayRule.and) {
                    displayRule.and?.forEach((andRule) => {
                        this.log(" - and", {
                            key: andRule.key,
                            formVal: formGroup.get(andRule.key)?.value,
                            operator: andRule.operator,
                            value: andRule.value,
                        });

                        let isAndSatisfied = equals
                            .and(notEquals)
                            .and(greaterThan)
                            .and(lessThan)
                            .and(contains)
                            .and(notcontains)
                            .and(isblank)
                            .and(isnotblank)
                            .isSatisfiedBy(andRule, formGroup);

                        this.log("   - is satisfied", isAndSatisfied);

                        // hide if any of these conditions are not satisified
                        if (isAndSatisfied === false) {
                            isVisible = false;
                        }
                    });
                }

                if (displayRule.or) {
                    let isOrSatisfieds = new Array<boolean>();
                    displayRule.or?.forEach((orRule) => {
                        this.log(" - or", {
                            key: orRule.key,
                            formVal: formGroup.get(orRule.key)?.value,
                            operator: orRule.operator,
                            value: orRule.value,
                        });

                        let isOrSatisfied = equals
                            .or(notEquals)
                            .or(greaterThan)
                            .or(lessThan)
                            .or(contains)
                            .or(notcontains)
                            .or(isblank)
                            .or(isnotblank)
                            .isSatisfiedBy(orRule, formGroup);

                        this.log("   - is satisfied", isOrSatisfied);

                        // hide only if ALL of the conditions are not satisified
                        // if (isOrSatisfied === false) {
                        //     isVisible = false;
                        // }
                        isOrSatisfieds.push(isOrSatisfied);
                    });

                    // hide only if ALL of the conditions are not satisified
                    if (!isOrSatisfieds.includes(true)) {
                        isVisible = false;
                    }
                }
            });

            return isVisible;
        } else {
            // always visible if no rules are specified
            result = true;
        }
        return result;
    }
    // build specifications for display rules
    checkSectionDisplayRules(
        section: FormSection,
        formGroup: FormGroup
    ): boolean {
        this.log("section", {
            key: section.id,
            title: section.title,
            displayRules: section.displayRules,
        });
        return this.checkDisplayRules(section.displayRules, formGroup);
    }

    checkQuestionDisplayRules(
        question: QuestionBase<any>,
        formGroup: FormGroup
    ): boolean {
        this.log("question", {
            key: question.key,
            tag: question.tag,
            displayRules: question.displayRules,
        });
        return this.checkDisplayRules(question.displayRules, formGroup);
    }
}
