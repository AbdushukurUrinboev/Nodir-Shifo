import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ExpensesSearch } from 'src/sections/expenses/expenses-search';
import { ExpensesTable } from 'src/sections/expenses/expenses-table';
import AddExpenses from 'src/sections/expenses/add-expenses';
import { applyPagination } from 'src/utils/apply-pagination';
import { base_URL } from 'src/API';
import axios from 'axios';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"
import MyDatePicker from 'src/sections/myDatepicker/myDatePicker';



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

const PageExpenses = withAllRouterGuard(() => {

    const [appointmentsApi, setappointmentsApi] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const appointments = useAppointments(appointmentsApi, page, rowsPerPage, searchQuery);
    const appointmentsIds = useAppointmentIds(appointments);
    const appointmentsSelection = useSelection(appointmentsIds);


    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const endToday = new Date()
    endToday.setHours(23, 59, 59, 999);
    const endMonth = endToday.getMonth() + 1;
    const endDay = endToday.getDate();




    const [startDate, setStartDate] = useState(new Date(`${year}/${month}/${day}`));
    const [endDate, setEndDate] = useState(new Date(endToday));



    useEffect(() => {
        axios.post(base_URL + "/paymentRoutes/expenses", {
            startDate: new Date(startDate).toISOString(),
            endDate: new Date(endDate).toISOString()

        }, { withCredentials: true })
            .then(res => {
                console.log(res.data);
                setappointmentsApi(res.data);

            })
            .catch(err => console.log(err))
    }
        , [startDate, endDate]);



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
        appointment.expense?.toLowerCase().includes(searchQuery.toLowerCase())
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


                        <Grid container spacing={2} >
                            <Grid item xs={5} sm={5}>
                                <Item>
                                    <ExpensesSearch
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                    />
                                </Item>
                            </Grid>
                            <Grid item xs={5} sm={5}>
                                <MyDatePicker
                                    startDate={startDate}
                                    setStartDate={setStartDate}
                                    endDate={endDate}
                                    setEndDate={setEndDate} />
                            </Grid>
                            <Grid item xs={2} sm={2}>
                                <AddExpenses setNewExpenseVal={setappointmentsApi}/>
                            </Grid>
                        </Grid>

                        {
                            filteredAppointments.length > 0 ? (
                                <ExpensesTable
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

PageExpenses.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default PageExpenses;
