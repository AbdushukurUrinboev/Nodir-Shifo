import { useEffect, useState } from 'react';
import Head from 'next/head';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CompanyCard } from 'src/sections/companies/company-card';
import AddCompany from 'src/sections/companies/add-company';
import axios from 'axios';
import { DEPARTMENTS_URL } from 'src/API';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"



const Page = withAllRouterGuard (() => {
  const [departmentName, setDepartmentName] = useState([]);

// console.log("departmentName = " + departmentName);
  useEffect(() => {
    axios.get(DEPARTMENTS_URL, {withCredentials: true})
      .then(res => {
        setDepartmentName(res.data);       
      })
      .catch(err => console.log(err))
  }, []);

  return (
    <>
      <Head>
        <title>       
          {"Bo"}&apos; {"limlar | Devias Kit"}          
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
                {"Bo"}&apos; {"limlar"}
                </Typography>

              </Stack>
              <div>
                <AddCompany setNewCompVal={setDepartmentName}/>
              </div>
            </Stack>
           
            <Grid
              container
              spacing={3}
            >
              {departmentName.map((company) => (
                <Grid
                  xs={12}
                  md={6}
                  lg={4}
                  key={company._id}
                >
                  <CompanyCard company={company} />
                </Grid>
              ))}
            </Grid>
            
          </Stack>
        </Container>
      </Box>
    </>
  )
});

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
