import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TablePagination,
    Container,
    Chip,
    makeStyles,
    Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import Toolbar from './Toolbar';

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: theme.palette.background.dark,
        minHeight: '100%',
        paddingBottom: theme.spacing(3),
        paddingTop: theme.spacing(3)
    },
    productCard: {
        height: '100%'
    }
}));

const columns = [
    { id: 'orderId', label: '召集令号' },
    { id: 'userId', label: '用户Id' },
    { id: 'description', label: '描述' },
    { id: 'modifyDate', label: '修改时间' },
    { id: 'requestState', label: '请求状态' },
    { id: 'operation', label: '操作' }
];

const RequestState = (props) => {
    if (props.status === 'Accept')
        return (<Chip size="small" label="已完成" color="primary" />)
    else if (props.status === 'Refuse')
        return (<Chip size="small" label="未通过" color="secondary" />)
    else if (props.status === 'UnReady')
        return (<Chip size="small" label="未开始" />)
    else
        return (<Chip size="small" label="已取消" />)
}

const MyRequestList = () => {
    const { id } = useParams();
    const classes = useStyles();
    const [requests, setRequest] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filterText, setFilterText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://52.250.51.146:8080/orderrequest/orderid/' + id, {
            method: 'get',
            credentials: "include"
        }).then(res => res.json())
            .then(data => {
                console.log(data.code);
                console.log(data.data);
                if (data.code === 10000)
                    setRequest(data.data);
                else if (data.code === 10004)
                    navigate('/login', { replace: true });
            });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleFilterTextChange = (text) => {
        setFilterText(text);
    }

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Page
            className={classes.root}
            title="MyOrder"
        >
            <Container maxWidth={false}>
                <Toolbar filterText={filterText}
                    onFilterTextChange={handleFilterTextChange} />
                <Paper >
                    <TableContainer className={classes.container}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {requests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    if (row.description.indexOf(filterText) === -1)
                                        return null;
                                    console.log(row.description);
                                    return (
                                        <TableRow tabIndex={-1} key={row.orderId}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                if (column.id === 'requestState')
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            <RequestState status={value} />
                                                        </TableCell>
                                                    )
                                                else if (column.id === 'operation')
                                                    return (
                                                        <TableCell>
                                                            <Button color="primary" variant="contained" key={row.userId} onClick={
                                                                () => {
                                                                    fetch('http://52.250.51.146:8080/orderrequest/' + row.requestId + '/approve', {
                                                                        method: 'post',
                                                                        credentials: "include",
                                                                    }
                                                                    ).then(res => res.json())
                                                                        .then(data => {
                                                                            if (data.code !== 10000)
                                                                                alert('同意失败')
                                                                            else {
                                                                                alert('同意成功')
                                                                                fetch('http://52.250.51.146:8080/orderrequest/orderid/' + id, {
                                                                                    method: 'get',
                                                                                    credentials: "include"
                                                                                }).then(res => res.json())
                                                                                    .then(data => {
                                                                                        if (data.code === 10000)
                                                                                            setRequest(data.data);
                                                                                        else if (data.code === 10004)
                                                                                            navigate('/login', { replace: true });
                                                                                    });
                                                                            }
                                                                        })
                                                                }
                                                            }>
                                                                同意
                                                        </Button>
                                                            <Button color="secondary" variant="contained" key={row.userId} onClick={
                                                                () => {
                                                                    fetch('http://52.250.51.146:8080/orderrequest/' + row.requestId + '/deny', {
                                                                        method: 'post',
                                                                        credentials: "include",
                                                                    }
                                                                    ).then(res => res.json())
                                                                        .then(data => {
                                                                            if (data.code !== 10000)
                                                                                alert('拒绝失败')
                                                                            else {
                                                                                alert('拒绝成功')
                                                                                fetch('http://52.250.51.146:8080/orderrequest/orderid/' + id, {
                                                                                    method: 'get',
                                                                                    credentials: "include"
                                                                                }).then(res => res.json())
                                                                                    .then(data => {
                                                                                        if (data.code === 10000)
                                                                                            setRequest(data.data);
                                                                                        else if (data.code === 10004)
                                                                                            navigate('/login', { replace: true });
                                                                                    });
                                                                            }
                                                                        })
                                                                }
                                                            }>
                                                                拒绝
                                                        </Button>
                                                        </TableCell>
                                                    )
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={requests.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </Page>
    );
};

export default MyRequestList;
