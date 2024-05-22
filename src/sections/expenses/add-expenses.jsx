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
import { base_URL } from 'src/API';



import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';



export default function AddExpenses({ setNewExpenseVal }) {
    const [open, setOpen] = React.useState(false);

    const [expense, setExpense] = React.useState("");
    const [amount, setAmount] = React.useState(0);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        axios.post(base_URL + "/paymentRoutes/expenses/add", { 
            expense: expense,
            amount: amount

        }, { withCredentials: true })
            .then(res => {
                console.log("Data is saved", res);
                setNewExpenseVal((prev) => [...prev, res.data])
                setOpen(false);
                setExpense("");
                amount(0);
            })
            .catch(err => console.log(err))
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
                {"Chiqim qo"}&apos;{"shish"}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Chiqimlarni kiriting</DialogTitle>

                <DialogContent>

                    <Box
                        component="form"
                        sx={{ flexGrow: 1 }}
                        autoComplete="off"
                    >
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Chiqim nomi"
                                    id="outlined-controlled"
                                    type='string'
                                    value={expense}
                                    onChange={(event) => {
                                        setExpense(event.target.value)
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    sx={{ width: "100%" }}
                                    label="Narxi"
                                    id="outlined-controlled"
                                    type='number'
                                    value={amount}
                                    onChange={(event) => {
                                        const enteredValue = event.target.value;
                                        const parsedValue = Number(enteredValue);
                                        setAmount(parsedValue)
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