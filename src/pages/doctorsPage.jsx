import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { DoctorsPageTable } from 'src/sections/doctorsPage/doctorsPage-table';
import { DoctorsPageSearch } from 'src/sections/doctorsPage/doctorsPage-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { DOCTORSPAGE_URL } from 'src/API';
import axios from 'axios';
import { withAllRouterGuard } from "./../hocs/with-auth-guard";





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

const doctorsPage = withAllRouterGuard(() => {
    const [patients, setPatients] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const customers = useCustomers(patients, page, rowsPerPage, searchQuery);
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);
    const [customerAddopen, setCustomerAddopen] = useState(false);


    const fetchDoctorData = async () => {
        const docID = window.sessionStorage.getItem('userID');
        const isDoc = window.sessionStorage.getItem('isDoctor');
        if (isDoc === "true" && docID) {
            try {
                const { data } = await axios.get(DOCTORSPAGE_URL + "/" + docID, { withCredentials: true });
                return data;
            } catch (error) {
                console.log(error);
                return [];
            }

        }
    }

    useEffect(() => {
        (async function () {
            const result = await fetchDoctorData();
            setPatients(result);
        })();

    }, []);

    useEffect(() => {
        let intervalId;
        if (patients.length === 0 || !patients.some(patient => patient.isPending)) {
            (async function () {
                // const testResult = await fetchDoctorData();
                // if (testResult.length > 0 || testResult.some(patient => patient.isPending)) {
                //     setPatients(testResult);
                // } else {
                intervalId = setInterval(async () => {
                    console.log("interval running");
                    const newResult = await fetchDoctorData();
                    if (newResult.length > 0 && newResult.some(patient => patient.isPending)) {
                        setPatients(newResult);
                    }
                }, 10000);
                // }
            })();

        } else {
            clearInterval(intervalId);
        }



        return () => clearInterval(intervalId);
    }, [patients]);

    const handlePageChange = useCallback((event, value) => {
        setPage(value);
    }, []
    );

    const handleRowsPerPageChange = useCallback((event) => {
        setRowsPerPage(event.target.value);
        setPage(0);
    }, []
    );

    const filteredPatients = patients.filter((patients) =>
        patients.selectedPatient.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedDoctorsPage = applyPagination(
        filteredPatients,
        page,
        rowsPerPage
    );




    return (
        <>
            <Head>
                <title>
                    Doktor oynasi | Devias Kit
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
                                    Doktor Oynasi
                                </Typography>
                            </Stack>
                        </Stack>
                        <DoctorsPageSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        {
                            filteredPatients.length > 0 ? (

                                <DoctorsPageTable
                                    updateALLPatients={setPatients}
                                    count={filteredPatients.length}
                                    items={paginatedDoctorsPage}
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
                                    <span>Navbatda kasallar topilmadi</span>
                                </div>
                            )
                        }


                    </Stack>
                </Container>
            </Box>
        </>
    );
});

doctorsPage.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default doctorsPage;
