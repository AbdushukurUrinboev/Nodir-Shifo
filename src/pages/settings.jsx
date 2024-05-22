import React from 'react';
import Head from 'next/head';

import { Container } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
// import AddUsers from 'src/sections/userRoles/AddUsers';
import Appointments from './appointments';
import Payments from './payments';
import AddUsers from './AddUsers';
import PageShartnomalar from './Shartnomalar';
import PageStaff from './Staff';
import PageProfit from './Profit';
import PageDebts from './Debt';
import PageKasallarRuyhati from './KasallarRuyhati';
import PageExpenses from './Expenses';
import PageFoyda from './Foyda';
import { withAllRouterGuard } from './../hocs/with-auth-guard';



function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}




const Setting = withAllRouterGuard(() => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <>
      <Head>
        <title>
          Xisobot | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                <Tab label={<span style={{ fontWeight: 'bold' }}>Shartnomalar</span>} {...a11yProps(0)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>Xodimlar</span>} {...a11yProps(1)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>Qarzdorlik</span>} {...a11yProps(2)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>{"Kasallar ro"}&apos;{"xati"}</span>} {...a11yProps(3)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>Tushum</span>} {...a11yProps(4)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>Chiqim</span>} {...a11yProps(5)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>Foyda</span>} {...a11yProps(6)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>{"Foydalanuvchi qo"}&apos;{"shish"}</span>} {...a11yProps(7)} />
                <Tab label={<span style={{ fontWeight: 'bold' }}>Arxiv</span>} {...a11yProps(8)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>            
              <PageShartnomalar />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>            
              <PageStaff />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
              <PageDebts />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={3}>
              <PageKasallarRuyhati />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={4}>
              <PageProfit />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={5}>
             <PageExpenses/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={6}>
              <PageFoyda/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={7}>
              {/* <h1>Tez kunda</h1> */}
              <AddUsers />
            </CustomTabPanel>
            <CustomTabPanel value={value} index={8}>
              <h1>Tez kunda</h1>
              {/* <AddUsers /> */}
            </CustomTabPanel>
          </Box>

        </Container>
      </Box>
    </>
  );
});

Setting.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Setting;
