import React, { useCallback, useState, useEffect } from 'react';
import {
  Box,  
  Card,
  CardContent,
  CardHeader,
  Unstable_Grid2 as Grid,
  Container,
  Stack
} from '@mui/material';
import { Pagination } from '@mui/material';

const itemsPerPage = 5;

export const AccountProfileDetails = (props) => {
  const { patient } = props; 
  const [expandedPanels, setExpandedPanels] = useState({});
  const [patientInfo, setPatientInfo] = useState([]);
  const [paginatedPatientInfo, setPaginatedPatientInfo] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = useCallback((event, newPage) => {
    setCurrentPage(newPage);
  }, []);

  useEffect(() => {
    setPatientInfo(patient.treatmentHistory);
    updatePaginatedData(patient.treatmentHistory, currentPage); 
  }, [currentPage, patient]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpandedPanels(isExpanded ? panel : null);
  };
  const updatePaginatedData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);
    setPaginatedPatientInfo(paginatedData);
  };

  return (
    <form autoComplete="off">
      <Card>
        <CardHeader
          subheader="Bemor haqida qo'shimcha ma'lumot kiritilishi mumkin"
          title="Bemor tarihi"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={12}>
                <div>
                  {paginatedPatientInfo && paginatedPatientInfo.map((info, index) => (                    
                      <Container maxWidth="lg" key={index}>
                        <Stack spacing={3}>
                          <Grid
                            container
                            spacing={3}
                          >
                            <Grid
                              xs={4}
                              md={4}
                              lg={4}
                            >
                              <div
                                color="text.secondary"
                                variant="body2"
                              >
                                {info.diseaseName}
                              </div>
                            </Grid>
                            <Grid
                              xs={4}
                              md={4}
                              lg={4}
                            >
                              <div
                                color="text.secondary"
                                variant="body2"
                              >
                                <div color="text.secondary" variant="body2">
                                  {new Date(info.date).getUTCDate()}/
                                  {new Date(info.date).getUTCMonth() + 1}/
                                  {new Date(info.date).getUTCFullYear()}
                                </div>
                              </div>
                            </Grid>
                            <Grid
                              xs={4}
                              md={4}
                              lg={4}
                            >
                              <div
                                color="text.secondary"
                                variant="body2"
                              >
                                {info.amountPaid}
                              </div>
                            </Grid>
                          </Grid>

                        </Stack>
                      </Container>

                    
                  ))}
                </div>
              </Grid>
            </Grid>
          </Box>
        </CardContent>

      </Card>
      {/* Pagination controls */}
      <Box mt={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(patientInfo.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>
    </form>
  );
};
