import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionBase } from "../dynamic-form.models";

@Component({
    selector: "app-question",
    templateUrl: "./dynamic-form-question.component.html",
    styleUrls: ["./dynamic-form-question.component.scss"],
})
export class DynamicFormQuestionComponent implements OnInit {
    @Input() question: QuestionBase<any>;
    @Input() formGroup: FormGroup;
    @Input() submitted: boolean;
    @Input() debug: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    get isValid() {
        let name = this.formGroup.controls[this.question.key];
        return name.valid;
    }

    get isInvalid() {
        let name = this.formGroup.controls[this.question.key];
        return this.submitted
            ? name?.invalid
            : name?.invalid && (name.dirty || name.touched);
    }

    get errors() {
        let name = this.formGroup.controls[this.question.key];
        return name?.errors;
    }
}
