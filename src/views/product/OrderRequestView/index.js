import React, { useState, useEffect } from 'react';
import {
    Paper,
    Container,
    makeStyles,
    Button,
} from '@material-ui/core';
import Page from 'src/components/Page';
import { Table, Modal } from 'antd';
import 'antd/dist/antd.css';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    formControl: {
        minWidth: 150,
    },
    Button: {
        minWidth: 75,
    }
}));

const GMTToStr = (time) => {
    const date = new Date(time);
    const Str = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate() + ' ' +
        date.getHours() + ':' +
        date.getMinutes() + ':' +
        date.getSeconds();
    return Str;
}

const OrderRequest = () => {
    const classes = useStyles();

    const [tableData, setTableData] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleModal = () => {
        setIsModalVisible(false);
    }

    const handleCheck = (id) => {
        fetch('http://localhost:8080/admin/user/' + id, { method: 'GET', credentials: "include" })
            .then(res => res.json())
            .then(val => {
                console.log(val);
                const { data } = val;
                setUserInfo({
                    '用户姓名': data.userName,
                    '用户ID': data.userId,
                    '用户联系方式': data.phoneNumber,
                    '用户介绍': data.introduction
                });
                setIsModalVisible(true);
            })
            .catch(err => {
                console.log(err);
                alert('查询失败，请重试！');
            })
    }

    const columns = [
        {
            title: '请求ID',
            dataIndex: 'requestId',
            key: 'requestId',
        },
        {
            title: '请求用户ID',
            dataIndex: 'userId',
            key: 'userId',
        },
        {
            title: '请求状态',
            dataIndex: 'requestState',
            key: 'requestState',
        },
        {
            title: '请求发起时间',
            dataIndex: 'createDate',
            key: 'createDate',
        },
        {
            title: '查看用户基本信息',
            dataIndex: 'check',
            key: 'check',
            render: (text, record) => {
                return (<Button color="primary" onClick={() => { handleCheck(record.userId) }}>
                    查看令主信息
                </Button>)
            }
        }
    ]

    useEffect(() => {
        fetch('http://localhost:8080/admin/orderrequest', { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(val => {
                console.log(val);
                const { data } = val;
                const temp = [];
                data.map((val) => {
                    temp.push({
                        key: val.userId,
                        requestId: val.requestId,
                        userId: val.userId,
                        requestState: val.requestState,
                        createDate: GMTToStr(val.createDate)
                    })
                });
                setTableData(temp);
            })
    })

    return (
        <div>
            <Page
                className={classes.root}
                title="orderRequest"
            >
                <Container maxWidth={false}>
                    <Paper >
                        <Table
                            columns={columns}
                            dataSource={tableData}
                            pagination={{ position: ['bottomCenter'], showSizeChanger: true, showQuickJumper: true }}
                        />
                    </Paper>
                </Container>
                <Modal title="令主信息" visible={isModalVisible} onOk={handleModal} onCancel={handleModal}>
                    {
                        Object.keys(userInfo).map(key =>
                            (<p>{key}：{userInfo[key]}</p>)
                        )
                    }
                </Modal>
            </Page>
        </div>
    );
};

export default OrderRequest;
