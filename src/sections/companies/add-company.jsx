import React from 'react';
import Box from '@mui/material/Box';
import { Button, SvgIcon } from '@mui/material';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import 'react-international-phone/style.css';
import axios from 'axios';
import { DEPARTMENTS_URL } from 'src/API';


export default function AddCompany({ setNewCompVal }) {
    const [open, setOpen] = React.useState(false);
    const [categoryName, setCategoryName] = React.useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleButtonClick = (event) => {
        event.preventDefault();
        axios.post(DEPARTMENTS_URL, {
            categoryName: categoryName
        }, { withCredentials: true })
            .then(res => {
                console.log("Data is saved", res);
                setNewCompVal((prev) => [...prev, res.data])
                setOpen(false);
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
                {"Bo"}&apos;{"lim "} {"Qo"}&apos;{"shish"}
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{"Bo"}&apos;{"lim "} {"Qo"}&apos;{"shish"}    </DialogTitle>
                <DialogContent>
                    <Box
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <TextField
                            label="Bo'lim nomi ..."
                            id="outlined-controlled"
                            type='text'
                            value={categoryName}
                            onChange={(event) => {
                                setCategoryName(event.target.value);
                            }}
                        />
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