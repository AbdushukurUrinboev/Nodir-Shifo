import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import CustomerAdd from 'src/sections/customer/customer-add';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { PATIENTS_URL } from 'src/API';
import axios from 'axios';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"




const useCustomers = (inputPatients, page, rowsPerPage, searchQuery) => {
  return useMemo(
    () => {
      return applyPagination(inputPatients, page, rowsPerPage);
    },
    [inputPatients, page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer._id);
    },
    [customers]
  );
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Page = withAllRouterGuard (({nextStep: {nextStep, setNextStep, setValue}}) => {
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const customers = useCustomers(patients, page, rowsPerPage, searchQuery);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [customerAddopen, setCustomerAddopen] = useState(false);


  useEffect(() => {
    axios.get(PATIENTS_URL, { withCredentials: true })
      .then(res => {
        setPatients(res.data);

      })
      .catch(err => console.log(err))
  }, []);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []
  );

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  }, []
  );

  const filteredPatients = patients.filter((patient) =>
    patient.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.lastName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedPatients = applyPagination(
    filteredPatients,
    page,
    rowsPerPage
  );



  return (
    <>
      <Head>
        <title>
          Bemorlar | Devias Kit
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
                <CustomersSearch
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Item style={{ padding: 14 }}>
                  <CustomerAdd setValue={setValue} setNextStep={setNextStep} setNewCustVal={setPatients} />
                </Item>
              </Grid>
            </Grid>
            {
              filteredPatients.length > 0 ? (

                <CustomersTable
                  count={filteredPatients.length}
                  items={paginatedPatients}
                  onDeselectAll={customersSelection.handleDeselectAll}
                  onDeselectOne={customersSelection.handleDeselectOne}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onSelectAll={customersSelection.handleSelectAll}
                  onSelectOne={customersSelection.handleSelectOne}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  selected={customersSelection.selected}

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

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
