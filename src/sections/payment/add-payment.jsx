import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Button, SvgIcon } from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useReactToPrint } from 'react-to-print';

import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import axios from 'axios';
import { PAYMENTS_URL } from 'src/API';

import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';



export default function AddPayment({ setNewPayVal, nextStep, setNextStep }) {
    const [open, setOpen] = React.useState(false);
    const [paymentsAPI, setPaymentsAPI] = React.useState([]);
    const [selectedPatient, setSelectedPatient] = React.useState(null);
    const [overallPrice, setOverallPrice] = React.useState(0);
    const [cashPrice, setCashPrice] = React.useState(0);
    const [plasticPrice, setPlasticPrice] = React.useState(0);
    const [clickPrice, setClickPrice] = React.useState(0);


    const [isTextFieldOpenNaqd, setIsTextFieldOpenNaqd] = useState(false);
    const [isTextFieldOpenPlastik, setIsTextFieldOpenPlastik] = useState(false);
    const [isTextFieldOpenClick, setIsTextFieldOpenClick] = useState(false);
    const [errorOverPrice, setErrorOverPrice] = React.useState('');

    const printRef = useRef();


    useEffect(() => {
        axios.get(PAYMENTS_URL, { withCredentials: true })
            .then(res => {
                setPaymentsAPI(res.data);
            })
            .catch(err => console.log(err))
    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNextStep(null)
    };



    const handleButtonClick = (event) => {
        event.preventDefault();
       
        if (selectedPatient?._id) {
            axios.post(PAYMENTS_URL + `/pay/${selectedPatient._id}`, {
                cash: cashPrice,
                card: plasticPrice,
                click: clickPrice
            }, { withCredentials: true })
                .then(res => {
                    console.log("Data is saved", res);
                    setNewPayVal((prev) => [...prev, res.data])
                    setOpen(false);
                    setSelectedPatient(null);
                    setOverallPrice(0)
                    setNextStep(null)
                })
                .catch(err => console.log(err))
        }

    }

    const handleDiseases = (patientID) => {
        paymentsAPI.map(payment => {
            if (payment._id === patientID) {
                setOverallPrice(payment.overallPrice)
                setCashPrice(payment.overallPrice)
            }
        });


    }

    const handleOverallPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        setOverallPrice(parsedValue);
        setCashPrice(parsedValue);
    };

    const handleCashPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        if (parsedValue + plasticPrice + clickPrice > overallPrice) {
            setErrorOverPrice("Jami puldan katta raqam kiritdingiz")
        } else {
            setErrorOverPrice('')
            setCashPrice(parsedValue)
        }
    };

    const handlePlasticPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        if (parsedValue + cashPrice + clickPrice > overallPrice) {
            setErrorOverPrice("Jami puldan katta raqam kiritdingiz")
        } else {
            setErrorOverPrice('')
            setPlasticPrice(parsedValue)
        }
    };

    const handleClickPriceChange = (event) => {
        const enteredValue = event.target.value;
        const parsedValue = Number(enteredValue);
        if (parsedValue + plasticPrice + cashPrice > overallPrice) {
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
                {"To"}&apos;{"lov qilish"}
            </Button>

            <Dialog open={open || (nextStep === null ? false : true)}
                onClose={handleClose}>
                <DialogTitle>{"To"}&apos;{"lov qilish"}</DialogTitle>
                <DialogContent ref={printRef}>
                    <h4>El-Aziz Shifo Nur klinikasi cheki</h4>
                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >
                        <Grid container
                            spacing={1}>
                            <Grid item
                                xs={12}>
                                <Autocomplete
                                    id="customer-select-demo"
                                    sx={{ width: "100%" }}
                                    value={selectedPatient}
                                    onChange={(event, newValue) => {
                                        handleDiseases(newValue ? newValue._id : "")
                                        // console.log("newValueID = " + (newValue ? newValue._id : ""));
                                        setSelectedPatient(newValue);
                                    }}
                                    options={paymentsAPI}
                                    autoHighlight
                                    getOptionLabel={(option) => option.patientFullName || ''} // Check if patientFullName exists
                                    renderOption={(props, option) => (
                                        <Box component="li"
                                            sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                                            {option.patientFullName || ''} {/* Provide a default value if patientFullName is missing */}
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
                            <Grid>

                            </Grid>
                            <Grid item xs={12}>
                                {selectedPatient ? (
                                    selectedPatient.pendingPayments.map(elem => (
                                        <React.Fragment key={elem._id}>
                                            <div style={{ display: "block", padding: "4px", marginLeft: "16px" }}>
                                                <span style={{ fontWeight: "700" }}>{elem.diseaseName}: -  </span>
                                                <span style={{ fontWeight: "500" }}>{elem.price}</span>
                                            </div>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <span> {"Ma"}&apos;{"lumot topilmadi"}  </span>
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Jami narxi"
                                    id="overallPrice"
                                    type='number'
                                    value={overallPrice}
                                    onChange={handleOverallPriceChange}
                                />
                            </Grid>


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
                                            ) : ''
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
                    <Button>
                        <LocalPrintshopIcon
                            style={{ marginRight: 'auto' }}
                            onClick={handlePrint}

                        />
                    </Button>
                    <Button variant='outlined' onClick={handleClose}>Bekor qilish</Button>
                    <Button
                        variant='contained'
                        onClick={handleButtonClick}
                        disabled={overallPrice !== cashPrice + plasticPrice + clickPrice}
                    > {"To"}&apos;{"lash"} </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}