import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./Components/NotFoundPage";
import PrivateRoute from "./Components/PrivateRoute";
import RegisterUser from "./Pages/RegisterPage";
import BasePage from "./Components/BasePage";
import LoginUser from "./Pages/LoginPage";
import UserForm from "./Pages/UserForm";
import UserPage from "./Pages/UserPage";
import UsuarioInfoForm from "./Pages/UsuarioInfoForm";
import UsuarioInfoPage from "./Pages/UsuarioInfoPage";
import RefeicaoForm from "./Pages/RefeicaoForm";
import RefeicaoPage from "./Pages/RefeicaoPage"
import MedidasForm from "./Pages/MedidasForm";
import MedidasPage from "./Pages/MedidasPage";

import "@ant-design/v5-patch-for-react-19";
import { SnackbarProvider } from "notistack";
import "./App.css";

function App() {
  return (
    <div className="App">
      <SnackbarProvider maxSnack={1} autoHideDuration={3000}> 
      <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginUser/>} />
            <Route path="/register" element={<RegisterUser/>} />
            
              <Route element={<PrivateRoute/>}>
                <Route path="/" element={<BasePage />}>
                  <Route path="*" element={<NotFoundPage />} />
                  
                  <Route path="/cadastros/usuarios" element={<UserPage/>} />
                  <Route path="/cadastros/usuarios/novo" element={<UserForm/>} />

                  <Route path="/info/usuario/" element={<UsuarioInfoPage/>} />
                  <Route path="/info/usuario/novo" element={<UsuarioInfoForm/>} />
                  <Route path="/editar/info/usuario/:id" element={<UsuarioInfoForm/>} />

                  <Route path="/medidas/" element={<MedidasPage/>} />
                  <Route path="/medidas/novo" element={<MedidasForm/>} />
                  <Route path="/editar/medidas/:id" element={<MedidasForm/>} />
                  
                  <Route path="/refeicao" element={<RefeicaoPage/>} />
                  <Route path="/refeicao/novo" element={<RefeicaoForm/>} />

                </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </div>
  );
}

export default App;