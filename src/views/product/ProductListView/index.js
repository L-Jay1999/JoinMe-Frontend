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
import { baseIP } from 'src/ipconfig';

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

const ordertypes = {
  'Technology': "Technology",
  'Study': 'Study',
  'SocialExperience': 'Social Practice',
  'PublicBenefit': 'Volunteer',
  'Play': 'Play'
}

const columns = [
  { id: 'orderId', label: 'Activity Number' },
  { id: 'orderType', label: 'Activity Type' },
  { id: 'orderName', label: 'Activity Name' },
  { id: 'number', label: 'Number of People' },
  { id: 'endDate', label: 'Due Time' },
  { id: 'orderState', label: 'Current Status' }
];

const OrderState = (props) => {
  if (props.status === 'Respond' || props.status === 'Initial')
    return (<Chip size="small" label="Not Finished" color="primary" />)
  else if (props.status === 'Finish')
    return (<Chip size="small" label="Finished" color="secondary" />)
  else if (props.status === 'Due')
    return (<Chip size="small" label="Expired" />)
  else
    return (<Chip size="small" label="Cancelled" />)
}

const ProductList = () => {
  const classes = useStyles();
  const [orders, setOrder] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://' + baseIP + ':8080/order/', {
      method: 'get',
    }).then(res => res.json())
      .then(data => { setOrder(data.data); });
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
                {orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  if (row.orderName.indexOf(filterText) === -1)
                    return null;
                  console.log(row.orderName);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.orderId}
                      onClick={() => {
                        // window.location.href = '/app/orders/' + row.orderId;
                        navigate('/app/orders/' + row.orderId, { replace: true });
                      }}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        if (column.id === 'orderState')
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <OrderState status={value} />
                            </TableCell>
                          )
                        else if (column.id === 'orderType')
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {ordertypes[value]}
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
            count={orders.length}
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

export default ProductList;
