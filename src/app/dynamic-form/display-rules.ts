import {
    FieldSpecification,
    DisplayRuleSpecification2,
} from "./dynamic-form.models";
import { FormGroup } from "@angular/forms";


export const equals = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>((w, f) => {
    let result =
        w.operator !== "=" ||
        (w.operator === "=" && w.value === f.get(w.key)?.value);

    if (w.operator === "=") {
        console.log("   - equals", result);
    }
    return result;
});

export const notEquals = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>(
    (w, f) =>
        w.operator !== "<>" ||
        (w.operator === "<>" && w.value !== f.get(w.key)?.value)
);

export const greaterThan = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>(
    (w, f) =>
        w.operator !== ">" ||
        (w.operator === ">" && w.value > f.get(w.key)?.value)
);

export const lessThan = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>(
    (w, f) =>
        w.operator !== "<" ||
        (w.operator === "<" && w.value < f.get(w.key)?.value)
);

export const contains = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>(
    (w, f) =>
        w.operator !== "contains" ||
        (w.operator === "contains" && f.get(w.key)?.value?.search(w.value) > -1)
);

export const notcontains = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>(
    (w, f) =>
        w.operator !== "notcontains" ||
        (w.operator === "notcontains" &&
            f.get(w.key)?.value?.search(w.value) === -1)
);

export const isnotblank = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>((w, f) => {
    let result =
        w.operator !== "isnotblank" ||
        (w.operator === "isnotblank" &&
            !(
                f.get(w.key)?.value === undefined ||
                f.get(w.key)?.value === null ||
                f.get(w.key)?.value === ""
            ));

    if (w.operator === "isnotblank") {
        console.log("   - isnotblank", {
            result,
            val: f.get(w.key)?.value,
        });
    }
    return result;
});

export const isblank = new DisplayRuleSpecification2<
    FieldSpecification,
    FormGroup
>(
    (w, f) =>
        w.operator !== "isblank" ||
        (w.operator === "isblank" &&
            (f.get(w.key)?.value === undefined ||
                f.get(w.key)?.value === null ||
                f.get(w.key)?.value === ""))
);

