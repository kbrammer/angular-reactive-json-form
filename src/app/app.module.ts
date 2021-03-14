import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

import { DynamicFormQuestionComponent } from './dynamic-form/dynamic-form-question/dynamic-form-question.component';
import { DynamicFormGroupComponent } from './dynamic-form/dynamic-form-group/dynamic-form-group.component';
import { FormGroupService } from './dynamic-form/form-group.service';

@NgModule({
    imports: [BrowserModule, HttpClientModule, ReactiveFormsModule],
    declarations: [
        AppComponent,
        DynamicFormQuestionComponent,
        DynamicFormGroupComponent,
    ],
    bootstrap: [AppComponent],
    providers: [FormGroupService],
})
export class AppModule {}
