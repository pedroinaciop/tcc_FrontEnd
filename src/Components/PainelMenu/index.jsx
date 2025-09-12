import { FileOutlined, UserOutlined, HomeOutlined, SolutionOutlined, PlusOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Menu, Avatar, Space, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import styled from "./PainelMenu.module.css";
import { enqueueSnackbar } from 'notistack';
const { Sider } = Layout;

function getItem(label, key, icon, children, pathname) {
  return {
    key,
    icon,
    children,
    label,
    pathname
  };
}

const items = [
  getItem('Home', '1', <HomeOutlined />, null, '/home'),
  getItem('Dados Corporais', '2', <SolutionOutlined />, null, '/usuario/informacoes'),
  getItem('Registrar Refeições', '3', <PlusOutlined />, null, '/cadastros/refeicao'),
 
  getItem('Relatórios', '4', <FileOutlined />, [
    getItem('Refeições por período', '5', null, null, '/cadastros/entrada'),
  ]),
];

const PainelMenu = () => {
  const navigate = useNavigate();
  const user = sessionStorage.getItem("user");
  const [collapsed, setCollapsed] = useState(false);

  const handleClick = (e) => {
    const item = e.item;
    if (item.pathname) {
      navigate(item.pathname);
    }
  };

  const mapItems = (items) => {
    return items.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      children: item.children ? mapItems(item.children) : undefined,
      onClick: () => handleClick({ item }),
    }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login"); 

    enqueueSnackbar('Usuário desconectado com sucesso!', { variant: 'success', anchorOrigin: { vertical: 'bottom', horizontal: 'right' } });
  };

  return (
    <Sider 
      className={styled.sider}  
      breakpoint="md" 
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      collapsedWidth="50"
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
    >
      <Space className={styled.userData} direction="vertical">
        { collapsed ? (
          <>
            <Avatar size={40} icon={<UserOutlined />} />
            <Button 
              type="primary" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
            >
            </Button>
          </>
          ) : (
            <>
              <Avatar size={64} icon={<UserOutlined />} />
              <p className={styled.userName}>{user}</p>
              <Button
                className={styled.logoutButton}
                type="primary" 
                danger 
                icon={<LogoutOutlined />} 
                onClick={handleLogout}
              >
                  Desconectar
              </Button>
            </>
          )
        }
      </Space>
      <Menu theme="dark" 
        defaultSelectedKeys={['1']} 
        mode="inline" 
        items={mapItems(items)} />
    </Sider>
  );
};

export default PainelMenu;
