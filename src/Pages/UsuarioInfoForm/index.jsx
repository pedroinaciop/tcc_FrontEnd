import { formatDateToISO, formatDateToInvertedISO, formatDateToBrazilian } from '../../utils/formatDate';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './UsuarioInfoForm.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import { Select } from 'antd';
import { z } from 'zod';
import { useState, useEffect } from 'react';

const UsuarioInfoForm = () => {
    const usuario_id = sessionStorage.getItem("usuario_id");
    const { id } = useParams();
    const updateDate = new Date();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [idade, setIdade] = useState(0);
    const formattedDateTime = `${updateDate.toLocaleDateString('pt-BR')} ${updateDate.toLocaleTimeString('pt-BR')}`;

    const createUserFormSchema = z.object({
        dataNascimento: z.string()
            .nonempty(`Campo obrigatório (formato: DD/MM/AAAA)`),

        idade: z.string(),

        sexoBiologico: z.enum(['MASCULINO', 'FEMININO', 'NAO_ESPECIFICAR'], {
            errorMap: () => ({ message: "Campo obrigatório" })
        }),  
        
        objetivo: z.string()
            .max(255, "O objetivo não pode ultrapassar 255 caracteres")
            .nonempty("Campo obrigatório"),

        nivelAtividadeFisica: z.enum(['SEDENTARIO', 'LEVE', 'MODERADO', 'INTENSO'], {
            errorMap: () => ({ message: "Campo obrigatório" })
        }),

        alergias: z.array(z.string())
            .optional(),

        intolerancias: z.array(z.string())
            .optional(),

        doencasPreExistentes: z.array(z.string())
            .optional(),
    });

    const { control, register, handleSubmit, formState: { errors }, watch, reset, setValue } = useForm({
        resolver: zodResolver(createUserFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const nivelAtividadeFisicaOptions = [
        {value: 'LEVE', label: 'Leve'},
        {value: 'MODERADO', label: 'Moderado'},
        {value: 'INTENSO', label: 'Intenso'},
        {value: 'SEDENTARIO', label: 'Sedentário'}
    ]

    const doencasPreExistentesOptions = [
        { value: 'Diabetes', label: 'Diabetes' },
        { value: 'Hipertensão arterial', label: 'Hipertensão arterial' },
        { value: 'Asma', label: 'Asma' },
    ];

    const alergiasOptions = [
        { value: 'Frutos do mar', label: 'Frutos do mar' },
        { value: 'Amendoim', label: 'Amendoim' }
    ];

    const intoleranciasOptions = [
        { value: 'Lactose', label: 'Lactose' },
        { value: 'Glúten', label: 'Glúten' }
    ];

    const sexoBiologicoOptions = [
        { value: 'MASCULINO', label: 'Masculino' },
        { value: 'FEMININO', label: 'Feminino' },
        { value: 'NAO_ESPECIFICAR', label: 'Não especificar' }
    ];

    useEffect(() => {
        const dataNascimento = watch("dataNascimento");
        if (!dataNascimento) return;

        const dataObj = new Date(dataNascimento);
        const hoje = new Date();

        let idadeCalculada = hoje.getFullYear() - dataObj.getFullYear();
        if (
            hoje.getMonth() < dataObj.getMonth() ||
            (hoje.getMonth() === dataObj.getMonth() && hoje.getDate() < dataObj.getDate())
        ) {
            idadeCalculada--;
        }

        setIdade(idadeCalculada);      
        setValue("idade", idadeCalculada); 
    }, [watch("dataNascimento"), setValue]);

    const createInfoUser = (data) => {
        console.log(data);
        api.post('cadastros/info/usuarios/novo', {
            dataRegistro: formattedDateTime,
            dataNascimento: formatDateToISO(data.dataNascimento, 1),
            idade: data.idade,
            sexoBiologico: data.sexoBiologico,
            nivelAtividadeFisica: data.nivelAtividadeFisica,
            objetivo: data.objetivo,
            alergias: (data.alergias && data.alergias.length > 0) ? data.alergias.join(", ") : 'Sem alergias',
            doencasPreExistentes: (data.doencasPreExistentes && data.doencasPreExistentes.length > 0) ? data.doencasPreExistentes.join(", ") : 'Sem doenças pré-existentes',
            intolerancias: (data.intolerancias && data.intolerancias.length > 0) ? data.intolerancias.join(", ") : 'Sem intolerâncias',
            usuario: {
                id: usuario_id
            }
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

    useEffect(() => {
        if (id) {
            setLoading(true);
            api.get(`info/usuarios/${usuario_id}`)
                .then(response => {
                    const infoUser = response.data;
                    reset({
                        dataRegistro: infoUser.dataRegistro,
                        dataNascimento: formatDateToInvertedISO(infoUser.dataNascimento, 1),
                        idade: infoUser.idade,
                        sexoBiologico: infoUser.sexoBiologico,
                        nivelAtividadeFisica: infoUser.nivelAtividadeFisica,
                        objetivo: infoUser.objetivo,
                        alergias: infoUser.alergias,
                        intolerancias: infoUser.intolerancias,
                        doencasPreExistentes: infoUser.doencasPreExistentes,
                        dataAlteracao: infoUser.dataAlteracao,
                    });
                })
                .catch(error => {
                    enqueueSnackbar("Erro ao carregar categoria", { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right"}});
                })
                .finally(() => setLoading(false));
            }
    }, []);

    const dataAlteracaoField = watch("dataAlteracao");
    const dataRegistroField = watch("dataRegistro");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Minhas Informações"} />
            <form onSubmit={handleSubmit(createInfoUser)} onKeyDown={handleKeyDown} autoComplete="off">
                <section className={styled.contextForm}>
                    <div className={styled.row}>
                        <InputField
                            idInput="dataNascimento"
                            autoFocus
                            idDiv={styled.dataNascimentoCampo}
                            label="Data de Nascimento"
                            obrigatorio={true}
                            type="date"
                            register={register}
                            error={errors.dataNascimento}
                        />

                        <InputField
                            idInput="idade"
                            idDiv={styled.idadeCampo}
                            label="Idade"
                            type="number"
                            readOnly                                                
                            {...register("idade")}
                        />

                        <div className={styled.formGroup} id={styled.sexoBiologicoCampo}>
                            <label htmlFor="sexoBiologico">Sexo Biológico<span className={styled.obrigatorio}>*</span></label>
                            <Controller
                                name="sexoBiologico"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size='large'
                                        showSearch
                                        id="sexoBiologico"
                                        optionFilterProp="label"
                                        placeholder="Selecione uma opção"
                                        options={sexoBiologicoOptions}
                                        value={field.value} 
                                        onChange={(val) => field.onChange(val)}
                                        
                                    />
                                )}
                            /> 
                            {errors?.sexoBiologico?.message && (
                                <p className={styled.errorMessage}>{errors.sexoBiologico.message}</p>
                            )}
                        </div>
                    </div>

                    <div className={styled.row}>
                        

                        <div className={styled.formGroup} id={styled.doencasPreExistentesCampo}>
                            <label htmlFor="doencasPreExistentes" id='doencasPreExistentes'>Doenças Pré-Existentes</label>
                            <Controller
                                name="doencasPreExistentes"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size='large'
                                        {...field}
                                        mode="multiple"
                                        id="doencasPreExistentes"
                                        placeholder="Selecione suas doenças pré-existentes"
                                        options={doencasPreExistentesOptions}
                                        value={field.value} 
                                        onChange={(val) => field.onChange(val)}
                                        
                                    />
                                )}
                                />
                                {errors.doencasPreExistentes && (
                                    <p className="error">{errors.doencasPreExistentes.message}</p>
                                )}
                        </div>

                        <div className={styled.formGroup} id={styled.alergiasCampo}>
                        <label htmlFor="alergias" id='alergias'>Alergias</label>
                            <Controller
                                name="alergias"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size='large'
                                        {...field}
                                        mode="multiple"
                                        id="alergias"
                                        placeholder="Selecione suas alergias"
                                        options={alergiasOptions}
                                        value={field.value} 
                                        onChange={(val) => field.onChange(val)}
                                        
                                    />
                                )}
                                />
                                {errors.alergias && (
                                    <p className="error">{errors.alergias.message}</p>
                                )}
                        </div>

                        <div className={styled.formGroup} id={styled.intoleranciasCampo}>
                        <label htmlFor="intolerancias" id='intolerancias'>Intolerâncias</label>
                            <Controller
                                name="intolerancias"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size='large'
                                        {...field}
                                        mode="multiple"
                                        id="intolerancias"
                                        placeholder="Selecione suas intolerâncias"
                                        options={intoleranciasOptions}
                                        value={field.value} 
                                        onChange={(val) => field.onChange(val)}
                                        
                                    />
                                )}
                                />
                                {errors.intolerancias && (
                                    <p className="error">{errors.intolerancias.message}</p>
                                )}
                        </div>
                    </div>

                    <div className={styled.row}>
                        <div className={styled.formGroup} id={styled.sexoBiologicoCampo}>
                            <label htmlFor="nivelAtividadeFisica">Nível de atividade física<span className={styled.obrigatorio}>*</span></label>
                            <Controller
                                name="nivelAtividadeFisica"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        size='large'
                                        showSearch
                                        id="nivelAtividadeFisica"
                                        optionFilterProp="label"
                                        placeholder="Selecione uma opção"
                                        options={nivelAtividadeFisicaOptions}
                                        value={field.value} 
                                        onChange={(val) => field.onChange(val)}
                                    />
                                )}
                            /> 
                            {errors?.nivelAtividadeFisica?.message && (
                                <p className={styled.errorMessage}>{errors.nivelAtividadeFisica.message}</p>
                            )}
                        </div>

                        <InputField
                            idInput="objetivo"
                            idDiv={styled.objetivoCampo}
                            label="Objetivo"
                            type="text"
                            obrigatorio={true}
                            register={register}
                            error={errors.objetivo}
                        />
                    </div>
                </section>
                <FooterForm title={ id ? "Editar" : "Cadastrar"} updateDateField={dataAlteracaoField} includeDateField={dataRegistroField}/>
            </form>
        </section>
    );
}

export default UsuarioInfoForm;