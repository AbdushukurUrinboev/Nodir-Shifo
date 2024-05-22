import React from 'react';
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
import { DOCTORS_URL, DEPARTMENTS_URL } from 'src/API';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useEffect } from 'react';





export default function FormDialog({ setNewDocVal }) {
    const [open, setOpen] = React.useState(false);
    const [errorSurname, setErrorSurname] = React.useState('');
    const [errorname, setErrorname] = React.useState('');
    const [errorPatronymic, setErrorPatronymic] = React.useState('');
    const [errorage, setErrorage] = React.useState('');
    const [errorGender, setErrorGender] = React.useState('');
    const [errorPhoneNumber, setErrorPhoneNumber] = React.useState('');
    const [errorAddress, setErrorAddress] = React.useState('');
    const [errorDoctorLogin, setErrorDoctorLogin] = React.useState('');
    const [errorPassword, setErrorPassword] = React.useState('');

    const [isImageUploaded, setIsImageUploaded] = React.useState(false);

    const [lastName, setLastName] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [patronymic, setPatronymic] = React.useState('');
    const [age, setAge] = React.useState('');
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [gender, setGender] = React.useState("");
    const [region, setRegion] = React.useState(dataRegionsAPI.regions[11]);
    const [district, setDistrict] = React.useState(dataRegionsAPI.districts[170]);
    const [address, setAddress] = React.useState('');
    const [speciality, setSpeciality] = React.useState('');
    const [roomNumber, setRoomNumber] = React.useState(1);
    const [avatar, setAvatar] = React.useState();
    const [filteredDistricts, setFilteredDistricts] = React.useState([]);
    const [doctorLogin, setDoctorLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [treatmentCategory, setTreatmentCategory] = React.useState([]); //


    useEffect(() => {
        axios.get(DEPARTMENTS_URL, { withCredentials: true })
            .then(res => {
                setTreatmentCategory(res.data);

            })
            .catch(err => console.log(err))
    }, []);



    const router = useRouter();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();

        if (doctorLogin === '') {
            setErrorDoctorLogin("Loginni kiriting")
        }

        if (password === '') {
            setErrorPassword("Parolni kiriting")
        }

        if (lastName === '') {
            setErrorSurname('Familiyani kiriting...');
            return;
        }
        if (firstName === '') {
            setErrorname('Ismni kiriting...');
            return;
        }
        if (patronymic === '') {
            setErrorPatronymic('Otasining ismini kiriting...');
            return;
        }
        if (age === '') {
            setErrorage('Yoshni kiriting...');
            return;
        }
        if (address === '') {
            setErrorAddress('Manzilni kiriting...');
            return;
        }
        if (phoneNumber.length < 12) {
            setErrorPhoneNumber('Telefonni kiriting...');
            return;
        }
        if (gender === '') {
            setErrorGender('Jinsni tanlang ...');
            return;
        }

        if (lastName !== '' && firstName !== '' && age !== '' && patronymic !== '' && address !== '' && phoneNumber !== '' && gender !== '') {

            const newDoctor = new FormData()
            newDoctor.append("doctorLogin", doctorLogin)
            newDoctor.append("password", password)
            newDoctor.append("firstName", firstName)
            newDoctor.append("lastName", lastName)
            newDoctor.append("patronymic", patronymic)
            newDoctor.append("age", age)
            newDoctor.append("phoneNumber", phoneNumber)
            newDoctor.append("gender", gender)
            newDoctor.append("district", district.name)
            newDoctor.append("address", address)
            newDoctor.append("region", region.name)
            newDoctor.append("speciality", speciality)
            newDoctor.append("roomNumber", roomNumber)
            newDoctor.append("avatar", avatar);



            axios.post(DOCTORS_URL, newDoctor, { withCredentials: true })
                .then(res => {
                    console.log("Data is saved", res);
                    setNewDocVal((prev) => [...prev, res.data])
                    setOpen(false);
                })
                .catch(err => console.log(err))

        }

    }

    const handleImageUpload = (event) => {
        if (event.target.files && event.target.files.length > 0) {
            setIsImageUploaded(true);
            setAvatar(event.target.files[0])
            // You can also perform any other actions related to the uploaded image here.
        }
    };

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
                {"Doktor Qo"}&apos;{"shish"}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Doktor Qo"}&apos;{"shish"}  </DialogTitle>

                <DialogContent>
                    <DialogContentText style={{ marginBottom: '12px' }}>
                        {"Doktor haqida quyida so"}&apos;{"ralgan to"} &apos; {"liq  ma"} &apos; {"lumotlarni kiriting."}
                    </DialogContentText>

                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >
                        <Grid container spacing={1}>

                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Login kiriting"
                                    id="outlined-controlled"
                                    type='text'
                                    value={doctorLogin}
                                    helpertext={<span style={{ color: "red" }}>{errorDoctorLogin}</span>}
                                    onChange={(event) => {
                                        setDoctorLogin(event.target.value);
                                    }}


                                />
                            </Grid>

                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Parolni kiriting"
                                    id="outlined-controlled"
                                    type='text'
                                    value={password}
                                    helpertext={<span style={{ color: "red" }}>{errorPassword}</span>}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}


                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Familiya"
                                    id="outlined-controlled"
                                    type='text'
                                    value={lastName}
                                    helpertext={<span style={{ color: "red" }}>{errorSurname}</span>}
                                    onChange={(event) => {
                                        setLastName(event.target.value);
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
                                    helpertext={<span style={{ color: "red" }}>{errorname}</span>}
                                    onChange={(event) => {
                                        setFirstName(event.target.value);
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
                                    helpertext={<span style={{ color: "red" }}>{errorPatronymic}</span>}
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
                                    helpertext={<span style={{ color: "red" }}>{errorage}</span>}
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
                                    helpertext={<span style={{ color: "red" }}>{errorPhoneNumber}</span>}
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
                                        helpertext={<span style={{ color: "red" }}>{errorGender}</span>}
                                        onChange={e => setGender(e.target.value)}
                                    >
                                        <MenuItem value="male">Erkak</MenuItem>
                                        <MenuItem value="female">Ayol</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="speciality-select-label">Mutaxassisligi</InputLabel>
                                    <Select
                                        labelId="speciality-select-label"
                                        label="Mutaxassisligi"
                                        id="outlined-controlled"
                                        value={speciality}
                                        onChange={e => setSpeciality(e.target.value)}
                                    >
                                        {treatmentCategory.map((treatment,ind) => (
                                        <MenuItem key={ind} value={treatment.categoryName}>
                                            {treatment.categoryName}
                                        </MenuItem>

                                        ))}
                                        {/* <MenuItem value="oftalmolog">Офтальмолог</MenuItem>
                                        <MenuItem value="pulmfnolog">Пульманолог</MenuItem>
                                        <MenuItem value="kardiolog">Кардиолог</MenuItem>
                                        <MenuItem value="ginekolog">Гинеколог</MenuItem>
                                        <MenuItem value="pediatr">Педиатр</MenuItem>
                                        <MenuItem value="laborant">Лаборант</MenuItem> */}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="room-select-label">Xona raqami</InputLabel>
                                    <Select
                                        labelId="room-select-label"
                                        label="Xona raqami"
                                        id="outlined-controlled"
                                        value={roomNumber}
                                        onChange={e => setRoomNumber(e.target.value)}
                                    >
                                        <MenuItem value="1">1</MenuItem>
                                        <MenuItem value="2">2</MenuItem>
                                        <MenuItem value="3">3</MenuItem>
                                        <MenuItem value="4">4</MenuItem>
                                        <MenuItem value="5">5</MenuItem>
                                        <MenuItem value="6">6</MenuItem>
                                        <MenuItem value="7">7</MenuItem>
                                        <MenuItem value="8">8</MenuItem>
                                        <MenuItem value="9">9</MenuItem>
                                        <MenuItem value="10">10</MenuItem>
                                        <MenuItem value="11">11</MenuItem>
                                        <MenuItem value="12">12</MenuItem>
                                        <MenuItem value="13">13</MenuItem>
                                        <MenuItem value="14">14</MenuItem>
                                        <MenuItem value="15">15</MenuItem>
                                        <MenuItem value="16">16</MenuItem>
                                        <MenuItem value="17">17</MenuItem>
                                        <MenuItem value="18">18</MenuItem>
                                        <MenuItem value="19">19</MenuItem>
                                        <MenuItem value="20">20</MenuItem>
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



                            <Grid item xs={6}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    id="standard-multiline-static"
                                    label="Manzilni kiriting"
                                    type='text'
                                    multiline
                                    // rows={4}
                                    value={address}
                                    helpertext={<span style={{ color: "red" }}>{errorAddress}</span>}
                                    onChange={(event) => {
                                        setAddress(event.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Stack alignItems="center" spacing={2}>
                                    <Button style={{ width: "100%", height: "60px" }} variant="contained" component="label">
                                        <CloudUploadIcon sx={{ marginRight: 2 }} /> {/* Add the icon before the text */}
                                        {isImageUploaded ? 'Rasm yuklandi' : 'Rasm yuklash'}
                                        <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
                                    </Button>
                                </Stack>
                            </Grid>





                        </Grid>
                    </Box>

                </DialogContent>

                <DialogActions>
                    <Button variant='outlined' onClick={handleClose}>Bekor qilish</Button>
                    <Button variant='contained' onClick={handleButtonClick}> {"Qo"}&apos;{"shish"}  </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}