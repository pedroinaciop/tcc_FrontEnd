import styled from './ButtonForm.module.css';
const ButtonForm = ({ text, type }) => {
    return (
        <button className={styled.btnRegister} type={type}>
            {text}
        </button>
    );
}

export default ButtonForm;