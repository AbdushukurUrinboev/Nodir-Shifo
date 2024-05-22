'use client'
import React from 'react';
import { Box, Typography, Unstable_Grid2 as Grid, Button, Modal, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Draggable } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import axios from "axios";
import { useEffect, useState } from 'react';
import { APPOINTMENTS_URL } from 'src/API';
// import ringSound from './eventually.mp3';
import { useRef } from 'react';



// function PaperComponent(props) {
//     return (
//         <Draggable
//             handle="#draggable-dialog-title"
//             cancel={'[class*="MuiDialogContent-root"]'}
//         >
//             <Paper {...props} />
//         </Draggable>
//     );
// }

function DraggableDialog() {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>

            <Dialog
                open={open}
                onClose={handleClose}
                // PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Diqqat!
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Dasturning ishlashi uchun OK tugmasini bosing
                    </DialogContentText>
                </DialogContent>
                <DialogActions>

                    <Button onClick={handleClose}>OK</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const Navbat = () => {
    const audioRef = useRef();
    const [open, setOpen] = React.useState(false);


    const backgroundImage = {
        backgroundImage: `url('/assets/navbatBackground.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        width: '100%',
    }

    const contentGrid = {
        borderRadius: '40px',
        width: "90%",
        margin: '0 auto',
        textAlign: 'center',
        fontWeight: '700',
        overflow: 'hidden'
    }

    const content = {
        backgroundColor: '#0094FF',
        padding: '20px',
        borderRadius: '40px 40px 0px 0px',
        marginTop: '40px',
        color: '#FFFFFF',
        fontSize: '54px',
        marginLeft: '20px'
    }

    const contentBody = {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        padding: '10px',
        fontWeight: '77.45px',
        // lineHeight: '77.45px',
        color: 'rgba(0, 0, 0, 1)',
        fontSize: '54px',
        marginLeft: '20px',
        // backdropFilter: "blur(18px)"
    }
    const [queues, setQueues] = useState([])
    const [calledAppointments, setCalledAppointments] = useState([])


    const playMusic = () => {
        if (audioRef.current) {
            audioRef.current.play()
        } else {
            // Throw error
        }

        // Replace 'your-music-file.mp3' with the path to your music file
        // const audio = new Audio(ringSound);
        // audio.play();
    };

    useEffect(() => {
        const removeFirstItem = () => {
            setCalledAppointments((prevItems) => prevItems.slice(1));
            setOpen(false);
        };

        // Check if there are items to display and start the timer
        if (calledAppointments.length > 0) {
            setOpen(true);
            playMusic();
            const timer = setTimeout(removeFirstItem, 15000);

            // Clean up the timer when the component unmounts or when the displayedItems change
            return () => clearTimeout(timer);
        }
    }, [calledAppointments]);




    useEffect(() => {
        (async function () {
            const { data } = await axios.get(APPOINTMENTS_URL + "/pending", { withCredentials: true });
            setQueues(data);
        })();

        const checkNewUpdates = async () => {
            const { data } = await axios.get(APPOINTMENTS_URL + "/check-updates", { withCredentials: true });
            console.log(data);
            if (data.appointments.length > 0) {
                setQueues((prev) => [...prev, ...data.appointments])
            }

            if (data.calledAppointment.length > 0) {
                setCalledAppointments((prevv) => [...prevv, ...data.calledAppointment]);
                (async function () {
                    const { data } = await axios.get(APPOINTMENTS_URL + "/pending", { withCredentials: true });
                    setQueues(data);
                })();  
                // data.calledAppointment.forEach((eachApp) => {
                //     setQueues((prev) => {
                //         const index = prev.findIndex(obj => obj._id === eachApp._id);
                //         if (index !== -1) {
                //             const newArrVal = [...prev];
                //             newArrVal[index].isPending = false;
                //             return newArrVal;
                //         } else {
                //             const newObj = { ...eachApp, isPending: false };
                //             return [...prev, newObj]
                //         }
                //     });

                // });
            }
        }

        const intervalId = setInterval(checkNewUpdates, 10000);

        return () => clearInterval(intervalId);

    }, []);

    // useEffect(() => {
    //     // ringing logic
    // }, [calledAppointments]);


    return (
        <div style={backgroundImage}>

            <DraggableDialog />

            <audio ref={audioRef} src='/assets/eventually.mp3' />
            {/* Modal */}
            <div>
                <Modal
                    open={open}
                    onClose={() => setOpen(false)}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h2" component="h2">
                            {calledAppointments[0]?.selectedPatient}
                        </Typography>
                        <Typography id="modal-modal-description" variant='h2' component='h2' sx={{ mt: 2 }}>
                            Xona raqami: {calledAppointments[0]?.room}
                        </Typography>
                    </Box>
                </Modal>
            </div>
            {/* Modal finished */}

            <Grid
                container
                justifyContent="center"
                style={contentGrid}
            >
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="h4"
                        align="center"
                        style={content}
                    >
                        Kutuvchilar
                    </Typography>

                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography
                        variant="h4"
                        align="center"
                        style={content}
                    >
                        Navbat
                    </Typography>
                </Grid>
                <Grid item
                    xs={12}
                    sm={6}>
                    {/* UI FIXX */}
                    {
                        queues.filter((que) => que.isPending).map((queue, indxx) => (
                            <Typography
                                variant="h4"
                                align="center"
                                style={contentBody}
                                key={indxx}
                            >
                                {queue.selectedPatient}


                            </Typography>
                        ))
                    }
                </Grid>
                <Grid item
                    xs={12}
                    sm={6}>
                    {
                        queues.filter((que) => !(que.isPending)).map((queue, indxx) => (
                            <Typography
                                variant="h4"
                                align="center"
                                style={contentBody}
                                key={indxx}
                            >
                                {queue.selectedPatient}

                                {/* <Button
                                    variant="contained"
                                    style={{
                                        width: '50%',
                                        fontSize: '44px',
                                        fontWeight: '700',
                                        marginLeft: '20px',
                                        textAlign: 'left'
                                    }}
                                >
                                    105 - xona
                                </Button> */}
                            </Typography>
                        ))
                    }

                </Grid>
            </Grid>
        </div>
    );
};


// Navbat.getLayout = (page) => (
//     <DashboardLayout>
//         {page}
//     </DashboardLayout>
// );


export default Navbat;