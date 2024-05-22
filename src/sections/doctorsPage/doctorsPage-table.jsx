import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Button,
  SvgIcon,
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import { DOCTORSPAGE_CALL_URL, ACCOUNT } from 'src/API';
import axios from 'axios';
import { useRouter } from 'next/router';

export const DoctorsPageTable = (props) => {
  const [buttonStates, setButtonStates] = useState({});
  const [disabledButtons, setDisabledButtons] = useState({});
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => { },
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    updateALLPatients,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);



  useEffect(() => {
    const initialDisabledButtons = {};
    selected.forEach((patientId) => {
      initialDisabledButtons[patientId] = true;
    });
    setDisabledButtons(initialDisabledButtons);
  }, [selected]);


  const sendCallPatient = async (apptID) => {
    const { data: serverMSG } = await axios.post(DOCTORSPAGE_CALL_URL, { appointmentId: apptID }, { withCredentials: true });
    return serverMSG === "patient called";
  }
  const handleButtonClick = async (patientId) => { // this is appointment  ID
    const calledResult = await sendCallPatient(patientId);
    if (calledResult) {
      updateALLPatients((prevvv) => {
        const newValueFORPT = prevvv.map((prevVAl) => {
          if (prevVAl._id === patientId) {
            return {
              ...prevVAl, // Keep all other properties unchanged
              isPending: false, // Update isPending to false
            };
          } else {
            return prevVAl
          }
        });
        return newValueFORPT;
      })
      // setButtonStates((prevState) => {
      //   const updatedButtonStates = { ...prevState };
      //   Object.keys(updatedButtonStates).forEach((key) => {
      //     updatedButtonStates[key] = 'Tugatildi';
      //   });
      //   // Toggle the state of the clicked button
      //   updatedButtonStates[patientId] =
      //     prevState[patientId] === 'Qabul qilish' ? 'Tugatildi' : 'Jarayonda';

      //   // Disable the button for the selected patient
      //   const updatedDisabledButtons = { ...disabledButtons };
      //   updatedDisabledButtons[patientId] = true;

      //   setDisabledButtons(updatedDisabledButtons);

      //   return updatedButtonStates;
      // });
    }
  };

  const router = useRouter();
  const handleOnClick = (id) => {

    router.push({
      pathname: '/account',
      query: { id: id }
    });
  }


  return (
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  ISM/FAMILIYA
                </TableCell>
                <TableCell>
                  Holati
                </TableCell>
                <TableCell>
                  Xona raqami
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((patient) => {
                const isSelected = selected.includes(patient._id);
                const buttonState = buttonStates[patient._id] || 'Qabul qilish'; // Default to 'Add'

                return (
                  <TableRow
                    hover key={patient._id}
                    selected={isSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(patient._id);
                          } else {
                            onDeselectOne?.(patient._id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Typography
                          variant="subtitle2"
                          onClick={e => handleOnClick(patient.selectedPatientId)}
                          style={{ cursor: 'pointer' }}
                        >
                          {patient.selectedPatient}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell style={{ textAlign: 'left' }}>

                      <Button
                        startIcon={(
                          <SvgIcon fontSize="small">
                            <CheckIcon />
                          </SvgIcon>
                        )}
                        variant="contained"
                        onClick={() => handleButtonClick(patient._id)} // Handle button click
                        style={{
                          backgroundColor: buttonState === 'Qabul qilish' ? '#0094FF' : buttonState === 'Tugatildi' ? '#F8F9FA' : '#FF9900',

                        }}
                        disabled={disabledButtons[patient._id] || !(patient.isPending)}
                      >
                        {buttonState}
                      </Button>


                    </TableCell>
                    <TableCell>
                      {patient.roomNumber}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

DoctorsPageTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};
