import InputPassword from '../../Components/InputPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import { useNavigate } from 'react-router-dom';
import styled from './UserForm.module.css';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import api from '../../services/api'
import { z } from 'zod';

const UserForm = () => {
    const updateDate = new Date();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const createUserFormSchema = z.object({
        nomeCompleto: z.string()
            .nonempty("O nome é obrigatório")
            .min(3, "O nome precisa de no mínimo 3 caracteres")
            .transform(name => {
                return name.trim().split(' ').map(word => {
                    return word[0].toLocaleUpperCase().concat(word.substring(1));
                }).join(' ');
            }),

        email: z.string()
            .toLowerCase()
            .nonempty("O e-mail é obrigatório")
            .email('Formato de e-mail inválido'),

        senha: z.string()
            .nonempty("A senha é obrigatória")
            .min(6, "A senha precisa de no mínimo 6 caracteres")
            .max(64, "A senha não pode ultrapassar 64 caracteres"),

        confirmarSenha: z.string()
            .nonempty("A confirmação da senha é obrigatória")
            .min(6, "A senha precisa de no mínimo 6 caracteres")
            .max(64, "A senha não pode ultrapassar 64 caracteres"),
    }).refine(data => data.senha === data.confirmarSenha, {
        message: "As senhas não conferem",
        path: ["confirmarSenha"]
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(createUserFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createUser = (data) => {
        api.post('cadastros/usuarios/novo', {
            nomeCompletome: data.nomeCompleto,
            email: data.email,
            senha: data.senha,
            updateDate: formattedDate,
            updateUser: "ADM",
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function () {
            enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/cadastros/usuarios')
        })
        .catch(function (error) {
            if (api.isAxiosError(error)) {
                if (error.response) {
                    enqueueSnackbar(`Erro ${error.response.status}: ${error.response.data.message}`, { variant: "error" });
                } else if (error.request) {
                    enqueueSnackbar("Erro de rede: Servidor não respondeu", { variant: "warning" });
                } else {
                    enqueueSnackbar("Erro desconhecido: " + error.message, { variant: "error" });
                }
            } else {
                enqueueSnackbar("Erro inesperado", { variant: "error" });
            }
        });
    };

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Novo Usuário"} />
            <form onSubmit={handleSubmit(createUser)} onKeyDown={handleKeyDown} autoComplete="off">
                <div className={styled.row}>
                    <InputField
                        idInput="nomeCompleto"
                        idDiv={styled.fullNameField}
                        label="Nome Completo*"
                        type="text"
                        register={register}
                        error={errors?.nomeCompleto}
                    />
                    <InputField
                        idInput="email"
                        idDiv={styled.emailField}
                        label="E-mail*"
                        type="email"
                        register={register}
                        error={errors?.email}
                    />
                </div>

                <div className={styled.row}>
                    <InputPassword
                        idInput="senha"
                        idDiv={styled.passwordField}
                        label="Senha*"
                        type="password"
                        register={register}
                        error={errors?.senha}
                    />
                    <InputPassword
                        idInput="confirmarSenha"
                        idDiv={styled.confirmPasswordField}
                        label="Confirme a Senha*"
                        type="password"
                        register={register}
                        error={errors?.confirmarSenha}
                    />
                </div>
                <FooterForm />
            </form>
        </section>
    );
}

export default UserForm;