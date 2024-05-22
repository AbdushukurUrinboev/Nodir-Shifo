"use client"
import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { PaymentsTable } from 'src/sections/payment/payments-table';
import { PaymentsSearch } from 'src/sections/payment/payments-search';
import { applyPagination } from 'src/utils/apply-pagination';
import AddPayment from 'src/sections/payment/add-payment';
import axios from 'axios';
import { PAYMENTS_URL } from 'src/API';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"



const usePayments = (inputPatients, page, rowsPerPage, searchQuery) => {
  return useMemo(
    () => {
      return applyPagination(inputPatients, page, rowsPerPage);
    },
    [inputPatients, page, rowsPerPage]
  );
};

const usePaymentIds = (customers) => {
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

const PagePayments = withAllRouterGuard(({ nextStep: { nextStep, setNextStep, setValue } }) => {

  const [paymentsAPI, setPaymentsAPI] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const payments = usePayments(paymentsAPI, page, rowsPerPage, searchQuery);
  const paymentsIds = usePaymentIds(payments);
  const paymentsSelection = useSelection(paymentsIds);

  useEffect(() => {
    axios.get(PAYMENTS_URL, { withCredentials: true })
      .then(res => {
        setPaymentsAPI(res.data);

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

  const filteredPayments = paymentsAPI.filter((payment) => {
    if (payment.patientFullName) {
      return payment.patientFullName.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return false; // or handle it in a different way
    }
  });

  const paginatedPayments = applyPagination(
    filteredPayments,
    page,
    rowsPerPage
  );

 



  return (
    <>
      <Head>
        <title>
          {"To"}&apos;{"lovlar | Devias Kit"}
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
                  <PaymentsSearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                  />
                </Item>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Item style={{ padding: 14 }}>


                  <AddPayment
                    nextStep={nextStep}
                    setNextStep={setNextStep}                   
                    setNewPayVal={setPaymentsAPI}
                  />
                </Item>
              </Grid>
            </Grid>


            {
              filteredPayments.length > 0 ? (
                <PaymentsTable
                  count={filteredPayments.length}
                  items={paginatedPayments}
                  onDeselectAll={paymentsSelection.handleDeselectAll}
                  onDeselectOne={paymentsSelection.handleDeselectOne}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  onSelectAll={paymentsSelection.handleSelectAll}
                  onSelectOne={paymentsSelection.handleSelectOne}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  selected={paymentsSelection.selected}
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

PagePayments.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default PagePayments;
