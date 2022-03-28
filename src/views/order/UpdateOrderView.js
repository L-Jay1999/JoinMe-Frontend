import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
    Button,
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
import { baseIP } from 'src/ipconfig';

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
    });
    const [imageUrl, setUrl] = useState("");
    const imageUploadUrl = 'http://' + baseIP + ':8080/order/' + id + '/upload'

    useEffect(() => {
        fetch('http://' + baseIP + ':8080/order/' + id, {
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
                <CardHeader title="Activity Information" />
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
                                <input type="button" value="Submit" onClick={
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
                                <input type="reset" value="Clear" />
                            </form>
                        </Grid>
                        <Grid item xs={12} sm container>
                            <Grid item xs container spacing={2}>
                                <TextField
                                    label="Activity ID"
                                    name="orderId"
                                    disabled
                                    onChange={handleChange}
                                    value={values.orderId}
                                    variant="outlined"
                                />
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <InputLabel required>Activity Type</InputLabel>
                                    <Select
                                        label="Activity Type"
                                        name="orderType"
                                        onChange={handleChange}
                                        value={values.orderType}>
                                        <MenuItem value='Technology'>Technology</MenuItem>
                                        <MenuItem value='Study'>Study</MenuItem>
                                        <MenuItem value='SocialExperience'>Social Practice</MenuItem>
                                        <MenuItem value='PublicBenefit'>Volunteer</MenuItem>
                                        <MenuItem value='Play'>Play</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Activity Name"
                                    name="orderName"
                                    onChange={handleChange}
                                    value={values.orderName}
                                    variant="outlined"
                                />
                                <TextField
                                    label="Number of People"
                                    name="number"
                                    onChange={handleChange}
                                    value={values.number}
                                    variant="outlined"
                                />
                                <TextField
                                    fullWidth
                                    label="Description"
                                    name="description"
                                    onChange={handleChange}
                                    value={values.description}
                                    variant="outlined"
                                />
                                <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        fetch('http://' + baseIP + ':8080/order/' + id, {
                                            method: 'post',
                                            credentials: "include",
                                            body: JSON.stringify(values),
                                            headers: {
                                                'Content-Type': 'application/json'
                                            },
                                        }).then(res => res.json())
                                            .then(data => {
                                                console.log(data);
                                                console.log(data.data);
                                                if (data.code !== 10000)
                                                    alert('更新失败');
                                                else
                                                    alert('更新成功')
                                            })
                                    }}
                                >
                                    Update Activity
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form >
    )
}

export default OrderDetails;