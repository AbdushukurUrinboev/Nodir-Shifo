import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewBudget } from 'src/sections/overview/overview-budget';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTasksProgress } from 'src/sections/overview/overview-tasks-progress';
import { OverviewTotalCustomers } from 'src/sections/overview/overview-total-customers';
import { OverviewTotalProfit } from 'src/sections/overview/overview-total-profit';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { PATIENTS_URL, PAYMENTS_URL, DOCTORS_URL, USERS_URL, PATIENT_DEPTS_URL } from 'src/API';
import axios from 'axios';

const now = new Date();

const Page = () => {

  const [patientsAgeTill25, setPatientsAgeTill25] = useState(0);
  const [patientsAgeTill45, setPatientsAgeTill45] = useState(0);
  const [patientsAgeTillOld, setPatientsAgeTillOld] = useState(0);
  const [tushum, setTushum] = useState(0)
  const [totalPatients, setTotalPatients] = useState('')
  const [totalStaff, setTotalStaff] = useState(0)
  const [totalPatientsDepts, setTotalPatientsDepts] = useState(0)

  // Bemorlar yoshi bo'yicha filtr
  useEffect(() => {
    axios.get(PATIENTS_URL, { withCredentials: true })
      .then(res => {
        let count25 = 0;
        let count45 = 0;
        let countOld = 0;
        res.data.filter((item) => {
          if(item.age <= 25) {
            count25 ++
          } else if(item.age > 25 && item.age <= 45) {
            count45 ++
          } else {
            countOld ++
          }
        });
        setPatientsAgeTill25(count25);
        setPatientsAgeTill45(count45)
        setPatientsAgeTillOld(countOld)
        ////////////////////////////////////////////////////////////
        const totalOverallPatients = res.data.length // mijozlar soni 
        setTotalPatients(totalOverallPatients.toString());
      })
      .catch(err => console.log(err))
  }, []);

  // Tushum
  useEffect(() => {
    axios.get(PAYMENTS_URL, { withCredentials: true })
      .then(res => {
        const totalOverallPrice = res.data.reduce((total, item) => total + item.overallPrice, 0);
        setTushum(totalOverallPrice);

      })
      .catch(err => console.log(err))
  }, []);

  // Xodimlar soni
  useEffect(() => {
    const fetchDoctorData = axios.get(DOCTORS_URL, { withCredentials: true });
    const fetchUserData = axios.get(USERS_URL, { withCredentials: true });
  
    Promise.all([fetchDoctorData, fetchUserData])
      .then(([doctorRes, userRes]) => {
        const totalStaff = doctorRes.data.length + userRes.data.length;
        setTotalStaff(totalStaff);
      })
      .catch(err => console.log(err));
  }, []);

  // Qarzdorlar
  useEffect(() => {
    axios.get(PATIENT_DEPTS_URL, { withCredentials: true })
      .then(res => {
        const totalOverallDepts = res.data.reduce((total, item) => total + item.overallPrice, 0);
        setTotalPatientsDepts(totalOverallDepts);

      })
      .catch(err => console.log(err))
  }, []);


  return (
    <div style={{marginTop: "0px"}}>
      <Head>
        <title>
          Overview | Devias Kit
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
          <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewBudget
                difference={12}
                positive
                sx={{ height: '100%' }}
                value={tushum}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTotalCustomers
                difference={16}
                positive={false}
                sx={{ height: '100%' }}
                value={totalPatients}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTasksProgress
                sx={{ height: '100%' }}
                value={totalStaff}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <OverviewTotalProfit
                sx={{ height: '100%' }}
                value={totalPatientsDepts.toString()}
              />
            </Grid>
            <Grid
              xs={12}
              lg={8}
            >
              <OverviewSales
                chartSeries={[
                  {
                    name: 'This year',
                    data: [1, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20]
                  },
                  {
                    name: 'Last year',
                    data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13]
                  }
                ]}
                sx={{ height: '100%' }}
              />
            </Grid>
            <Grid
              xs={12}
              md={6}
              lg={4}
            >
              <OverviewTraffic
                chartSeries={[patientsAgeTill25, patientsAgeTill45, patientsAgeTillOld]}
                labels={['25-gacha', '45-gacha', 'Katta']}
                sx={{ height: '100%' }}
              />
            </Grid>


          </Grid>
        </Container>
      </Box>
    </div>

  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
