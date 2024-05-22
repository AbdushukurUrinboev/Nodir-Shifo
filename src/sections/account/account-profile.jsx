import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography
} from '@mui/material';
import { useRouter } from 'next/router';
import PatientInfoAdd from 'src/sections/account/patientInfo-add';

const user = {
  avatarMale: '/assets/avatars/avatar-fran-perez.png',
  avatarFemale: '/assets/avatars/avatar-neha-punita.png',
};

export const AccountProfile = (props) => {
  const { patient } = props;
  const router = useRouter();


  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src={patient.gender === "male" ? user.avatarMale : user.avatarFemale}
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {patient.lastName} {patient.firstName}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {patient.region}, {patient.district}, <br /> {patient.address}
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {patient.age} yosh
          </Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            {patient.phoneNumber}
          </Typography>
        </Box>
      </CardContent>
      <Divider />

      <div style={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <PatientInfoAdd patient={patient} />
        <Button
          fullWidth
          variant="contained"
          style={{ backgroundColor: 'green', color: 'white', marginTop: "5px" }}
          onClick={() => router.push('/doctorsPage')}
        >
          Orqaga
        </Button>
      </div>


    </Card>
  )
};
