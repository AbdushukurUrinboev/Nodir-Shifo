import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { DoctorsTable } from 'src/sections/doctor/doctors-table';
import { DoctorsSearch } from 'src/sections/doctor/doctors-search';
import { applyPagination } from 'src/utils/apply-pagination';
import DoctorAdd from 'src/sections/doctor/doctor-add';
import axios from 'axios';
import { DOCTORS_URL } from 'src/API';
import { withAllRouterGuard } from "./../hocs/with-auth-guard";



const useDoctors = (inputDoctor, page, rowsPerPage, searchQuery) => {
  return useMemo(
    () => {
      return applyPagination(inputDoctor, page, rowsPerPage);
    },
    [inputDoctor, page, rowsPerPage]
  );
};

const useDoctorIds = (doctors) => {
  return useMemo(
    () => {
      return doctors.map((doctor) => doctor._id);
    },
    [doctors]
  );
};

const PageDoctors = withAllRouterGuard(() => {
  const [doctorsInput, setDoctorsInput] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const doctors = useDoctors(doctorsInput, page, rowsPerPage, searchQuery);
  const doctorsIds = useDoctorIds(doctors);
  const doctorsSelection = useSelection(doctorsIds);


  useEffect(() => {
    axios.get(DOCTORS_URL, { withCredentials: true })
      .then(res => {
        setDoctorsInput(res.data);

      })
      .catch(err => console.log(err))
  }, []);


  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  },
    []
  );

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  },
    []
  );


  const filteredDoctors = doctorsInput.filter((doctor) =>
    doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedDoctors = applyPagination(
    filteredDoctors,
    page,
    rowsPerPage
  );





  return (
    <>
      <Head>
        <title>
          Doktorlar | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Doktorlar
                </Typography>
              </Stack>
              <div>
                <div>
                  <DoctorAdd setNewDocVal={setDoctorsInput} />
                </div>
              </div>
            </Stack>
            <DoctorsSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />



            {
              filteredDoctors.length > 0 ? (
                <DoctorsTable
                  count={filteredDoctors.length}
                  items={paginatedDoctors}
                  onDeselectAll={doctorsSelection.handleDeselectAll}
                  onDeselectOne={doctorsSelection.handleDeselectOne}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onSelectAll={doctorsSelection.handleSelectAll}
                  onSelectOne={doctorsSelection.handleSelectOne}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  selected={doctorsSelection.selected}
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

PageDoctors.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PageDoctors;
