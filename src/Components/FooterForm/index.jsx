import ButtonForm from '../../Components/ButtonForm';
import InputField from '../../Components/InputField';
import styled from './FooterForm.module.css'
import { useForm } from 'react-hook-form';

const FooterForm = ({updateDateField, includeDateField, title}) => {
    const { register } = useForm();
    return (
        <footer className={styled.footer}>
            <div className={styled.buttons}>
                <ButtonForm type="submit" text={title} />
                <ButtonForm type="reset" text="Limpar" />
            </div>
            <div className={styled.updates}>
                 <InputField
                    idDiv="includeDate"
                    idInput="includeDate"
                    label="Data de Inclusão"
                    type="text"
                    readOnly
                    text={includeDateField}
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
            </div>
        </footer>
    );
};

export default FooterForm;