import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, SvgIcon } from '@mui/material';
import Stack from "@mui/material/Stack";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import dataRegionsAPI from '../../regions.json';
import axios from 'axios';
import { DEPARTMENTS_URL, DISEASES_URL } from 'src/API';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';








export default function DiseasesAdd({setNewDecVal}) {
    const [open, setOpen] = React.useState(false);
    const [errorDescription, setErrorDescription] = React.useState('');


    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState('');
    const [price, setPrice] = React.useState(0);
    const [treatments, setTreatments] = React.useState([]);

    const [treatmentCategory, setTreatmentCategory] = React.useState(""); /// shuni ulashim kerak tushunmadim Samandardan suravolaman


    const router = useRouter();

    useEffect(() => {
        axios.get(DEPARTMENTS_URL, { withCredentials: true })
            .then(res => {
                setTreatments(res.data);
            })
            .catch(err => console.log(err))
    }, []);




    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();


        if (description === '') {
            setErrorDescription('Nomini kiriting...');
            return;
        }




        if (description !== '') {
            axios.post(DISEASES_URL, {
                title: title,
                description: description,
                price: price,
                treatmentCategory: treatmentCategory

            }, {withCredentials: true})
                .then(res => {
                    console.log("Data is saved", res);
                    setNewDecVal((prev) => [...prev, res.data ])
                    setOpen(false);
                    
                })
                .catch(err => console.log(err))

        }

       



    }



    return (
        <div>
            <Button
                startIcon={(
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                )}
                variant="contained"
                onClick={handleClickOpen}
            >
                {"Kasallik Qo"}&apos;{"shish"}   
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Kasallik Qo"}&apos;{"shish"}   </DialogTitle>

                <DialogContent>
                    <DialogContentText style={{ marginBottom: '12px' }}>
                    
                    {"Kasallik haqida quyida so"}&apos;{"ralgan to"} &apos; {"liq  ma"} &apos; {"lumotlarni kiriting."} 
                    </DialogContentText>

                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >


                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="diseases-select-label">{"Bo"}&apos;{"lim"}</InputLabel>
                                    <Select
                                        labelId="diseases-select-label"
                                        label="Bo'lim"
                                        id="outlined-controlled"
                                        value={treatmentCategory}
                                        onChange={e => setTreatmentCategory(e.target.value)}
                                    >
                                        {
                                            treatments.map(elem => (
                                                <MenuItem value={elem.categoryName} key={elem._id}>{elem.categoryName}</MenuItem>

                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel id="diseases-select-label">Turi</InputLabel>
                                    <Select
                                        labelId="diseases-select-label"
                                        label="Kasallik turi"
                                        id="outlined-controlled"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                    >
                                        <MenuItem value="Ambulatoriya">Ambulatoriya</MenuItem>
                                        <MenuItem value="Operatsiya">Operatsiya</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="outlined-multiline-flexible"
                                    label="Nomi"
                                    type='text'
                                    multiline
                                    rows={4}
                                    value={description}
                                    helperText={<span style={{ color: "red" }}>{errorDescription}</span>}
                                    onChange={(event) => {
                                        setDescription(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Narxi"
                                    id="outlined-controlled"
                                    type='number'
                                    value={price}
                                    onChange={(event) => {
                                        setPrice(event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Bekor qilish</Button>
                    <Button variant='contained' onClick={handleButtonClick}>{"Qo"}&apos;{"shish"}  </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}