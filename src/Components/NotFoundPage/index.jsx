import erro from '../../assets/images/404.svg';
import styled from './NaoEncontrada.module.css'

const NotFoundPage = () => {
    return (
        <div className={styled.container_erro}>
            <img className={styled.img404} src={erro} alt="Imagem 'Erro - Página não encontrada'" />
            <h2>Página não encontrada</h2>
            <p>Oops! A página que procura não existe.</p>
        </div>
    );
}

export default NotFoundPage;