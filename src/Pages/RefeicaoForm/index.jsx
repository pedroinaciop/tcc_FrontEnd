import { formatDateToBrazilian, formatDateToISO } from '../../utils/formatDate';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './UsuarioInfoForm.module.css';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../services/api'
import { Select } from 'antd';
import { z } from 'zod';

const RefeicaoForm = () => {
    const updateDate = new Date();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')}`;

    const createRefeicaoFormSchema = z.object({
        dataRegistro: z.coerce.date().default(new Date()),

        tipoRefeicao: z.enum(['CAFE_MANHA', 'ALMOCO', 'CAFE_TARDE', 'JANTA'], {
            errorMap: () => ({ message: "A refeição é obrigatória" })
        }),  
        
    });

    const { control, register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(createRefeicaoFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createRefeicao = (data) => {
        console.log(data);
        api.post('cadastros/info/usuarios/novo', {
            dataRegistro: formattedDate,
            dataNascimento: formatDateToBrazilian(data.dataNascimento),
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function () {
            enqueueSnackbar("Cadastro realizado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" }});
            navigate('/info/usuario/')
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

    const tipoRefeicao = [
        {value: "CAFE_MANHA", key: "CAFE_MANHA"},
        {value: "ALMOCO", key: "ALMOCO"},
        {value: "CAFE_TARDE", key: "CAFE_TARDE"},
        {value: "JANTA", key: "JANTA"}
    ]

    const dataAlteracaoField = watch("dataAlteracao");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Minhas Informações"} />
            <form onSubmit={handleSubmit(createRefeicao)} onKeyDown={handleKeyDown} autoComplete="off">
                <section className={styled.contextForm}>
                    <div className={styled.row}>
                        <InputField
                            idInput="dataRegistro"
                            autoFocus
                            idDiv={styled.dataRegistroCampo}
                            label="Data de Registro*"
                            type="date"
                            register={register}
                            defaultValue={formatDateToISO(new Date())}
                            error={errors.dataRegistro}
                        />

                        <div className={styled.formGroup} id={styled.tipoRefeicaoCampo}>
                            <label htmlFor="tipoRefeicao">Tipo refeição*</label>
                            <Controller
                                name="tipoRefeicao"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Select
                                        showSearch
                                        id="tipoRefeicao"
                                        optionFilterProp="label"
                                        placeholder="Selecione uma opção"
                                        options={tipoRefeicao}
                                        value={field.value} 
                                        onChange={(val) => field.onChange(val)}
                                        status={fieldState.error ? "error" : ""}
                                    />
                                )}
                            /> 
                            {errors?.tipoRefeicao?.message && (
                                <p className={styled.errorMessage}>{errors.tipoRefeicao.message}</p>
                            )}
                        </div>
                    </div>
                </section>
                <FooterForm title={"Cadastrar"} updateDateField={dataAlteracaoField} />
            </form>
        </section>
    );
}

export default RefeicaoForm;