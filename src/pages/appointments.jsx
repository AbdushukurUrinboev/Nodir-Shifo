import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
// import { subDays, subHours } from 'date-fns';
// import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
// import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
// import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AppointmentsTable } from 'src/sections/appointments/appointments-table';
import { AppointmentsSearch } from 'src/sections/appointments/appointments-search';
import { applyPagination } from 'src/utils/apply-pagination';
import AddAppointment from 'src/sections/appointments/add-appointment';
import { DISEASES_URL, APPOINTMENTS_URL } from 'src/API';
import axios from 'axios';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"



const useAppointments = (inputPatients, page, rowsPerPage, searchQuery) => {
  return useMemo(
    () => {
      return applyPagination(inputPatients, page, rowsPerPage);
    },
    [inputPatients, page, rowsPerPage]
  );
};

const useAppointmentIds = (appointment) => {
  return useMemo(
    () => {
      return appointment.map((appointment) => appointment._id);
    },
    [appointment]
  );
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const PageAppointments = withAllRouterGuard(({ nextStep: { nextStep, setNextStep, setValue } }) => {

  const [appointmentsApi, setappointmentsApi] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const appointments = useAppointments(appointmentsApi, page, rowsPerPage, searchQuery);
  const appointmentsIds = useAppointmentIds(appointments);
  const appointmentsSelection = useSelection(appointmentsIds);

  useEffect(() => {
    axios.get(APPOINTMENTS_URL, { withCredentials: true })
      .then(res => {
        setappointmentsApi(res.data);

      })
      .catch(err => console.log(err))
  }, []);


  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []
  );

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0)
  }, []
  );

  const filteredAppointments = appointmentsApi.filter((appointment) =>
    appointment.selectedPatient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedAppointments = applyPagination(
    filteredAppointments,
    page,
    rowsPerPage
  );


  return (
    <>
      <Head>
        <title>
          Uchrashuvlar | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>


            <Grid container spacing={2}>
              <Grid item xs={12} sm={9}>
                <Item>
                  <AppointmentsSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Item style={{ padding: 14 }}>
                  <AddAppointment
                    nextStep={nextStep}
                    setNextStep={setNextStep}
                    setValue={setValue}
                    setNewAppVal={setappointmentsApi} />
                </Item>
              </Grid>
            </Grid>
            {
              filteredAppointments.length > 0 ? (
                <AppointmentsTable
                  count={filteredAppointments.length}
                  items={paginatedAppointments}
                  onDeselectAll={appointmentsSelection.handleDeselectAll}
                  onDeselectOne={appointmentsSelection.handleDeselectOne}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onSelectAll={appointmentsSelection.handleSelectAll}
                  onSelectOne={appointmentsSelection.handleSelectOne}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  selected={appointmentsSelection.selected}
                />
              ) : (
                <div style={{ textAlign: "center", color: "blue", fontWeight: "bold" }}>
                  <span>{"Ma"}&apos;{"lumot topilmadi"}</span>
                </div>
              )
            }


          </Stack>
        </Container>
      </Box>
    </>
  );
});

PageAppointments.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PageAppointments;
