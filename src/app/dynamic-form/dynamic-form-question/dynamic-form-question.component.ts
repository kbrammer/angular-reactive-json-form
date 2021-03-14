import { Component, Input, OnInit } from "@angular/core";
import { Form, FormControl, FormGroup } from "@angular/forms";
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

    readonly control: FormControl;

    constructor() {
        this.control = new FormControl({
            value: "",
            disabled: false,
        });
    }

    ngOnInit() {
        this.control.setValue(this.question.label);
    }

    get isValid() {
        let name = this.formGroup.controls[this.question.key];
        return name.valid;
    }

    //https://angular.io/guide/form-validation#validating-input-in-reactive-forms
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

    onControlSaveValue() {
        console.log("save", this.control.value);
        // emit, dispatch to store
        // this.question.label = this.control.value;
    }
}
