import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    makeStyles,
    Select,
    InputLabel,
    MenuItem,
    FormControl
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
    const { id } = useParams();
    const classes = useStyles();
    const navigate = useNavigate();
    const [values, setValues] = useState({
        'userName': '',
        'realName': '',
        'phoneNumber': '',
        'introduction': ''
    });
    const [password, setPassword] = useState('')

    useEffect(() => {
        fetch('http://localhost:8080/user/' + id, {
            method: 'get',
            credentials: "include",
        }).then(res => res.json())
            .then(data => {
                if (data.code === 10000)
                    setValues(data.data);
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
                <CardHeader
                    title="用户信息"
                />
                <Divider />
                <CardContent>
                    <Grid
                        container
                        spacing={3}
                    >
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <TextField
                                disabled
                                fullWidth
                                label="用户名"
                                name="userName"
                                onChange={handleChange}
                                required
                                value={values.userName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                disabled
                                label="姓名"
                                name="realName"
                                onChange={handleChange}
                                required
                                value={values.realName}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={4}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                disabled
                                required
                                label="手机号"
                                name="phoneNumber"
                                onChange={handleChange}
                                value={values.phoneNumber}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid
                            item
                            md={12}
                            xs={12}
                        >
                            <TextField
                                fullWidth
                                disabled
                                label="用户描述"
                                name="introduction"
                                onChange={handleChange}
                                value={values.introduction}
                                variant="outlined"
                            >
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
};

ProfileDetails.propTypes = {
    className: PropTypes.string
};

export default ProfileDetails;
