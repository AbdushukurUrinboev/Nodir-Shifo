import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import DiseasesAdd from 'src/sections/diseases/diseases-add';
import { DiseasesTable } from 'src/sections/diseases/diseases-table';
import { DiseasesSearch } from 'src/sections/diseases/diseases-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { DISEASES_URL } from 'src/API';
import axios from 'axios';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"




const useCustomers = (inputDiseases, page, rowsPerPage, searchQuery) => {
    return useMemo(
        () => {
            return applyPagination(inputDiseases, page, rowsPerPage);
        },
        [inputDiseases, page, rowsPerPage]
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

const Diseases = withAllRouterGuard (() => {
    const [diseases, setDiseases] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const customers = useCustomers(diseases, page, rowsPerPage, searchQuery);
    const customersIds = useCustomerIds(customers);
    const customersSelection = useSelection(customersIds);
    const [customerAddopen, setCustomerAddopen] = useState(false);


    useEffect(() => {
        axios.get(DISEASES_URL, {withCredentials: true})
            .then(res => {
                setDiseases(res.data);

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

    const filteredDiseases = diseases.filter((disease) =>
        disease.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedDiseases = applyPagination(
        filteredDiseases,
        page,
        rowsPerPage
    );










    return (
        <>
            <Head>
                <title>
                    Kasalliklar | Devias Kit
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
                                    Kasalliklar
                                </Typography>
                                {/* <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowUpOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Import
                  </Button>
                  <Button
                    color="inherit"
                    startIcon={(
                      <SvgIcon fontSize="small">
                        <ArrowDownOnSquareIcon />
                      </SvgIcon>
                    )}
                  >
                    Export
                  </Button>
                </Stack> */}
                            </Stack>
                            <div>
                                <DiseasesAdd setNewDecVal={setDiseases} />
                            </div>
                        </Stack>
                        <DiseasesSearch
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                        {
                            filteredDiseases.length > 0 ? (

                                <DiseasesTable
                                    count={filteredDiseases.length}
                                    items={paginatedDiseases}
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

Diseases.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Diseases;
