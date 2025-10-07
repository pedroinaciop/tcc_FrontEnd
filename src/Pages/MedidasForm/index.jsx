import { formatDateToISO, formatDateToInvertedISO } from '../../utils/formatDate';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import HeaderForm from '../../Components/HeaderForm';
import FooterForm from '../../Components/FooterForm';
import InputField from '../../Components/InputField';
import styled from './MedidasForm.module.css';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import { z } from 'zod';

import medidas  from '../../assets/images/medidas_corpo.png'

const MedidasForm = () => {
    const { id } = useParams();
    const updateDate = new Date();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const usuario_id = sessionStorage.getItem("usuario_id");

    const createMedidasFormSchema = z.object({
        dataRegistro: z.coerce.date().default(new Date()),

        altura: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "Altura não pode ser negativa"),

        pesoAtual: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "O peso não pode ser negativo"),

        pesoDesejado: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "O peso desejado não pode ser negativo"),

        medidaCintura: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida da cintura não pode ser negativa"),

        medidaQuadril: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida do quadril não pode ser negativa"),

        medidaTorax: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida do torax não pode ser negativa"), 

        medidaBracoDireito: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida do braço não pode ser negativa"),

        medidaBracoEsquerdo: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida do braço não pode ser negativa"),

        medidaCoxaDireita: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida da coxa não pode ser negativa"),

        medidaCoxaEsquerda: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida da coxa não pode ser negativa"),

        medidaPanturrilhaDireita: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida da panturrilha não pode ser negativa"),

        medidaPanturrilhaEsquerda: z.number({ invalid_type_error: "Campo obrigatório" })
            .min(0, "A medida da panturrilha não pode ser negativa"),
    });

    const { control, register, handleSubmit, formState: { errors }, watch, reset } = useForm({
        resolver: zodResolver(createMedidasFormSchema),
    });

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    const createMedida = (data) => {
        api.post('cadastros/medida/novo', {
            dataRegistro: formatDateToISO(data.dataRegistro, 1),
            pesoAtual: data.pesoAtual,
            pesoDesejado: data.pesoDesejado,
            medidaCintura: data.medidaCintura,
            medidaQuadril: data.medidaQuadril,
            medidaTorax: data.medidaTorax,
            medidaBracoDireito: data.medidaBracoDireito,
            medidaBracoEsquerdo: data.medidaBracoEsquerdo,
            medidaCoxaDireita: data.medidaCoxaDireita,
            medidaCoxaEsquerda: data.medidaCoxaEsquerda,
            medidaPanturrilhaDireita: data.medidaPanturrilhaDireita,
            medidaPanturrilhaEsquerda: data.medidaPanturrilhaEsquerda,
            altura: data.altura,
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
            api.get(`/medida/${id}`)
                .then(response => {
                    const medidas = response.data;
                    reset({
                        dataRegistro: formatDateToInvertedISO(medidas.dataRegistro, 1),
                        pesoAtual: medidas.pesoAtual,
                        pesoDesejado: medidas.pesoDesejado,
                        medidaCintura: medidas.medidaCintura,
                        medidaQuadril: medidas.medidaQuadril,
                        medidaTorax: medidas.medidaTorax,
                        medidaBracoDireito: medidas.medidaBracoDireito,
                        medidaBracoEsquerdo: medidas.medidaBracoEsquerdo,
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
            <form onSubmit={handleSubmit(createMedida)} onKeyDown={handleKeyDown} autoComplete="off">
                <main className={styled.contextForm}>
                    <section className={styled.campos}>
                        <div className={styled.row}>
                            <InputField
                                idInput="dataRegistro"
                                autoFocus
                                idDiv={styled.dataRegistroCampo}
                                label="Data de Registro"
                                obrigatorio={true}
                                type="date"
                                register={register}
                                defaultValue={formatDateToISO(new Date(), 0)}
                                error={errors.dataRegistro}
                            />

                            <InputField
                                idInput="altura"
                                idDiv={styled.alturaCampo}
                                label="Altura (M, CM)"
                                type="number"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                step="0.01"
                                register={register}
                                error={errors.altura}
                            />

                            <InputField
                                idInput="pesoAtual"
                                idDiv={styled.pesoAtualCampo}
                                label="Peso Atual (KG)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.pesoAtual}
                            />

                            <InputField
                                idInput="pesoDesejado"
                                idDiv={styled.pesoDesejadoCampo}
                                label="Peso Desejado (KG)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.pesoDesejado}
                            /> 
                        </div>

                        <div className={styled.row}>
                            <InputField
                                idInput="medidaTorax"
                                idDiv={styled.medidaToraxCampo}
                                label="Medida do Tórax (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaTorax}
                            />

                            <InputField
                                idInput="medidaCintura"
                                idDiv={styled.medidaCinturaCampo}
                                label="Medida da Cintura (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaCintura}
                            />

                            <InputField
                                idInput="medidaQuadril"
                                idDiv={styled.medidaQuadrilCampo}
                                label="Medida do Quadril (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaQuadril}
                            />
                        </div>

                        <div className={styled.row}>
                            <InputField
                                idInput="medidaBracoDireito"
                                idDiv={styled.medidaBracoDireitoCampo}
                                label="Medida do Braço Direito (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaBracoDireito}
                            />

                            <InputField
                                idInput="medidaBracoEsquerdo"
                                idDiv={styled.medidaBracoEsquerdoCampo}
                                label="Medida do Braço Esquerdo (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaBracoEsquerdo}
                            />
                        </div>

                        <div className={styled.row}>
                            <InputField
                                idInput="medidaCoxaDireita"
                                idDiv={styled.medidaCoxaDireitaCampo}
                                label="Medida da Coxa Dir. (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaCoxaDireita}
                            />

                            <InputField
                                idInput="medidaCoxaEsquerda"
                                idDiv={styled.medidaCoxaEsquerdaCampo}
                                label="Medida da Coxa Esq. (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaCoxaEsquerda}
                            />
                        </div>

                        <div className={styled.row}>
                            <InputField
                                idInput="medidaPanturrilhaDireita"
                                idDiv={styled.medidaPanturrilhaDireitaCampo}
                                label="Medida da Panturrilha Dir. (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaPanturrilhaDireita}
                            />

                            <InputField
                                idInput="medidaPanturrilhaEsquerda"
                                idDiv={styled.medidaPanturrilhaEsquerdaCampo}
                                label="Medida da Panturrilha Esq. (CM)"
                                type="number"
                                step="0.01"
                                obrigatorio={true}
                                valueAsNumber={true}
                                min={0}
                                register={register}
                                error={errors.medidaPanturrilhaEsquerda}
                            />
                        </div>
                    </section>
                    <figure className={styled.secaoImagem}>
                       <img className={styled.imagem} src={medidas} alt="Imagem de referência das medidas do corpo humano" /> 
                    </figure> 
                </main>
                <FooterForm title={ id ? "Editar" : "Cadastrar"} updateDateField={dataAlteracaoField} dataInclusaoField={dataInclusaoField}/>
            </form>
        </section>
    );
}

export default MedidasForm;