import InputPassword from '../../Components/InputPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import { useNavigate } from 'react-router-dom';
import styled from './UsuarioInfoForm.module.css';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import api from '../../services/api'
import { z } from 'zod';

const UsuarioInfoForm = () => {
    const updateDate = new Date();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const createUserFormSchema = z.object({
        dataNascimento: z.date(),

        idade: z.number()
            .min(0, "A idade não pode ser negativa")
            .max(150, "A idade não pode ser maior que 150"),

        sexo: z.enum(['MASCULINO', 'FEMININO', 'OUTRO'], {
            errorMap: () => ({ message: "O sexo é obrigatório" })
        }),    

        nivelDeAtividadeFisica: z.enum(['SEDENTARIO', 'LEVE', 'MODERADO', 'INTENSO'], {
            errorMap: () => ({ message: "O nível de atividade física é obrigatório" })
        }),

        pesoAtual: z.number()
            .min(0, "O peso não pode ser negativo"),

        pesoDesejado: z.number()
            .min(0, "O peso desejado não pode ser negativo"),

        medidas: z.object({
            altura: z.number()
                .min(0, "A altura não pode ser negativa"),
            cintura: z.number()
                .min(0, "A medida da cintura não pode ser negativa"),
            quadril: z.number()
                .min(0, "A medida do quadril não pode ser negativa"),
             torax:   z.number()
                .min(0, "A medida do torax não pode ser negativa"), 
            braco: z.number()
                .min(0, "A medida do braço não pode ser negativa"),
            antebraco: z.number()
                .min(0, "A medida do antebraço não pode ser negativa"),
            panturrilha: z.number()
                .min(0, "A medida da panturrilha não pode ser negativa"),
            coxa: z.number() 
                .min(0, "A medida da coxa não pode ser negativa"), 
        }),

        alergiasIntolerancias: z.string()
            .max(500, "A alergia não pode ultrapassar 500 caracteres")
            .optional(),

        doencasPreexistentes: z.string()
            .toLowerCase()
            .nonempty("O e-mail é obrigatório")
            .email('Formato de e-mail inválido'),

        objetivos: z.string()
            .max(255, "O objetivo não pode ultrapassar 255 caracteres")
            .optional(),

    }).refine(data => data.password === data.confirmPassword, {
        message: "As senhas não conferem",
        path: ["confirmPassword"]
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
            dataNascimento: data.dataNascimento,
            idade: data.idade,
            sexo: data.sexo,
            nivelDeAtividadeFisica: data.nivelDeAtividadeFisica,
            pesoAtual: data.pesoAtual,
            pesoDesejado: data.pesoDesejado,
            medidas: data.medidas,
            alergiasIntolerancias: data.alergiasIntolerancias,
            doencasPreexistentes: data.doencasPreexistentes,
            objetivos: data.objetivos,
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
                        idInput="fullName"
                        idDiv={styled.fullNameField}
                        label="Nome Completo*"
                        type="text"
                        register={register}
                        error={errors?.fullName}
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
                        idInput="password"
                        idDiv={styled.passwordField}
                        label="Senha*"
                        type="password"
                        register={register}
                        error={errors?.password}
                    />
                    <InputPassword
                        idInput="confirmPassword"
                        idDiv={styled.confirmPasswordField}
                        label="Confirme a Senha*"
                        type="password"
                        register={register}
                        error={errors?.confirmPassword}
                    />
                </div>
                <FooterForm />
            </form>
        </section>
    );
}

export default UsuarioInfoForm;