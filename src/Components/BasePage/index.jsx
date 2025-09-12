import { Outlet } from "react-router-dom";
import PainelMenu from "../PainelMenu";
import styled from './BasePage.module.css';

function BasePage() {
    return (
        <div className={styled.basePage}>
            <PainelMenu />
            <div className={styled.content}>
                <Outlet />
            </div>
        </div>
    );
}

export default BasePage;