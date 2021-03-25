import { Component, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
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

    constructor(
        private formGroupService: FormGroupService,
    ) {}

    ngOnInit() {
        this.showForm = false;
        
        this.formGroupService.getSections().subscribe((sections) => {
            this.sections = sections;
            this.formGroup = this.formGroupService.toFormGroup(sections);
            this.showForm = true;
            
            this.formGroup?.valueChanges
                .pipe(takeUntil(this.ngDestroy$))
                .subscribe(
                (selectedValue) => {
                    this.payLoad = selectedValue;
                    this.onFormValuesChanged(selectedValue);
                }
            );
        });
    }

    private onFormValuesChanged(formData: any) {
        this.sections.forEach((s) => {
            s.visible = this.formGroupService.checkSectionDisplayRules(
                s,
                this.formGroup
            );

            s.questions.forEach((q) => {
                q.visible = this.formGroupService.checkQuestionDisplayRules(
                    q,
                    this.formGroup
                );
            });
        });
    }

    onSubmitted(formGroup: FormGroup) {
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
