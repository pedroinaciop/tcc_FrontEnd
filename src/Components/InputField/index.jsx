import { NumericFormat } from 'react-number-format';
import { Controller } from "react-hook-form";
import styled from './InputField.module.css';

function InputField({
    idInput,
    idDiv,
    label,
    type,
    min,
    max,
    defaultValue,
    text,
    register,
    validation,
    error,
    maxLength,
    autoFocus,
    placeholder,
    className,
    iconButton,
    valueAsNumber = false,
    autoComplete,
    controller, 
    control,
    ...rest
}) {
    return (
        <div className={styled.formGroup} id={idDiv}>
            <label htmlFor={idInput}>{label}</label>

            {type === "numberformat" ? (
                <Controller
                    name={idInput}
                    control={control}
                    render={({ field }) => (
                        <NumericFormat
                            {...field}
                            id={idInput}
                            thousandSeparator="."
                            decimalSeparator=","
                            decimalScale={2}
                            fixedDecimalScale={false}
                            allowNegative={false}
                            className={`${className} ${error ? styled.inputError : ''}`}
                            placeholder={placeholder}
                            autoFocus={autoFocus}
                            {...rest}
                            onValueChange={(values) => {
                                const { floatValue } = values;
                                field.onChange(floatValue ?? "");
                            }}
                        />
                    )}
                />
            ) : (
                <input
                    min={min}
                    max={max}
                    defaultValue={defaultValue}
                    value={text}
                    id={idInput}
                    type={type}
                    maxLength={maxLength}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    className={`${className} ${error ? styled.inputError : ''}`}
                    placeholder={placeholder}
                    {...(register ? register(idInput, { validation, valueAsNumber }) : {})}
                    {...rest}
                />
            )}

            {error && <span className={styled.errorMessage}>{error.message}</span>}
        </div>
    );
}

export default InputField;