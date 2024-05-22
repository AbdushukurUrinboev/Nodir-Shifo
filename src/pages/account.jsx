import Head from 'next/head';
import { Box, Container, Stack, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { AccountProfile } from 'src/sections/account/account-profile';
import { AccountProfileDetails } from 'src/sections/account/account-profile-details';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { PATIENTS_URL } from 'src/API';
import axios from 'axios';



const Page = () => {
  const [patient, setPatient] = useState({treatmentHistory: []});

  const router = useRouter();
  const { id } = router.query;


  useEffect(() => {
    axios.get(PATIENTS_URL, { withCredentials: true })
      .then(res => {        
        const foundPatient = res.data.find(item => item._id === id);
        setPatient(foundPatient);

      })
      .catch(err => console.log(err))
  }, []);




  return (
    <>
      <Head>
        <title>
          Bemor haqida | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3}>
            
            <div>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                >
                  <AccountProfile patient = {patient}/>
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >
                  <AccountProfileDetails patient = {patient}/>
                </Grid>
              </Grid>
            </div>
          </Stack>
        </Container>
      </Box>
    </>
  )
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
