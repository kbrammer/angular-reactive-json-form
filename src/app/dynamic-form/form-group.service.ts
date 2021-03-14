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
  FormGroupConfigResponse
} from "./dynamic-form.models";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { phoneNumberValidator } from "../shared/validators/phone.directive";

@Injectable()
export class FormGroupService {
  private apiUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json"
    })
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
          console.log(`get config`, config);
        }),
        map(config => {
          let sections =
            config.groups.map(section => {
              if (!section.questions) section.questions = [];
              return {
                ...section,
                questions: section.questions.map(question => {
                  switch (question.controlType) {
                    case "textbox":
                      return new TextboxQuestion(question);
                    case "radiobutton":
                      return new RadiobuttonQuestion(question);
                    case "datebox":
                      return new DateBoxQuestion(question);
                    case "checkbox":
                      return new CheckBoxQuestion(question);
                    case "dropdown":
                      return new DropdownQuestion(question);
                    default:
                      return new ContentBox(question);
                  }
                })
              };
            }) || [];

          sections.forEach(
            s => (s.questions = s.questions.sort((a, b) => a.order - b.order))
          );

          // console.log(JSON.stringify(sections));
          return sections;
        }),
        catchError(
          (error: any): Observable<any> => {
            console.warn(error);
            return of();
          }
        )
      );
  }

  toFormGroup(sections: FormSection[]) {
    
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

        group[question.key] = new FormControl(
            question.value,
            valFns
        );
    });
    return new FormGroup(group);
  }

}