import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    ButtonBase,
    Card,
    CardContent,
    CardMedia,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Typography,
    makeStyles,
    Select,
    InputLabel,
    MenuItem,
    FormControl
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {}
}));

const OrderDetails = ({ className, ...rest }) => {
    const { id } = useParams();
    const classes = useStyles();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        'orderId': '',
        'orderType': '',
        'orderName': '',
        'description': '',
        'number': '',
        'endDate': '',
        'orderState': ''
    });
    const [imageUrl, setUrl] = useState("");

    useEffect(() => {
        fetch('http://localhost:8080/order/' + id, {
            method: 'get',
            credentials: "include",
        }).then(res => res.json())
            .then(data => {
                if (data.code === 10000) {
                    setValues(data.data);
                    if (data.data.picture === null)
                        setUrl("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1812993978,4158651947&fm=26&gp=0.jpg")
                }
                else
                    navigate('/login', { replace: true });
            });
    }, []);

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form
            autoComplete="off"
            noValidate
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Card>
                <CardHeader title="召集令信息" />
                <Divider />
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item>
                            <CardMedia
                                style={{ width: 400, padding: 60 }}
                                component="img"
                                align="center"
                                alt="Contemplative Reptile"
                                image={imageUrl}
                                title="Contemplative Reptile"
                                id="picture"
                            />
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container direction="column" spacing={2}>
                                <Grid item xs>
                                    <Typography gutterBottom variant="subtitle1">
                                        Standard license
                                    </Typography>
                                    <Typography variant="body2" gutterBottom>
                                        Full resolution 1920x1080 • JPEG
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        ID: 1030114
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2" style={{ cursor: 'pointer' }}>
                                        Remove
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1">$19.00</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    )
}

export default OrderDetails;