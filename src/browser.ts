import "regenerator-runtime/runtime";

import { IValidateOptions } from "./common";
import parseSchematron from "./parse-schematron";
import { clearCache, throwDefaults, validateFocused, webDefaults } from "./validator";

export {
    IAssertion, IAssertionOrExtension, IExtension,
    IDescription, IDescriptionName, IDescriptionValueOf,
    IRule, IParsedSchematron,
    default as parseSchematron,
} from "./parse-schematron";

export {
    clearCache, validateFocused,
    throwDefaults, webDefaults,
    CheckOptionsHandler, ICompletedValidation, IValidationResult,
} from "./validator";

export { IValidateOptions } from "./common";

export const polymorphicDefaults = webDefaults;

export async function validate(xml: string, schematron: string, options?: Partial<IValidateOptions>) {
    return validateFocused(xml, schematron, webDefaults, options);
}

export default validate;

export { testSchematron, ISchematronTestInterface } from "./test-schematron";

declare var Comlink: any;

if (typeof Comlink === "object" && typeof self !== "undefined" && typeof Comlink.expose === "function") {
    const expose = {
        polymorphicDefaults, validate,

        clearCache, validateFocused,

        throwDefaults, webDefaults,

        parseSchematron,
    };
    Comlink.expose(expose, self);
}
