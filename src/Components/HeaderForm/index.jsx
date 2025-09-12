import styled from './HeaderForm.module.css';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Voltar from '../../assets/images/voltar.png';

const HeaderForm = ({ title }) => {
    const navigate = useNavigate();
    return (
        <header className={styled.header}>
            <div className={styled.titleHeader}>
                <Button className={styled.btnVoltar} onClick={() => navigate(-1)} >
                    <img className={styled.backButton} src={Voltar} alt="Botão para Voltar"/>
                </Button>
                <h1>{title}</h1>
            </div>
            <p>Campos com (*) são obrigatórios</p>
        </header>
    );
};

export default HeaderForm;