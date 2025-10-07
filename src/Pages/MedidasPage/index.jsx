import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ConfigProvider, Input, Button, Modal } from 'antd';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from './MedidasPage.module.css';
import ProTable from '@ant-design/pro-table';
import { useState, useEffect } from 'react';
import ptBR from 'antd/lib/locale/pt_BR';
import { useSnackbar } from 'notistack';
import api from '../../services/api';
import * as XLSX from 'xlsx';

const MedidasPage = () => {
    const usuario_id = sessionStorage.getItem("usuario_id");
    const navigate = useNavigate();
    const [keywords, setKeywords] = useState('');
    const [medidas, setMedidas] = useState([]);
    const { enqueueSnackbar } = useSnackbar();

    const columns = [
        { title: 'DATA DE REGISTRO', dataIndex: 'dataRegistro', width: 200},
        { title: 'PESO ATUAL', dataIndex: 'pesoAtual'},
        { title: 'PESO DESEJADO', dataIndex: 'pesoDesejado'},
        { title: 'ALTURA', dataIndex: 'altura'},
        {
            title: 'EDITAR',
            width: 140,
            render: (_, row) => (
                <Button key="editar" onClick={() => navigate(`/editar/medidas/${row.id}`)} icon={<EditOutlined />}>
                    Editar
                </Button>
            ), 
        },
        {
            title: 'DELETAR',
            width: 140,
            render: (_, row) => (
               <Button key="deletar" href={`/medida/${row.id}`} onClick={(e) => {e.preventDefault(confirmDelete(row.id))}} icon={<DeleteOutlined />}>
                    Deletar
                </Button>
            ),
        },
    ];

    const confirmDelete = (id) => {
        Modal.confirm({
            title: "Confirmar exclusão",
            content: "Tem certeza que deseja deletar este usuário?",
            okText: "Sim",
            okType: "danger",
            cancelText: "Não",
            onOk: () => deleteUser(id),
        });
    };

    const deleteUser = (id) => {
        api.delete(`medida/${id}`)
            .then(() => {
                window.location.reload();
                enqueueSnackbar("Deletado com sucesso!", { 
                    variant: "success", 
                    anchorOrigin: { vertical: "bottom", horizontal: "right" } 
                });
            });
    };

    useEffect(() => {
        api.get(`/medidas/${usuario_id}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (resposta) {
                setMedidas(resposta.data);
            })
            .catch(function (error) {
                console.error("Erro:", error);
            });
    }, [])

    const handleDownload = () => {
        if (medidas.length > 0) {
            const today = new Date().getDate();
            const month = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const ws = XLSX.utils.json_to_sheet(medidas);
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
                    <h1>Medidas</h1>
                    <p>{medidas.length} Registro(s) encontrado(s)</p>
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
                    bordered={true}
                    columns={columns}
                    dataSource={filterData(medidas, keywords)}
                    params={{ keywords }}
                    pagination={{
                        pageSize: 5,
                        showQuickJumper: true,
                    }}
                />
            </ConfigProvider>
        </>
    );
}

export default MedidasPage;