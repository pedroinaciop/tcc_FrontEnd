import ButtonForm from '../../Components/ButtonForm';
import InputField from '../../Components/InputField';
import styled from './FooterForm.module.css'
import { useForm } from 'react-hook-form';

const FooterForm = ({updateUserField, updateDateField, createDateField, createUserField, title}) => {
    const { register } = useForm();
    return (
        <footer className={styled.footer}>
            <div className={styled.buttons}>
                <ButtonForm type="submit" text={title} />
                <ButtonForm type="reset" text="Limpar" />
            </div>
            <div className={styled.updates}>
                <InputField
                    idDiv="createDate"
                    idInput="createDate"
                    label="Data de Criação"
                    type="text"
                    readOnly
                    text={createDateField}
                    register={register}
                />

                <InputField
                    idDiv="createUser"
                    idInput="createUser"
                    label="Usuário de Criação"
                    type="text"
                    readOnly
                    text={createUserField}
                    register={register}
                />
                
                <InputField
                    idDiv="updateDate"
                    idInput="updateDate"
                    label="Data de Alteração"
                    type="text"
                    readOnly
                    text={updateDateField}
                    register={register}
                />

                <InputField
                    idDiv="updateDate"
                    idInput="updateUser"
                    label="Usuário de Alteração"
                    type="text"
                    readOnly
                    text={updateUserField}
                    register={register}
                />
            </div>
        </footer>
    );
};

export default FooterForm;