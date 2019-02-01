import { IValidateOptions } from "./common";
import { validateFocused, webDefaults } from "./validator";

export {
    IAssertion, IAssertionOrExtension, IExtension,
    IDescription, IDescriptionName, IDescriptionValueOf,
    IRule, IParsedSchematron,
    default as parseSchematron,
} from "./parse-schematron";

export {
    clearCache, validateFocused,
    throwDefaults, webDefaults,
    CheckOptionsHandler, IValidationResult,
} from "./validator";

export { IValidateOptions } from "./common";

export const polymorphicDefaults = webDefaults;

export async function validate(xml: string, schematron: string, options?: Partial<IValidateOptions>) {
    return validateFocused(xml, schematron, webDefaults, options);
}

export default validate;

export { testSchematron, ISchematronTestInterface } from "./test-schematron";
