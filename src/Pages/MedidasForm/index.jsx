import { formattedFieldDateDefault, } from '../../utils/formatDate';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './MedidasForm.module.css';
import { Controller } from "react-hook-form";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import { z } from 'zod';

const MedidasForm = () => {
    const { id } = useParams();
    const updateDate = new Date();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);

    const createMedidasFormSchema = z.object({
        dataRegistro: z.coerce.date().default(new Date()),

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

        medidaAntebracoDireito: z.number()
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

        altura: z.string(),
    });

    const { control, register, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: zodResolver(createMedidasFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createMedidas = (data) => {
        console.log(data);
        api.post('cadastros/registro/saude/novo', {
            dataRegistro: formattedFieldDateDefault(data.dataRegistro),
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
            navigate('/medidas/')
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
            api.get(`/registro/saude/${id}`)
                .then(response => {
                    const medidas = response.data;
                    console.log(medidas);
                    reset({
                        dataRegistro: medidas.dataRegistro,
                        pesoAtual: medidas.pesoAtual,
                        pesoDesejado: medidas.pesoDesejado,
                        medidaCintura: medidas.medidaCintura,
                        medidaQuadril: medidas.medidaQuadril,
                        medidaTorax: medidas.medidaTorax,
                        medidaBracoDireito: medidas.medidaBracoDireito,
                        medidaBracoEsquerdo: medidas.medidaBracoEsquerdo,
                        medidaAntebracoDireito: medidas.medidaAntebracoDireito,
                        medidaAntebracoEsquerdo: medidas.medidaAntebracoEsquerdo,
                        medidaCoxaDireita: medidas.medidaCoxaDireita,
                        medidaCoxaEsquerda: medidas.medidaCoxaEsquerda,
                        medidaPanturrilhaDireita: medidas.medidaPanturrilhaDireita,
                        medidaPanturrilhaEsquerda: medidas.medidaPanturrilhaEsquerda,
                        altura: medidas.altura,
                        dataAlteracao: medidas.dataAlteracao,
                    });
                })
                .catch(error => {
                    enqueueSnackbar("Erro ao carregar medidas", { variant: "error", anchorOrigin: { vertical: "bottom", horizontal: "right"}});
                })
                .finally(() => setLoading(false));
            }
    }, []);

    const dataAlteracaoField = watch("dataAlteracao");
    const dataInclusaoField = watch("dataInclusao");

    return (
        <section className={styled.appContainer}>
            <HeaderForm title={"Medidas"} />
            <form onSubmit={handleSubmit(createMedidas)} onKeyDown={handleKeyDown} autoComplete="off">
                <section className={styled.contextForm}>
                    <div className={styled.row}>
                        <InputField
                            idInput="dataRegistro"
                            autoFocus
                            idDiv={styled.dataRegistroCampo}
                            label="Data de Registro*"
                            type="date"
                            register={register}
                            defaultValue={formattedFieldDateDefault(new Date())}
                            error={errors.dataRegistro}
                        />

                        <InputField
                            idInput="altura"
                            idDiv={styled.alturaCampo}
                            label="Altura"
                            type="numberformat"
                            controller={Controller}
                            control={control}
                            valueAsNumber={true}
                            error={errors.altura}
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
                <FooterForm title={ id ? "Editar" : "Cadastrar"} updateDateField={dataAlteracaoField} />
            </form>
        </section>
    );
}

export default MedidasForm;