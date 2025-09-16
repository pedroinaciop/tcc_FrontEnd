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
    const formattedDate = `${updateDate.toLocaleDateString('pt-BR')}`;
    console.log(formattedDate);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const createUserFormSchema = z.object({
        dataRegistro: z.coerce.date().default(new Date()),

        dataNascimento: z.coerce.date().optional(),

        idade: z.number()
            .min(0, "A idade não pode ser negativa")
            .max(150, "A idade não pode ser maior que 150"),

        sexoBiologico: z.enum(['MASCULINO', 'FEMININO', 'NÃO ESPECIFICAR'], {
            errorMap: () => ({ message: "O sexo é obrigatório" })
        }),  
        
        objetivo: z.string()
            .max(255, "O objetivo não pode ultrapassar 255 caracteres")
            .optional(),

        nivelAtividadeFisica: z.enum(['SEDENTARIO', 'LEVE', 'MODERADO', 'INTENSO'], {
            errorMap: () => ({ message: "O nível de atividade física é obrigatório" })
        }),

       alergias: z.string()
            .max(500, "A alergia não pode ultrapassar 500 caracteres")
            .optional(),

        intolerancias: z.string()
            .max(500, "A alergia não pode ultrapassar 500 caracteres")
            .optional(),

        doencasPreExistentes: z.string()
            .max(500, "A doença não pode ultrapassar 500 caracteres")
            .optional(),

        pesoAtual: z.number()
            .min(0, "O peso não pode ser negativo")
            .optional(),

        pesoDesejado: z.number()
            .min(0, "O peso desejado não pode ser negativo")
            .optional(),

        medidaCintura: z.number()
            .min(0, "A medida da cintura não pode ser negativa")
            .optional(),

        medidaQuadril: z.number()
            .min(0, "A medida do quadril não pode ser negativa")
            .optional(),

        medidaTorax: z.number()
            .min(0, "A medida do torax não pode ser negativa"), 

        medidaBracoDireito: z.number()
            .min(0, "A medida do braço não pode ser negativa")
            .optional(),

        medidaBracoEsquerdo: z.number()
            .min(0, "A medida do braço não pode ser negativa")
            .optional(),

        medidadeAntebracoDireito: z.number()
            .min(0, "A medida do antebraço não pode ser negativa")
            .optional(),

        medidaAntebracoEsquerdo: z.number()
            .min(0, "A medida do antebraço não pode ser negativa")
            .optional(),

        medidaCoxaDireita: z.number()
            .min(0, "A medida da coxa não pode ser negativa")
            .optional(),

        medidaCoxaEsquerda: z.number()
            .min(0, "A medida da coxa não pode ser negativa")
            .optional(),

        medidaPanturrilhaDireita: z.number()
            .min(0, "A medida da panturrilha não pode ser negativa")
            .optional(),

        medidaPanturrilhaEsquerda: z.number()
            .min(0, "A medida da panturrilha não pode ser negativa")
            .optional(),

        altura: z.number()
            .min(0, "A altura não pode ser negativa")
            .optional(),
    });

    const { register, handleSubmit, formState: { errors }, watch } = useForm({
        resolver: zodResolver(createUserFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createInfoUser = (data) => {
        console.log(data);
        api.post('cadastros/info/usuarios/novo', {
            dataRegistro: formattedDate,
            dataNascimento: formattedDate,
            idade: data.idade,
            sexoBiologico: data.sexoBiologico,
            nivelDeAtividadeFisica: data.nivelDeAtividadeFisica,
            objetivo: data.objetivo,
            alergias: data.alergias,
            intolerancias: data.intolerancias,
            doencasPreExistentes: data.doencasPreExistentes,
            pesoAtual: data.pesoAtual,
            pesoDesejado: data.pesoDesejado,
            medidaCintura: data.medidaCintura,
            medidaQuadril: data.medidaQuadril,
            medidaTorax: data.medidaTorax,
            medidaBracoDireito: data.medidaBracoDireito,
            medidaBracoEsquerdo: data.medidaBracoEsquerdo,
            medidaAntebracoDireito: data.medidaAntebracoDireito,
            medidaAntebracoEsquerdo: data.medidaAntebracoEsquerdo,
            medidaCoxaDireita: data.medidaCoxaDireita,
            medidaCoxaEsquerda: data.medidaCoxaEsquerda,
            medidaPanturrilhaDireita: data.medidaPanturrilhaDireita,
            medidaPanturrilhaEsquerda: data.medidaPanturrilhaEsquerda,
            altura: data.altura,
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

    const dataAlteracaoField = watch("dataAlteracao");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Minhas Informações"} />
            <form onSubmit={handleSubmit(createInfoUser)} onKeyDown={handleKeyDown} autoComplete="off">
                <section className={styled.contextForm}>
                    <div className={styled.row}>
                        <InputField
                            idInput="dataRegistro"
                            autoFocus
                            idDiv={styled.dataRegistroCampo}
                            label="Data de Registro*"
                            type="date"
                            register={register}
                            error={errors.dataRegistro}
                        />

                         <InputField
                            idInput="dataNascimento"
                            autoFocus
                            idDiv={styled.dataNascimentoCampo}
                            label="Data de Nascimento*"
                            type="date"
                            register={register}
                            error={errors.dataNascimento}
                        />

                        <InputField
                            idInput="idade"
                            idDiv={styled.idadeCampo}
                            label="Idade"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.idade}
                        />

                        <InputField
                            idInput="altura"
                            idDiv={styled.alturaCampo}
                            label="Altura"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.altura}
                        />
                    </div>

                    <div className={styled.row}>
                        <InputField
                            idInput="sexoBiologico"
                            idDiv={styled.sexoBiologicoCampo}
                            label="Sexo Biológico*"
                            type="text"
                            register={register}
                            error={errors.sexoBiologico}
                        />

                        <InputField
                            idInput="doencasPreExistentes"
                            idDiv={styled.doencasPreExistentesCampo}
                            label="Doenças Pré-Existentes*"
                            type="text"
                            register={register}
                            error={errors.doencasPreExistentes}
                        />

                        <InputField
                            idInput="alergias"
                            idDiv={styled.alergiasCampo}
                            label="Alergias*"
                            type="text"
                            register={register}
                            error={errors.alergias}
                        />


                        <InputField
                            idInput="intolerancias"
                            idDiv={styled.intoleranciasCampo}
                            label="intolerâncias*"
                            type="text"
                            register={register}
                            error={errors.intolerancias}
                        />
                    </div>

                    <div className={styled.row}>
                        <InputField
                            idInput="nivelAtividadeFisica"
                            idDiv={styled.nivelAtividadeFisicaCampo}
                            label="Nível de Atividade Física*"
                            type="text"
                            register={register}
                            error={errors.nivelAtividadeFisica}
                        />

                         <InputField
                            idInput="pesoAtual"
                            idDiv={styled.pesoAtualCampo}
                            label="Peso Atual*"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.pesoAtual}
                        />

                        <InputField
                            idInput="pesoDesejado"
                            idDiv={styled.pesoDesejadoCampo}
                            label="Peso Desejado*"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.pesoDesejado}
                        />

                        <InputField
                            idInput="objetivo"
                            idDiv={styled.objetivoCampo}
                            label="Objetivo*"
                            type="text"
                            register={register}
                            error={errors.objetivo}
                        />    
                    </div>

                    <div className={styled.row}>
                        <InputField
                            idInput="medidaCintura"
                            idDiv={styled.medidaCinturaCampo}
                            label="Medida da Cintura"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaCintura}
                        />

                        <InputField
                            idInput="medidaQuadril"
                            idDiv={styled.medidaQuadrilCampo}
                            label="Medida do Quadril"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaQuadril}
                        />

                        <InputField
                            idInput="medidaTorax"
                            idDiv={styled.medidaToraxCampo}
                            label="Medida do Tórax"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaTorax}
                        />

                        <InputField
                            idInput="medidaBracoDireito"
                            idDiv={styled.medidaBracoDireitoCampo}
                            label="Medida do Braço Direito"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaBracoDireito}
                        />

                        <InputField
                            idInput="medidaBracoEsquerdo"
                            idDiv={styled.medidaBracoEsquerdoCampo}
                            label="Medida do Braço Esquerdo"
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaBracoEsquerdo}
                        />
                    </div>

                    <div className={styled.row}>
                        <InputField
                            idInput="medidaAntebracoDireito"
                            idDiv={styled.medidaAntebracoDireitoCampo}
                            label="Medida do Antebraço Dir."
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaAntebracoDireito}
                        />
                        
                        <InputField
                            idInput="medidaAntebracoEsquerdo"
                            idDiv={styled.medidaAntebracoEsquerdoCampo}
                            label="Medida do Antebraço Esq."
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaAntebracoEsquerdo}
                        />

                        <InputField
                            idInput="medidaCoxaDireita"
                            idDiv={styled.medidaCoxaCampo}
                            label="Medida da Coxa Dir."
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaCoxaDireita}
                        />

                        <InputField
                            idInput="medidaCoxaEsquerda"
                            idDiv={styled.medidaCoxaCampo}
                            label="Medida da Coxa Esq."
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaCoxaEsquerda}
                        />

                        <InputField
                            idInput="medidaPanturrilhaDireita"
                            idDiv={styled.medidaPanturrilhaDireitaCampo}
                            label="Medida da Panturrilha Dir."
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaPanturrilhaDireita}
                        />

                        <InputField
                            idInput="medidaPanturrilhaEsquerda"
                            idDiv={styled.medidaPanturrilhaEsquerdaCampo}
                            label="Medida da Panturrilha Esq."
                            type="number"
                            valueAsNumber={true}
                            defaultValue={0}
                            min={0}
                            register={register}
                            error={errors.medidaPanturrilhaEsquerda}
                        />
                    </div>
                </section>
                <FooterForm title={"Cadastrar"} updateDateField={dataAlteracaoField} />
            </form>
        </section>
    );
}

export default UsuarioInfoForm;