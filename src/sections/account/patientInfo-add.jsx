import React, {useEffect} from 'react';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { PATIENTS_HISTORY, DISEASES_URL, DEPARTMENTS_URL } from 'src/API';







export default function FormDialog(props) {
    const { patient } = props;
    const [open, setOpen] = React.useState(false);
  


    const [typeOfDeseases, setTypeOfDeseases] = React.useState(null); // 
    const [treatmentCategory, setTreatmentCategory] = React.useState([]); //
    const [selectedDisease, setSelectedDisease] = React.useState([]); // 
    const [selectedPrice, setSelectedPrice] = React.useState(0); //
    const [selectedTreatmentCategory, setSelectedTreatmentCategory] = React.useState(''); //
    const [nameOfDeseases, setNameOfDeseases] = React.useState([]);

    const [diseaseName, setDiseaseName] = React.useState('');
    const [diseaseExplanation, setDiseaseExplanation] = React.useState('');




    useEffect(() => {
        axios.get(DEPARTMENTS_URL, { withCredentials: true })
            .then(res => {
                setTreatmentCategory(res.data);
                return axios.get(DISEASES_URL, { withCredentials: true });
            })
            .then(res2 => {
                const filteredDiseaseName = res2.data.filter(disease => {
                    return !typeOfDeseases || (disease.title === typeOfDeseases && disease.treatmentCategory === selectedTreatmentCategory);
                });
                setNameOfDeseases(filteredDiseaseName || []);


            })
            .catch(err => console.log(err))
    }, [typeOfDeseases]);



    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSelectedPrice = (selectedId) => {
        if (nameOfDeseases && nameOfDeseases.length > 0) {
            const foundPatient = nameOfDeseases.find(disease => disease._id === selectedId);
            if (foundPatient) {              
                setSelectedPrice(prevPrice => prevPrice + foundPatient.price);
            } else {
                console.log("Patient with selected ID not found.");
            }
        } else {
            console.log("Patients API is empty or undefined.");
        }
    };

    const handleButtonClick = (event) => {
        event.preventDefault(); 
                   
            axios.post(`${PATIENTS_HISTORY}${patient._id}`, {
                selectedPatient: patient.firstName + " " + patient.lastName,
                // typeOfDisease: typeOfDeseases,
                selectedDiseases: selectedDisease.map(elem => {
                    return {
                        diseaseName: elem.description,
                        price: elem.price
                    }
                }),
                selectedPrice, selectedPrice
    
            }, { withCredentials: true })
                .then(res => {
                    console.log("Data is saved", res);
                    setOpen(false);
                })
                .catch(err => console.log(err))
    }


    return (
        <div>

            <Button
                fullWidth
                variant="contained"
                onClick={handleClickOpen}
            >
                {"Qo"}&apos;{"shish"}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Kasallik tarixini qo"}&apos;{"shish"}</DialogTitle>

                <DialogContent>
                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="treatmentCategory-select-demo"
                                    sx={{ width: "100%" }}
                                    value={selectedTreatmentCategory} //[]
                                    onChange={(event, newValue) => {
                                        setSelectedTreatmentCategory(newValue);
                                        setTypeOfDeseases('');
                                        setSelectedDisease([])
                                    }}
                                    options={
                                        treatmentCategory ? Object.keys(treatmentCategory).map(key => (
                                            treatmentCategory[key].categoryName
                                        )) : []
                                    }
                                    getOptionLabel={(option) => option}
                                    autoHighlight
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Bo'limni tanlang"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <Autocomplete
                                    id="typeOfDeseases-select-demo"
                                    sx={{ width: "100%" }}
                                    value={typeOfDeseases} //[]
                                    onChange={(event, newValue) => {
                                        setTypeOfDeseases(newValue);
                                        setSelectedDisease([])
                                    }}
                                    options={["Ambulatoriya", "Operatsiya"]}
                                    autoHighlight
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Kasallik turini tanlang"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Grid>

                            {/* Dropdown name of Deseases */}
                            <Grid item xs={12}>
                                <Autocomplete
                                    multiple
                                    id="tags-outlined"
                                    value={selectedDisease}
                                    onChange={(event, newValues) => {
                                        setSelectedPrice(0)
                                        setSelectedDisease(newValues);
                                        newValues.forEach(selectedValue => {
                                            handleSelectedPrice(selectedValue._id);
                                        });
                                    }}
                                    options={nameOfDeseases || []}
                                    getOptionLabel={(option) => option?.description || ''}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Kasallik nomlari"
                                            placeholder="Kasalliklar"
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Narxi"
                                    id="outlined-controlled"
                                    type='number'
                                    disabled={true}
                                    value={selectedPrice}
                                    onChange={(event) => {
                                        const enteredValue = event.target.value;
                                        const parsedValue = Number(enteredValue);
                                        setSelectedPrice(parsedValue)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Bekor qilish</Button>
                    <Button variant='contained' onClick={handleButtonClick}>{"Qo"}&apos;{"shish"}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}