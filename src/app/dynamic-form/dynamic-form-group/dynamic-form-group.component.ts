import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormSection } from "../dynamic-form.models";

@Component({
  selector: "app-dynamic-form-group",
  templateUrl: "./dynamic-form-group.component.html",
  styleUrls: ["./dynamic-form-group.component.scss"]
})
export class DynamicFormGroupComponent implements OnInit, OnDestroy {
  @Input() sections: Array<FormSection>;
  @Input() formGroup: FormGroup;
  @Input() debug: boolean;
  @Output() submitted = new EventEmitter();

  payLoad: any = {};

  constructor() {}

  ngOnInit() {}

  onSubmit() {
    this.payLoad = this.formGroup.getRawValue();
    console.log("payload", this.payLoad);
  }

  ngOnDestroy() {}
}
