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
import { PATIENTS_URL, DOCTORS_URL, DISEASES_URL, DEPARTMENTS_URL, APPOINTMENTS_URL, PAYMENTS_URL } from 'src/API';
import AddAppointment from '../appointments/add-appointment';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';
import { useReactToPrint } from 'react-to-print';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// Accordion
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';








export default function FormDialog({ setNewCustVal, setNextStep, setValue }) {
    const [open, setOpen] = React.useState(false);
    const [errorSurname, setErrorSurname] = React.useState('');
    const [errorname, setErrorname] = React.useState('');
    // const [errorPatronymic, setErrorPatronymic] = React.useState('');
    // const [errorage, setErrorage] = React.useState('');
    // const [errorGender, setErrorGender] = React.useState('');
    // const [errorPhoneNumber, setErrorPhoneNumber] = React.useState('');
    // const [errorAddress, setErrorAddress] = React.useState('');

    const [lastName, setLastName] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [patronymic, setPatronymic] = React.useState(' ');
    const [age, setAge] = React.useState(0);
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [gender, setGender] = React.useState("");
    const [address, setAddress] = React.useState('');
    const [region, setRegion] = React.useState(dataRegionsAPI.regions[11]);
    const [district, setDistrict] = React.useState(dataRegionsAPI.districts[170]);
    const [filteredDistricts, setFilteredDistricts] = React.useState([]);
    const [isSaving, setIsSaving] = React.useState(true);
    const [dataCustomers, setDataCustomers] = React.useState([]);
    const [typeOfDeseases, setTypeOfDeseases] = React.useState(null); // 
    const [selectedDoctor, setSelectedDoctor] = React.useState(null);
    const [selectedPatient, setSelectedPatient] = React.useState(null);
    const [nameOfDeseases, setNameOfDeseases] = React.useState([]);
    const [selectedDisease, setSelectedDisease] = React.useState([]); // 
    const [selectedPrice, setSelectedPrice] = React.useState(0); //
    const [selectedPatientID, setSelectedPatientID] = React.useState('');
    const [selectedDoctorID, setSelectedDoctorID] = React.useState('');
    const [selectedTreatmentCategory, setSelectedTreatmentCategory] = React.useState(''); //
    const [diseaseOptions, setDiseaseOptions] = React.useState([]); //
    const [doctorsAPI, setDoctorsAPI] = React.useState([]);
    const [treatmentCategory, setTreatmentCategory] = React.useState([]); //
    const [paymentsAPI, setPaymentsAPI] = React.useState([]);
    const [overallPrice, setOverallPrice] = React.useState(0);
    const [cashPrice, setCashPrice] = React.useState(0);
    const [plasticPrice, setPlasticPrice] = React.useState(0);
    const [clickPrice, setClickPrice] = React.useState(0);
    const [errorOverPrice, setErrorOverPrice] = React.useState('');
    const [isTextFieldOpenPlastik, setIsTextFieldOpenPlastik] = React.useState(false);
    const [isTextFieldOpenClick, setIsTextFieldOpenClick] = React.useState(false);

    const router = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNextStep(null)
    };





    useEffect(() => {
        axios.get(DOCTORS_URL, { withCredentials: true })
            .then(res => {
                setDoctorsAPI(res.data);
                return axios.get(PATIENTS_URL, { withCredentials: true });
            })
            .then(res2 => {
                setDataCustomers(res2.data);
                return axios.get(DEPARTMENTS_URL, { withCredentials: true });
            })
            .then(res3 => {
                setTreatmentCategory(res3.data);
                return axios.get(PAYMENTS_URL, { withCredentials: true });
            })
            .then(res4 => {
                setPaymentsAPI(res4.data);
                return axios.get(DISEASES_URL, { withCredentials: true });
            })
            .then(res5 => {
                const filteredDiseaseName = res5.data.filter(disease => {
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
            setCashPrice([filteredDiseaseName[0]?.price] || 0)
        }

    }, [typeOfDeseases, selectedTreatmentCategory])




    const handleOverallPriceChange = (event) => {
        console.log(event.target.value);
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        setSelectedPrice(parsedValue);
        setCashPrice(parsedValue);
    };

    const handleCashPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        if (parsedValue + plasticPrice + clickPrice > selectedPrice) {
            setErrorOverPrice("Jami puldan katta raqam kiritdingiz")
        } else {
            setErrorOverPrice('')
            setCashPrice(parsedValue)
        }
    };

    const handlePlasticPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        if (parsedValue + cashPrice + clickPrice > selectedPrice) {
            setErrorOverPrice("Jami puldan katta raqam kiritdingiz")
        } else {
            setErrorOverPrice('')
            setPlasticPrice(parsedValue)
        }
    };

    const handleClickPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        if (parsedValue + plasticPrice + cashPrice > selectedPrice) {
            setErrorOverPrice("Jami puldan katta raqam kiritdingiz")
        } else {
            setErrorOverPrice('')
            setClickPrice(parsedValue)
        }
    };


    // handling print
    const handlePrint = useReactToPrint({
        documentTitle: "El-Aziz Shifo Nur klinikasi",
        content: () => printRef.current,
        onAfterPrint: () => {
            console.log("Document is printed");
        }
    });



    const handleClick = async () => {
        dataCustomers.map(patient => {
            if ((patient.firstName + " " + patient.lastName) === firstName + " " + lastName) {
                setSelectedPatientID(patient._id)
            }

        })

        for (let i = 0; i < dataCustomers.length; i++) {
            if (dataCustomers[i].firstName.toLowerCase() === firstName.toLowerCase() && dataCustomers[i].lastName.toLowerCase() === lastName.toLowerCase()) {
                alert("Бундай бемор мавжуд")
            } else {

            }
        }
        if (lastName === '') {
            setErrorSurname('Familiyani kiriting...');
            return;
        }
        if (firstName === '') {
            setErrorname('Ismni kiriting...');
            return;
        }

        // Post patient

        if (lastName !== '' && firstName !== '') {
            const { data } = await axios.post(PATIENTS_URL, {
                firstName: firstName,
                lastName: lastName,
                patronymic: patronymic,
                age: age,
                phoneNumber: phoneNumber,
                gender: gender,
                region: region.name,
                district: district.name,
                address: address
            }, { withCredentials: true })
            setNewCustVal((prev) => [...prev, data])
            setIsSaving(false);
            setOpen(false);




            // // Post Appointment

            const { data: dataAppointment } = await axios.post(APPOINTMENTS_URL, {
                selectedPatientId: data._id, //
                selectedDoctorId: selectedDoctorID,
                selectedPatient: firstName + " " + lastName,
                selectedDoctor: selectedDoctor,
                typeOfDisease: typeOfDeseases,
                selectedDiseases: selectedDisease.map(elem => {
                    return {
                        diseaseName: elem.description,
                        price: elem.price
                    }
                }),
                selectedPrice: Number(selectedPrice)

            }, { withCredentials: true })
            setSelectedPatient(null);
            setSelectedDoctor(null);
            setSelectedTreatmentCategory('');
            setTypeOfDeseases(null);
            setSelectedDisease([]);
            setSelectedPrice(0);

            // // post fee

            const ubdatedPaymentsURL = await axios.get(PAYMENTS_URL, { withCredentials: true })
            const updatedPaymentsData = ubdatedPaymentsURL.data;

            const custdebt = updatedPaymentsData.find(dept => dept.patientID === data._id)

            if (custdebt) {               
                const response = await axios.post(PAYMENTS_URL + `/pay/${custdebt._id}`, {
                    cash: Number(cashPrice),
                    card: plasticPrice,
                    click: clickPrice
                }, { withCredentials: true })
                    .then(res => {
                        console.log("Data is saved", res);
                        // setNewPayVal((prev) => [...prev, res.data])
                        setOpen(false);
                        setSelectedPatient(null);
                        setOverallPrice(0)
                        setNextStep(null)
                    })
                    .catch(err => console.log(err))
            }

        }

    }

    const handleButtonClick = async (event) => {
        event.preventDefault();
        await handleClick();
        setNextStep(null);
    }


    const handleButtonClickNext = async (event) => {
        event.preventDefault();
        const { _id } = await handleClick();

        setNextStep(
            {
                customerID: _id,
                firstName: firstName,
                lastName: lastName,
                // patronymic: patronymic,
                // age: age,
                // phoneNumber: phoneNumber,
                // gender: gender,
                // region: region.name,
                // district: district.name,
                // address: address
            }
        )
        setValue(1)
    }

    const handleSelectedPrice = (selectedId) => {
        if (nameOfDeseases && nameOfDeseases.length > 0) {
            const foundPatient = nameOfDeseases.find(disease => disease._id === selectedId);
            if (foundPatient) {
                // console.log("Found Patient:", foundPatient);
                // console.log("Selected ID:", selectedId);
                setSelectedPrice(prevPrice => prevPrice + foundPatient.price);
                setCashPrice(prevPrice => prevPrice + foundPatient.price);
                // console.log("Updated Selected Price:", selectedPrice);
            } else {
                console.log("Patient with selected ID not found.");
            }
        } else {
            console.log("Patients API is empty or undefined.");
        }
    };

    return (
        <>
            <Button
                startIcon={(
                    <SvgIcon fontSize="small">
                        <PlusIcon />
                    </SvgIcon>
                )}
                variant="contained"
                onClick={handleClickOpen}
            >
                {"Bemor qo"}&apos;{"shish"}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Bemor qo"}&apos;{"shish"}</DialogTitle>

                <DialogContent>
                    {/* Bemor qushish kodi */}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault(); // Prevent the form submission (assuming you're handling it in `handleButtonClick`)
                        }}
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Familiya"
                                    id="outlined-controlled"
                                    type='text'
                                    value={lastName}
                                    helperText={<span style={{ color: "red" }}>{errorSurname}</span>}
                                    onChange={(event) => {
                                        const newLastName = event.target.value;
                                        setLastName(newLastName);
                                        setIsSaving(false)
                                        if (newLastName.endsWith('va')) {
                                            setGender("female")
                                        } else {
                                            setGender("male")
                                        }
                                        const isDuplicate = dataCustomers.some(item => item.lastName.toLowerCase() === newLastName.toLowerCase())
                                        if (isDuplicate) {
                                            setErrorSurname("Bunday bemor mavjud");
                                        } else {
                                            setErrorSurname(""); // Reset error message if not duplicate
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Ism"
                                    id="outlined-controlled"
                                    type='text'
                                    value={firstName}
                                    helperText={<span style={{ color: "red" }}>{errorname}</span>}
                                    onChange={(event) => {
                                        const newFirstName = event.target.value;
                                        setFirstName(newFirstName);
                                        setIsSaving(false)
                                        const isDuplicate = dataCustomers.some(item => item.firstName.toLowerCase() === newFirstName.toLowerCase() && item.lastName.toLowerCase() === lastName.toLowerCase())
                                        if (isDuplicate) {
                                            setErrorname("Bunday bemor mavjud");
                                            setIsSaving(true)
                                        } else {
                                            setErrorname(""); // Reset error message if not duplicate
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Otasining ismi"
                                    id="outlined-controlled"
                                    type='text'
                                    value={patronymic}
                                    // helpertext={<span style={{ color: "red" }}>{errorPatronymic}</span>}
                                    onChange={(event) => {
                                        setPatronymic(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Yosh"
                                    id="outlined-controlled"
                                    type='number'
                                    value={age}
                                    // helpertext={<span style={{ color: "red" }}>{errorage}</span>}
                                    onChange={(event) => {
                                        const enteredValue = event.target.value;
                                        const parsedValue = parseInt(enteredValue);
                                        if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 110) {
                                            setAge(parsedValue);
                                        } else {
                                            setAge(''); // Clear the input if the entered value is invalid
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <PhoneInput
                                    inputStyle={{ width: "100%", height: "58px", border: "0px" }}
                                    className="react-international-phone-country-selector-button"
                                    style={{ '--react-international-phone-height': '60px' }}

                                    defaultCountry="uz"
                                    value={phoneNumber}
                                    // helpertext={<span style={{ color: "red" }}>{errorPhoneNumber}</span>}
                                    onChange={(phone) => setPhoneNumber(phone)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="gender-select-label">Jinsi</InputLabel>
                                    <Select
                                        labelId="gender-select-label"
                                        label="Jinsi"
                                        id="outlined-controlled"
                                        value={gender}
                                        // helpertext={<span style={{ color: "red" }}>{errorGender}</span>}
                                        onChange={e => setGender(e.target.value)}
                                    >
                                        <MenuItem value="male">Erkak</MenuItem>
                                        <MenuItem value="female">Ayol</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            {/* Dropdown Viloyat */}
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="country-select-demo"
                                    sx={{ width: "100%" }}
                                    value={region}
                                    onChange={(event, newValue) => {
                                        if (newValue) {
                                            setRegion(newValue);
                                            const districtsInSelectedRegion = dataRegionsAPI.districts.filter(district => district.region_id === newValue.id)
                                            setFilteredDistricts(districtsInSelectedRegion);
                                            setDistrict(null);
                                        } else {
                                            setRegion(null);
                                            setFilteredDistricts([]);
                                            setDistrict(null);
                                        }
                                    }}
                                    options={dataRegionsAPI.regions}
                                    autoHighlight
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Viloyatni tanlang"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            {/* Dropdown Tuman */}
                            <Grid item xs={6}>
                                <Autocomplete
                                    id="country-select-demo"
                                    sx={{ width: "100%" }}
                                    value={district}
                                    onChange={(event, newValue) => {
                                        setDistrict(newValue);
                                    }}
                                    options={filteredDistricts}
                                    autoHighlight
                                    getOptionLabel={(option) => option.name}
                                    renderOption={(props, option) => (
                                        <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option.name}
                                        </Box>
                                    )}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Tumanni tanlang"
                                            inputProps={{
                                                ...params.inputProps,
                                                autoComplete: 'new-password', // disable autocomplete and autofill
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="standard-multiline-static"
                                    label="Manzilni kiriting"
                                    type='text'
                                    multiline
                                    // rows={4}
                                    value={address}
                                    // helpertext={<span style={{ color: "red" }}>{errorAddress}</span>}
                                    onChange={(event) => {
                                        setAddress(event.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </form>



                    {/* Uchrashuv belgilash kodi */}
                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                        style={{ marginTop: "20px" }}
                    >
                        <Grid container spacing={1}>
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
                                        setCashPrice(0)
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
                                        setSelectedPrice(parsedValue);
                                        setCashPrice(parsedValue);
                                    }}
                                    helperText={errorOverPrice}
                                    error={errorOverPrice === "Jami puldan katta raqam kiritdingiz"}
                                />
                            </Grid>

                        </Grid>
                    </Box>



                    {/* Tulov qilish kodi */}
                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                        style={{ marginTop: "20px" }}
                    >
                        <Grid container
                            spacing={1}>
                            <Grid item xs={12}>
                                <FormGroup>
                                    <div>
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="Naqd" />
                                        <TextField
                                            sx={{ width: "100%" }}
                                            label="Naqd pul to'lovi"
                                            id="cashPrice"
                                            type='number'
                                            helperText={errorOverPrice}
                                            error={errorOverPrice === "Jami puldan katta raqam kiritdingiz"}
                                            value={cashPrice}
                                            onChange={handleCashPriceChange}
                                        />
                                    </div>
                                    <div>
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={isTextFieldOpenPlastik}
                                                onChange={(event) => setIsTextFieldOpenPlastik(event.target.checked)}
                                            />}
                                            label="Plastik"
                                        />
                                        {
                                            isTextFieldOpenPlastik ? (
                                                <TextField
                                                    sx={{ width: "100%" }}
                                                    label="Plastik karta to'lovi"
                                                    id="outlined-controlled"
                                                    type='number'
                                                    helperText={errorOverPrice}
                                                    error={errorOverPrice === "Jami puldan katta raqam kiritdingiz"}
                                                    value={plasticPrice}
                                                    onChange={handlePlasticPriceChange}
                                                />
                                            ) : null
                                        }

                                    </div>
                                    <div>
                                        <FormControlLabel
                                            control={<Checkbox
                                                checked={isTextFieldOpenClick}
                                                onChange={(event) => setIsTextFieldOpenClick(event.target.checked)}
                                            />}
                                            label="Click"
                                        />
                                        {
                                            isTextFieldOpenClick ? (
                                                <TextField
                                                    sx={{ width: "100%" }}
                                                    label="Click to'lovi"
                                                    id="outlined-controlled"
                                                    type='number'
                                                    helperText={errorOverPrice}
                                                    error={errorOverPrice === "Jami puldan katta raqam kiritdingiz"}
                                                    value={clickPrice}
                                                    onChange={handleClickPriceChange}

                                                />
                                            ) : ''
                                        }

                                    </div>
                                </FormGroup>



                            </Grid>



                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Bekor qilish</Button>
                    <Button variant='contained' onClick={handleButtonClick} disabled={isSaving}> {"Qo"}&apos;{"shish"} </Button>


                </DialogActions>
            </Dialog>
        </>
    );
}