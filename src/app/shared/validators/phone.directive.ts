import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

export function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    //https://stackoverflow.com/questions/123559/how-to-validate-phone-numbers-using-regex
    const nameRe = new RegExp(
      /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
      "i"
    );
    const valid = nameRe.test(control.value);
    // console.log("phone", { value: control.value, valid });
    return valid === false ? { phone: { value: control.value } } : null;
  };
}
