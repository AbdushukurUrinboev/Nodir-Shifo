import React from 'react';
import Head from 'next/head';

import { Container } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"
import Customers from './customers';
import Appointments from './appointments';
import Payments from './payments';



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




const Administration = withAllRouterGuard(() => {

    const [value, setValue] = React.useState(0);
    const [nextStep, setNextStep] = React.useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <>
        
            <Head>
                <title>
                    Administratsiya | Devias Kit
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
                                <Tab label={<span style={{ fontWeight: 'bold' }}>Bemorlar</span>} {...a11yProps(0)} />
                                <Tab label={<span style={{ fontWeight: 'bold' }}>Uchrashuvlar</span>} {...a11yProps(1)} />
                                <Tab label={<span style={{ fontWeight: 'bold' }}>{"To"}&apos;{"lovlar"}</span>} {...a11yProps(2)} />
                            </Tabs>
                        </Box>
                        <CustomTabPanel value={value} index={0}>
                            <Customers nextStep={{nextStep, setNextStep, setValue}}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={1}>
                            <Appointments nextStep={{nextStep, setNextStep, setValue}}/>
                        </CustomTabPanel>
                        <CustomTabPanel value={value} index={2}>
                            <Payments nextStep={{nextStep, setNextStep, setValue}}/>
                        </CustomTabPanel>
                    </Box>

                </Container>
            </Box>
        </>
    );
});

Administration.getLayout = (page) => (
    <DashboardLayout>
        {page}
    </DashboardLayout>
);

export default Administration;
