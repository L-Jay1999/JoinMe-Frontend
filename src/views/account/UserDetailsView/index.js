import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  makeStyles
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
  { id: 'userId', label: '用户编号' },
  { id: 'userName', label: '用户名' },
  { id: 'realName', label: '用户姓名' },
  { id: 'phoneNumber', label: '手机号码' },
  { id: 'cardType', label: '证件类型' },
  { id: 'cardNumber', label: '证件号' },
  { id: 'levelType', label: '用户级别' },
  { id: 'city', label: '注册城市' },
];

const UserTable = () => {
  const classes = useStyles();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/admin/user', {
      method: 'get',
      credentials: 'include'
    }).then(res => res.json())
      .then(data => { console.log(data.data); setUsers(data.data); });
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
  // return null;
  return (
    <Page
      className={classes.root}
      title="Products"
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
                {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  if (row.userName.indexOf(filterText) === -1)
                    return null;
                  if (row.userName === 'admin')
                    return null;
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.userId}>
                      {columns.map((column) => {
                        const value = row[column.id];
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
            count={users.length}
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

export default UserTable;
