import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, SvgIcon } from '@mui/material';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import 'react-international-phone/style.css';
import axios from 'axios';
import { PATIENTS_URL, DOCTORS_URL, DISEASES_URL, DEPARTMENTS_URL, APPOINTMENTS_URL } from 'src/API';



// import Radio from '@mui/material/Radio';
// import RadioGroup from '@mui/material/RadioGroup';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import FormControl from '@mui/material/FormControl';
// import FormLabel from '@mui/material/FormLabel';



export default function AddAppointment({ setNewAppVal, nextStep, setNextStep, setValue }) {
    const [open, setOpen] = React.useState(false);

    const [selectedDoctor, setSelectedDoctor] = React.useState(null);
    const [selectedPatient, setSelectedPatient] = React.useState(null);
    const [doctorsAPI, setDoctorsAPI] = React.useState([]);
    const [patientsAPI, setPatientsAPI] = React.useState([]);
    const [typeOfDeseases, setTypeOfDeseases] = React.useState(null); // 
    const [treatmentCategory, setTreatmentCategory] = React.useState([]); //
    const [nameOfDeseases, setNameOfDeseases] = React.useState([]);
    const [selectedDisease, setSelectedDisease] = React.useState([]); // 
    const [selectedPrice, setSelectedPrice] = React.useState(0); //
    const [selectedPatientID, setSelectedPatientID] = React.useState('');
    const [selectedDoctorID, setSelectedDoctorID] = React.useState('');
    const [selectedTreatmentCategory, setSelectedTreatmentCategory] = React.useState(''); //
    const [diseaseOptions, setDiseaseOptions] = React.useState([]); //


    useEffect(() => {
        axios.get(DOCTORS_URL, { withCredentials: true })
            .then(res => {
                setDoctorsAPI(res.data);
                return axios.get(PATIENTS_URL, { withCredentials: true });
            })
            .then(res2 => {
                setPatientsAPI(res2.data);
                return axios.get(DEPARTMENTS_URL, { withCredentials: true });
            })
            .then(res3 => {
                setTreatmentCategory(res3.data);
                return axios.get(DISEASES_URL, { withCredentials: true });
            })
            .then(res4 => {
                const filteredDiseaseName = res4.data.filter(disease => {
                    return !typeOfDeseases || (disease.title === typeOfDeseases && disease.treatmentCategory === selectedTreatmentCategory);
                });
                setNameOfDeseases(filteredDiseaseName || []);

            })
            .catch(err => console.log(err))
    }, []);

    useEffect(() => {
        const doctorRes = doctorsAPI.find(doctor => {
            if (doctor._id === selectedDoctorID) {
                return true
            }
        });
        setSelectedTreatmentCategory(doctorRes?.speciality || "");

    }, [selectedDoctor]);


    useEffect(() => {
        if (selectedTreatmentCategory.length > 0) {
            const filteredDiseaseName = nameOfDeseases.filter(disease => {
                return !typeOfDeseases || (disease.title === typeOfDeseases && disease.treatmentCategory === selectedTreatmentCategory);
            });
            setDiseaseOptions(filteredDiseaseName);
            setSelectedDisease([filteredDiseaseName[0]] || [])
            setSelectedPrice([filteredDiseaseName[0]?.price] || 0)            
        }

    }, [typeOfDeseases, selectedTreatmentCategory])








    const handleSelectedPrice = (selectedId) => {
        if (nameOfDeseases && nameOfDeseases.length > 0) {
            const foundPatient = nameOfDeseases.find(disease => disease._id === selectedId);
            if (foundPatient) {
                // console.log("Found Patient:", foundPatient);
                // console.log("Selected ID:", selectedId);
                setSelectedPrice(prevPrice => prevPrice + foundPatient.price);
                // console.log("Updated Selected Price:", selectedPrice);
            } else {
                console.log("Patient with selected ID not found.");
            }
        } else {
            console.log("Patients API is empty or undefined.");
        }
    };








    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNextStep(null)
    };

    const handleClick = async () => {
        // const dateObject = new Date(selectedDate);
        // const day = dateObject.getDate();
        // const month = dateObject.getMonth() + 1;
        // const year = dateObject.getFullYear();
        // console.log("sana = " + day + "/" + month + "/" + year);
        // console.log(selectedTime);


        const { data } = await axios.post(APPOINTMENTS_URL, {
            selectedPatientId: nextStep ? nextStep.customerID : selectedPatientID,
            selectedDoctorId: selectedDoctorID,
            selectedPatient: nextStep ? nextStep.firstName + " " + nextStep.lastName : selectedPatient,
            selectedDoctor: selectedDoctor,
            typeOfDisease: typeOfDeseases,
            selectedDiseases: selectedDisease.map(elem => {
                return {
                    diseaseName: elem.description,
                    price: elem.price
                }
            }),
            selectedPrice, selectedPrice

        }, { withCredentials: true })
        setNewAppVal((prev) => [...prev, data])
        setOpen(false);
        setSelectedPatient(null);
        setSelectedDoctor(null);
        setSelectedTreatmentCategory('');
        setTypeOfDeseases(null);
        setSelectedDisease([]);
        setSelectedPrice(0);
        return data;
    }

    const handleButtonClick = async (event) => {
        event.preventDefault();
        await handleClick();
        setNextStep(null);
    }

    const handleButtonClickNext = async (event) => {
        event.preventDefault();
        await handleClick();
        setNextStep({})
        setValue(2)

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
                Uchrashuv oynasi
            </Button>

            <Dialog
                open={open || (nextStep === null ? false : true)}
                onClose={handleClose}>






                <DialogContent>
                    <Grid container spacing={1} style={{ marginBottom: '20px' }}>
                        <Grid item xs={8}>
                            <DialogTitle>Uchrashuv belgilash</DialogTitle>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'end' }}>
                            <Button
                                variant='outlined'
                                onClick={handleButtonClickNext}
                                style={{
                                    background: "linear-gradient(268.75deg, #FBA500 -53.51%, #FF1F00 117.5%)",
                                    border: 0,
                                    color: 'white',
                                    height: 48,
                                    padding: '0 50px',
                                    fontSize: "18px",
                                }}
                            >
                                {"To"}&apos;{"lov"}
                            </Button>
                        </Grid>
                    </Grid>

                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Autocomplete
                                    id="customer-select-demo"
                                    sx={{ width: "100%" }}
                                    value={nextStep ? nextStep.firstName + " " + nextStep.lastName : selectedPatient}
                                    onChange={(event, newValue) => {
                                        setSelectedPatient(newValue);
                                        patientsAPI.map(patient => {
                                            if ((patient.firstName + " " + patient.lastName) === newValue) {
                                                setSelectedPatientID(patient._id)
                                            }

                                        })
                                    }}
                                    options={patientsAPI.map(patient => patient.firstName + " " + patient.lastName)}
                                    autoHighlight
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Bemorni tanlang"
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
                                    id="doctor-select-demo"
                                    sx={{ width: "100%" }}
                                    value={selectedDoctor}
                                    onChange={(event, newValue) => {
                                        setSelectedDoctor(newValue);
                                        doctorsAPI.map(doctor => {
                                            if ((doctor.firstName + " " + doctor.lastName) === newValue) {
                                                setSelectedDoctorID(doctor._id)
                                            }

                                        })
                                        setTypeOfDeseases("Ambulatoriya");
                                        // setSelectedTreatmentCategory("")


                                    }}
                                    options={doctorsAPI.map(doctor => doctor.firstName + " " + doctor.lastName)}
                                    autoHighlight
                                    getOptionLabel={(option) => option}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Doktorni tanlang"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />

                            </Grid>


                            {/* <Grid item xs={12}>
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
                            </Grid> */}


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
                                    options={diseaseOptions || []}
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
                                    value={selectedPrice}
                                    onChange={(event) => {
                                        const enteredValue = event.target.value;
                                        const parsedValue = Number(enteredValue);
                                        setSelectedPrice(parsedValue)
                                    }}
                                />
                            </Grid>

                            {/* <Grid item xs={12}>
                                <FormControl>
                                    <FormLabel id="demo-radio-buttons-group-label">{"To"}&apos;{"lov"}</FormLabel>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="unPaid"
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="paid" control={<Radio />} label="To'ladi" />
                                        <FormControlLabel value="unPaid" control={<Radio />} label="To'lamadi" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid> */}
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