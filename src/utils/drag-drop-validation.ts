export interface Validateable {
    value: string | number;
    required?: boolean;
    minlength?: number;
    maxlength?: number;
    min?: number;
    max?: number;
}

export function Validate(input: Validateable) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }

    if (input.minlength != null && typeof input.minlength === "string") {
        isValid = isValid && (input.value as string).length > input.minlength;
    }

    if (input.maxlength != null && typeof input.maxlength === "string") {
        isValid = isValid && (input.value as string).length < input.maxlength;
    }

    if (input.min != null && typeof input.min === "number") {
        isValid = isValid && (input.value as number) > input.min;
    }

    if (input.max != null && typeof input.max === "number") {
        isValid = isValid && (input.value as number) < input.max;
    }
    return isValid;
}
