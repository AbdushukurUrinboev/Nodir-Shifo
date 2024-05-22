import React from 'react';
import Head from 'next/head';
import { Grid, TextField, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import DialogActions from '@mui/material/DialogActions';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { USERS_URL } from 'src/API';
import axios from 'axios';
import { withAllRouterGuard } from "./../hocs/with-auth-guard"






const AddUsers = withAllRouterGuard(() => {

  const [nickName, setNickName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [role, setRole] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [firstName, setFirstName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');

  const [errorPhoneNumber, setErrorPhoneNumber] = React.useState('');
  const [errorNickName, setErrorNickName] = React.useState('');
  const [errorPassword, setErrorPassword] = React.useState('');
  const [errorLastName, setErrorLastName] = React.useState('');
  const [errorFirstName, setErrorFirstName] = React.useState('');
  const [showPass, setShowPass] = React.useState(false);

  const handleClose = () => {
    setLastName('')
    setFirstName('')
    setNickName('')
    setPassword('')
    setRole('')
  };


  const handleButtonClick = (event) => {
    event.preventDefault();

    if (lastName === '') {
      setErrorLastName('Familiyani kiriting...');
      return;
    }
    if (firstName === '') {
      setErrorFirstName('Ismni kiriting...');
      return;
    }
    if (nickName === '') {
      setErrorNickName('Loginni kiriting...');
      return;
    }
    if (password === '') {
      setErrorPassword('Parolni kiriting...');
      return;
    }
    if (phoneNumber.length < 12) {
      setErrorPhoneNumber('Telefonni kiriting...');
      return;
    }

    if (nickName !== '' && password !== '' && role !== '' && lastName !== '' && firstName !== '') {
      console.log(lastName, firstName, phoneNumber, nickName, password, role);

     
      axios.post(USERS_URL, {
        fullName: lastName + " " + firstName,
        phoneNumber: phoneNumber,  
        login: nickName,
        password: password,
        role: role
      }, { withCredentials: true })
        .then(res => {
          console.log("Data is saved", res);          
          setLastName('')
          setFirstName('')
          setPhoneNumber('')
          setNickName('')
          setPassword('')
          setRole(null)
          setOpen(false);
        })
        .catch(err => console.log(err))


    }


  }

  return (
    <>
      <Head>
        <title>
          {"Foydalanuvchi qo"}&apos;{"shish"} | Devias Kit
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 0
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '50px' }}>
              <TextField
                sx={{ width: "50%" }}
                label="Familiya"
                id="outlined-controlled-nickName"
                type='text'
                value={lastName}
                helpertext={<span style={{ color: "red" }}>{errorLastName}</span>}
                onChange={(event) => {
                  setLastName(event.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '50px' }}>
              <TextField
                sx={{ width: "50%" }}
                label="Ism"
                id="outlined-controlled-nickName"
                type='text'
                value={firstName}
                helpertext={<span style={{ color: "red" }}>{errorFirstName}</span>}
                onChange={(event) => {
                  setFirstName(event.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '50px' }}>
              <PhoneInput
                sx={{ width: "50%" }}
                inputStyle={{ height: "58px", border: "0px" }}
                className="react-international-phone-country-selector-button"
                style={{ '--react-international-phone-height': '60px', width: '50%', justifyContent: 'left', cursor: 'none' }}
                defaultCountry="uz"
                value={phoneNumber}
                helpertext={<span style={{ color: "red" }}>{errorPhoneNumber}</span>}
                onChange={(phone) => setPhoneNumber(phone)}
              />
            </Grid>


            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '50px' }}>
              <TextField
                sx={{ width: "50%" }}
                label="Login"
                id="outlined-controlled-nickName"
                type='text'
                value={nickName}
                helpertext={<span style={{ color: "red" }}>{errorNickName}</span>}
                onChange={(event) => {
                  setNickName(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '10px' }}>
              <TextField
                sx={{ width: "50%" }}
                label="Parol"
                id="outlined-controlled-showPass"
                type={showPass ? 'text' : 'password'}
                value={password}
                helpertext={<span style={{ color: "red" }}>{errorPassword}</span>}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '1px' }}>
              <FormControlLabel
                sx={{ width: '50%', marginTop: '1px' }}
                control={<Checkbox
                  onChange={() => setShowPass(!showPass)}
                />}
                label="Ko'rsatish"

              />
            </Grid>
            <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", marginTop: '15px' }}>
              <FormControl sx={{ width: '50%' }}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  label="Role"
                  id="outlined-controlled"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="manager">Menejer</MenuItem>
                  <MenuItem value="navbat">Navbat</MenuItem>
                  <MenuItem value="developer">Dev</MenuItem>
                  {/* <MenuItem value="developer">developer</MenuItem> */}
                </Select>
              </FormControl>

            </Grid>



          </Stack>
          <DialogActions>
            <Button variant='outlined' onClick={handleClose}>Bekor qilish</Button>
            <Button
              variant='contained'
              onClick={handleButtonClick}>
              {"Qo"}&apos;{"shish"}
            </Button>
          </DialogActions>
        </Container>
      </Box>
    </>
  );
});

AddUsers.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default AddUsers;
