import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import { confirmAlert } from 'react-confirm-alert';
import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import styled from './UserPage.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import * as XLSX from 'xlsx';

const UserPage = () => {
    const [keywords, setKeywords] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState([]);

    const deleteUser = (usuario_id) => {
        api.delete(`usuarios/${usuario_id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            })
    };

    const confirmDelete = (usuario_id) => {
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja excluir esse usuário?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => deleteUser(usuario_id)
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        })
    };

    useEffect(() => {
        api.get('/usuarios', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                setUsers(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])

    const columns = [
        { title: 'ID', dataIndex: 'usuario_id', width: 50,},
        { title: 'NOME COMPLETO', dataIndex: 'nomeCompleto'},
        { title: 'EMAIL', dataIndex: 'email'},
        { title: 'ÚLTIMA ALTERAÇÃO', dataIndex: 'updateDate'},
        {
            title: 'EDITAR',
            width: 140,
            render: (_, row) => (
                <Button key="editar" href={`/cadastros/usuarios/${row.user_id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            width: 140,
            render: (_, row) => (
                <Button key="deletar" href={`/cadastros/usuarios/${row.user_id}`} onClick={(e) => e.preventDefault(confirmDelete(row.user_id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        if (users.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(users);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Usuários');
            XLSX.writeFile(wb, `usuarios_${today}_${month}+${year}.xlsx`);
        } else {
            enqueueSnackbar('Nenhum usuário cadastrado', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }
    };
     
    const filterData = (data, keywords) => {
        if (!keywords) return data;
    
        return data.filter((item) =>
            item.fullName?.toLowerCase().includes(keywords.toLowerCase()) ||
            item.email?.toLowerCase().includes(keywords.toLowerCase()) 
        );
    };        

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Usuários</h1>
                    <p>{users.length} Usuário(s) cadastrado(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure um Usuário"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Usuário
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <ConfigProvider locale={ptBR}>
                <ProTable
                    rowKey="user_id"
                    size="large"
                    search={false}
                    bordered={false}
                    columns={columns}
                    dataSource={filterData(users, keywords)}
                    params={{ keywords }}
                    pagination={{
                        pageSize: 4,
                        showQuickJumper: true,
                    }}
                />
            </ConfigProvider>
        </>
    );
}

export default UserPage;