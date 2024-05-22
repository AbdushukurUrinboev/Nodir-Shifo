import PropTypes from 'prop-types';
import NextLink from 'next/link';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';
import { padding } from '@mui/system';



export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      <Grid
        container
        sx={{ 
          flex: '1 1 auto'
        }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >

          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}          
          sx={{
            alignItems: 'center',            
            color: 'white',
            justifyContent: 'center',
            position: 'relative',
            '& img': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ 
            p: 0            
            }}>
            <Typography
              align="center"
              color="inherit"              
              sx={{
                fontSize: '120px',
                lineHeight: '99px',
                mb: 1,
                position: 'absolute', 
                top: '38%', 
                left: '62%',
                transform: 'translate(-50%, -50%)', 
                zIndex: 1,
                paddingBottom: '0px'
              }}
              variant="h1"
            >
              Welcome             
            </Typography>
            <Typography
              align="center"
              sx={{ 
                mb: 3,
                fontSize: '30px',
                lineHeight: '37px', 
                textAlign: "right",
                whiteSpace: 'nowrap',
                position: 'absolute', 
                top: '50%', 
                left: '75%',
                transform: 'translate(-50%, -50%)', 
                zIndex: 1 
                
              }}
              variant="subtitle1"
              
            >
              Tizimga kirish uchun <br/> Login kiriting
            </Typography>
            <img
              alt=""
              src="/assets/loginImg.png"
              style={{ 
                width: '100%',
                zIndex: 0,
                paddingBottom: '0px' 
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};