import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button } from 'antd';
import { confirmAlert } from 'react-confirm-alert';
import React, { useState, useEffect } from 'react';
import ProTable from '@ant-design/pro-table';
import styled from './UsuarioInfoPage.module.css';
import { NavLink } from 'react-router-dom';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import api from '../../services/api'
import * as XLSX from 'xlsx';

const UsuarioInfoPage = () => {
    const [keywords, setKeywords] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    const [userInfo, setUserInfo] = useState([]);

    const deleteUser = (id) => {
        api.delete(`info/usuarios/${id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { variant: "success", anchorOrigin: { vertical: "bottom", horizontal: "right" } });
            })
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Confirmação',
            message: 'Deseja excluir esse registro?',
            buttons: [
                {
                    label: 'Sim',
                    onClick: () => deleteUser(id)
                },
                {
                    label: 'Não',
                    onClick: () => { }
                }
            ]
        })
    };

    useEffect(() => {
        api.get('/info/usuarios', {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                setUserInfo(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])

    const columns = [
        { title: 'ID', dataIndex: 'id', width: 20},
        { title: 'DATA DE REGISTRO', dataIndex: 'dataRegistro', width: 200},
        { title: 'PESO ATUAL', dataIndex: 'pesoAtual'},
        { title: 'ALTURA', dataIndex: 'altura'},
        { title: 'IDADE', dataIndex: 'idade'},
        {
            title: 'EDITAR',
            width: 140,
            render: (_, row) => (
                <Button key="editar" href={`/info/usuarios/${row.id}`} onClick={() => window.alert('Confirmar atualização?')} icon={<EditOutlined />} >
                    Editar
                </Button>
            ),
        },
        {
            title: 'DELETAR',
            width: 140,
            render: (_, row) => (
                <Button key="deletar" href={`/info/usuarios/${row.id}`} onClick={(e) => e.preventDefault(confirmDelete(row.id))} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const handleDownload = () => {
        if (userInfo.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(userInfo);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Registros');
            XLSX.writeFile(wb, `registros_${today}_${month}_${year}.xlsx`);
        } else {
            enqueueSnackbar('Nenhum registro encontrado', { variant: 'info', anchorOrigin: { vertical: "bottom", horizontal: "right" } });
        }
    };
     
    const filterData = (data, keywords) => {
        if (!keywords) return data;
    
        return data.filter((item) =>
            item.dataRegistro?.toLowerCase().includes(keywords.toLowerCase()) ||
            item.pesoAtual?.toLowerCase().includes(keywords.toLowerCase()) 
        );
    };        

    return (
        <>
            <section className={styled.mainContent}>
                <header className={styled.header}>
                    <h1>Minhas Informações</h1>
                    <p>{userInfo.length} Registro(s) encontrado(s)</p>
                </header>
                <div className={styled.functions}>
                    <Input.Search
                        className={styled.input}
                        placeholder="Procure um registro"
                        onSearch={(value) => setKeywords(value)}
                    />
                    <div className={styled.buttons}>
                        <Button className={styled.button} type="primary" icon={<DownloadOutlined />} size="large" onClick={handleDownload}>
                            Baixar Dados
                        </Button>
                        <NavLink to={"novo"}>
                            <Button className={styled.button} type="primary" icon={<PlusOutlined />} size="large" >
                                Registro
                            </Button>
                        </NavLink>
                    </div>
                </div>
            </section>
            <ConfigProvider locale={ptBR}>
                <ProTable
                    rowKey="id"
                    size="large"
                    search={false}
                    bordered={false}
                    columns={columns}
                    dataSource={filterData(userInfo, keywords)}
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

export default UsuarioInfoPage;