import loginImg from "../../assets/images/login_img.svg";
import InputPassword from "../../Components/InputPassword"
import { zodResolver } from '@hookform/resolvers/zod';
import InputField from "../../Components/InputField";
import styled from "./Register.module.css";
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import api from '../../services/api'
import { useState } from "react";
import { z } from "zod";
import { enqueueSnackbar } from "notistack";

const RegisterUser = () => {
    const [errorAPI, setError] = useState(null);
    const navigate = useNavigate();
    const updateDate = new Date();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

    const logOnSchema = z.object({
        nomeCompleto: z.string()
            .min(3, "O nome precisa de no mínimo 3 caracteres")
            .max(60, "O nome pode ter no máximo 60 caracteres"),

        email: z.string()
            .toLowerCase()
            .nonempty("O e-mail é obrigatório")
            .email('Formato de e-mail inválido'),

        senha: z.string()
            .nonempty("A senha não pode estar vazia")
            .min(6, "A senha precisa de no mínimo 6 caracteres")
            .max(64, "A senha não pode ultrapassar 64 caracteres"),

        confirmaSenha: z.string()
            .nonempty("A confirmação da senha é obrigatória")
            .min(6, "A senha precisa de no mínimo 6 caracteres")
            .max(64, "A senha não pode ultrapassar 64 caracteres"),

    }).refine(data => data.senha === data.confirmaSenha, {
        message: "As senhas não conferem",
        path: ["confirmaSenha"]
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(logOnSchema)
    });

    const registrar = (data) => {
            api.post('auth/register', {
                nomeCompleto: data.nomeCompleto,
                login: data.email,
                senha: data.senha,
                regra: 1,
                dataCriacao: formattedDate
            })
            .then(response => {
                navigate("/login");
                enqueueSnackbar("Cadastro realizado com sucesso, faça o Login e aproveite!", { variant: "success", anchorOrigin : { vertical: "bottom", horizontal: "right" } });
            })
            .catch(error => {
                setError(error.response?.data);
            });
    };

    return (
        <section className={styled.main}>
            <div className={styled.formContent}>
                <form onSubmit={handleSubmit(registrar)} className={styled.form}>
                    <div>
                        <h2 className={styled.title}>Olá, registre sua conta!</h2>
                        <p className={styled.subtitle}>Preencha e aproveite o Cibus:</p>
                    </div>
                    {errorAPI && <p>{errorAPI}</p>}

                    <InputField
                        idInput="nomeCompleto"
                        idDiv={styled.nomeField}
                        label={"Nome Completo"}
                        type="text"
                        maxLength={60}
                        placeholder={"Insira seu nome completo"}
                        register={register}
                        error={errors?.nome}
                    />
                    
                    <InputField
                        idInput="email"
                        idDiv={styled.userField}
                        label={"E-mail"}
                        type="email"
                        maxLength={60}
                        placeholder={"Insira seu e-mail"}
                        register={register}
                        error={errors?.email}
                    />

                    <InputPassword
                        idInput="senha"
                        idDiv={styled.passwordField}
                        label={"Senha"}
                        maxLength={30}
                        suggested={"new-password"}
                        type="password"
                        placeholder={"Insira a senha"}
                        register={register}
                        error={errors?.senha}
                    />

                     <InputPassword
                        idInput="confirmaSenha"
                        idDiv={styled.confirmPasswordField}
                        label={"Confirmar Senha"}
                        maxLength={30}
                        suggested={"new-password"}
                        type="password"
                        placeholder={"Confirme a senha"}
                        register={register}
                        error={errors?.confirmaSenha}
                    />
                    <button type="submit" className={styled.submitButton}>CADASTRAR</button>
                    <p className={styled.registerMessage}>Já possui uma conta? <a href="/login">Faça login</a></p>
                </form>
            </div>
            <div className={styled.imgContent}>
                <img src={loginImg} className={styled.loginImg} alt="Imagem ilustrativa de login" />
            </div>
        </section>
    );
};

export default RegisterUser;