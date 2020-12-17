import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
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
    const imageUploadUrl = 'http://52.250.51.146:8080/order/' + id + '/upload'

    useEffect(() => {
        fetch('http://52.250.51.146:8080/order/' + id, {
            method: 'get',
            credentials: "include",
        }).then(res => res.json())
            .then(data => {
                if (data.code === 10000) {
                    setValues(data.data);
                    if (data.data.picture === null)
                        setUrl("https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1812993978,4158651947&fm=26&gp=0.jpg")
                    else
                        setUrl(data.data.picture)
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
                            <form action={imageUploadUrl} method="post" enctype="multipart/form-data" id="imageUpload">
                                <input type="file" id="uploadImage" name="file" />
                                <input type="button" value="提交" onClick={
                                    () => {
                                        let uploadimage = document.getElementById("uploadImage")
                                        if (uploadimage.files.length == 0)
                                            alert("未选择文件")
                                        else {
                                            let form = document.getElementById("imageUpload")
                                            form.submit()
                                        }
                                    }
                                } />
                                <input type="reset" value="清空" />
                            </form>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container spacing={2}>
                                <TextField
                                    label="召集令id"
                                    name="orderId"
                                    onChange={handleChange}
                                    value={values.orderId}
                                    variant="outlined"
                                />
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel required>召集令类型</InputLabel>
                                    <Select
                                        label="召集令类型"
                                        name="orderType"
                                        onChange={handleChange}
                                        value={values.orderType}>
                                        <MenuItem value='Technology'>科技交流</MenuItem>
                                        <MenuItem value='Study'>我爱学习</MenuItem>
                                        <MenuItem value='SocialExperience'>社会经验</MenuItem>
                                        <MenuItem value='PublicBenefit'>人民福祉</MenuItem>
                                        <MenuItem value='play'>玩</MenuItem>
                                    </Select>
                                </FormControl>
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
        </form >
    )
}

export default OrderDetails;