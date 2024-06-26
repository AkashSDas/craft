import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

/**
 * Custom validator to check if a value is a valid timestamp
 */
export function IsTimestamp(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isTimestamp",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    value = Number(value);
                    return (
                        typeof value === "number" &&
                        !isNaN(new Date(value).getTime())
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    return `${args.property} must be a valid timestamp`;
                },
            },
        });
    };
}

/**
 * Custom validator to check if end timestamp is after start timestamp
 */
export function IsAfter(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isAfter",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    let relatedValue = (args.object as any)[
                        relatedPropertyName
                    ];
                    value = Number(value);
                    relatedValue = Number(relatedValue);
                    return (
                        typeof value === "number" &&
                        typeof relatedValue === "number" &&
                        value > relatedValue
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be after ${relatedPropertyName}`;
                },
            },
        });
    };
}
