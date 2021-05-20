import { Component, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FormSection } from "./dynamic-form/dynamic-form.models";
import {
    FormGroupService,
} from "./dynamic-form/form-group.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
})
export class AppComponent implements OnDestroy {
    formGroup: FormGroup;
    sections: FormSection[] = [];
    debug: boolean = true;

    payLoad: string;
    showConfig: boolean;
    showForm: boolean;

    private ngDestroy$ = new Subject();

    constructor(private formSectionService: FormGroupService) {}

    ngOnInit() {
        this.showForm = false;

        this.formSectionService.getFormGroup().subscribe((response) => {
            this.formGroup = response.formGroup;
            this.sections = response.sections;
            this.checkDisplayRules();
            this.formGroup?.valueChanges
            .pipe(takeUntil(this.ngDestroy$))
            .subscribe((formData) => {
                this.onFormValuesChanged(formData);
            });
            this.showForm = true;
        });
    }

    private onFormValuesChanged(formData: any) {
        // console.log("onFormValuesChanged", formData);
        this.checkDisplayRules();
    }

    private checkDisplayRules() {
        // console.log("onFormValuesChanged", formData);
        this.sections.forEach((s) => {
            s.visible = this.formSectionService.checkSectionDisplayRules(
                s,
                this.formGroup
            );

            s.questions.forEach((q) => {
                q.visible = this.formSectionService.checkQuestionDisplayRules(
                    q,
                    this.formGroup
                );
            });
        });
    }

    onSubmitted(formGroup: FormGroup) {
        console.log("form", formGroup);
        this.payLoad = formGroup?.getRawValue();
    }

    onExport() {
        this.showConfig = !this.showConfig;
    }

    ngOnDestroy() {
        this.ngDestroy$.next();
        this.ngDestroy$.complete();
    }
}
