import styled from './ButtonForm.module.css';
const ButtonForm = ({ text, type }) => {
    return (
        <button type={type} className={text === "Limpar" ? styled.btnLimpar : styled.btnRegister } >
            {text}
        </button>
    ); 
}

export default ButtonForm;