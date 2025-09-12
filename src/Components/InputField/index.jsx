import styled from './InputField.module.css';

function InputField({
    idInput,
    idDiv,
    label,
    type,
    min,
    max,
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
    ...rest }) {
    return (
        <div className={styled.formGroup} id={idDiv}>
            <label htmlFor={idInput}>{label}</label>
            <input
                min={min}
                max={max}
                value={text}
                id={idInput}
                type={type}
                maxLength={maxLength}
                autoFocus={autoFocus}
                autoComplete={autoComplete}
                className={`${className} ${error ? styled.inputError : ''}`}
                placeholder={placeholder}
                {...(register ? register(idInput, {validation, valueAsNumber}) : {})}
                {...rest}
            />
            {error && <span className={styled.errorMessage}>{error.message}</span>}
        </div>
    );
}

export default InputField;
