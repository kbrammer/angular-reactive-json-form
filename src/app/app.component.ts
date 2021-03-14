import { Component, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
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
    subs = new Array<Subscription>();

    constructor(
        private formGroupService: FormGroupService,
    ) {}

    ngOnInit() {
        this.showForm = false;
        
        this.formGroupService.getSections().subscribe((sections) => {
            this.sections = sections;
            this.formGroup = this.formGroupService.toFormGroup(sections);
            this.showForm = true;
            
            this.subs[0] = this.formGroup?.valueChanges.subscribe(
                (selectedValue) => {
                    this.payLoad = selectedValue;
                }
            );
        });
    }

    onSubmitted(formGroup: FormGroup) {
        this.payLoad = formGroup?.getRawValue();
    }

    onExport() {
        this.showConfig = !this.showConfig;
    }

    ngOnDestroy() {
        this.subs.forEach((s) => s.unsubscribe());
    }
}
