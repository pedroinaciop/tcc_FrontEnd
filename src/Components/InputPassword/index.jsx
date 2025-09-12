import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import useCapsLock from '../../Hooks/useCapsLock';
import styled from './InputPassword.module.css';
import React from 'react';

function InputPassword({
    idInput,
    idDiv,
    label,
    type,
    min,
    register,
    validation,
    error,
    maxLength,
    autoFocus,
    placeholder,
    suggested,
    className,
    iconButton,
    autoComplete,
    ...rest }) {
    const [mostrarSenha, setMostrarSenha] = React.useState(false);
    const isCapsLockOn = useCapsLock(false);

    const toggleMostrarSenha = () => {
        setMostrarSenha(!mostrarSenha);
    };

    return (
        <section className={styled.formGroup} id={idDiv}>
            {isCapsLockOn && <p className={styled.capsLockWarning}>Caps Lock Ativado</p>}
            <label htmlFor={idInput}>{label}</label>
            <input
                id={idInput}
                autoComplete={autoComplete}
                maxLength={maxLength}
                suggested={suggested}
                type={type === 'password' && mostrarSenha ? 'text' : type}
                placeholder={placeholder}
                className={`${className} ${error? styled.inputError : ''}`}
                {...(register ? register(idInput, validation) : {})}
                {...rest}
                />
            {type === 'password' && (
                <div type="button" className={styled.iconPassword} onClick={toggleMostrarSenha}>
                    {mostrarSenha ? <EyeInvisibleOutlined/> : <EyeOutlined/>}
                </div>
            )}
            {error && <span className={styled.errorMessage}>{error.message}</span>}
        </section>
    );
}

export default InputPassword;