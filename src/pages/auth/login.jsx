import { useCallback, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFormik } from 'formik';
import axios from 'axios';
import { base_URL } from 'src/API';
import { Logo } from 'src/components/logo';

import * as Yup from 'yup';
import {
  Alert,
  Box,
  Button,
  FormHelperText,
  Link,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import { Layout as AuthLayout } from 'src/layouts/auth/layout';

const Page = () => {
  const searchParams = useSearchParams();
  const isDoctor = searchParams.get('doctors');
  const router = useRouter();
  const auth = useAuth();
  const [method, setMethod] = useState('userName');
  const formik = useFormik({
    initialValues: {
      userName: 'Login',
      password: 'Parol',
      submit: null
    },
    validationSchema: Yup.object({
      userName: Yup
        .string()
        // .email('Error login')
        .max(255)
        .required('Loginni kiriting'),
      password: Yup
        .string()
        .max(255)
        .required('Parolni kiriting')
    }),
    onSubmit: async (values, helpers) => {
      try {  
        const userRole = await auth.signIn(values.userName, values.password, isDoctor === "true" ? true : false);
        if(userRole === 'navbat') {
          router.push('/navbat');

        } else if (isDoctor === "true") {
          router.push('/doctorsPage');
        } else {
          router.push('/');
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    }
  });

  const handleMethodChange = useCallback(
    (event, value) => {
      setMethod(value);
    },
    []
  );

  // const handleSkip = useCallback(
  //   () => {
  //     auth.skip();
  //     router.push('/');
  //   },
  //   [auth, router]
  // );

  return (
    <>
      <Head>
        <title>
          Login | Nodir-Shifo
        </title>
      </Head>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          flex: '1 1 auto',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Box
          sx={{
            maxWidth: 550,
            px: 3,
            py: '100px',
            width: '100%'
          }}
        >
          <div>
            <Stack
              spacing={1}
              sx={{ mb: 3, alignItems: 'center' }}
            >
                <Logo />
              <Typography variant="h4">
                {/* Login- */}
              </Typography>
            </Stack>
            <Tabs
              onChange={handleMethodChange}
              sx={{ mb: 3 }}
              value={method}
            >
              <Tab
                label="Login"
                value="userName"
              />
            </Tabs>
            {method === 'userName' && (
              <form
                noValidate
                onSubmit={formik.handleSubmit}
              >
                <Stack spacing={3}>
                  <TextField
                    error={!!(formik.touched.userName && formik.errors.userName)}
                    fullWidth
                    helperText={formik.touched.userName && formik.errors.userName}
                    label="Loginni kiriting"
                    name="userName"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="text"
                    value={formik.values.userName}
                  />
                  <TextField
                    error={!!(formik.touched.password && formik.errors.password)}
                    fullWidth
                    helperText={formik.touched.password && formik.errors.password}
                    label="Password"
                    name="password"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    type="password"
                    value={formik.values.password}
                  />
                </Stack>
                {/* <FormHelperText sx={{ mt: 1 }}>
                  Optionally you can skip.
                </FormHelperText> */}
                {formik.errors.submit && (
                  <Typography
                    color="error"
                    sx={{ mt: 3 }}
                    variant="body2"
                  >
                    {formik.errors.submit}
                  </Typography>
                )}
                <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  type="submit"
                  variant="contained"
                >
                  Tizimga kirish
                </Button>
                {/* <Button
                  fullWidth
                  size="large"
                  sx={{ mt: 3 }}
                  onClick={handleSkip}
                >
                  Skip authentication
                </Button> */}
                <Alert
                  color="primary"
                  severity="info"
                  sx={{ mt: 3 }}
                >
                  <div>
                    Tizimga kirish uchun Sizga berilgan <b>Login</b> va <b>Parolni</b> kiriting
                  </div>
                </Alert>
              </form>
            )}
            {/* {method === 'phoneNumber' && (
              <div>
                <Typography
                  sx={{ mb: 1 }}
                  variant="h6"
                >
                  Not available in the demo
                </Typography>
                <Typography color="text.secondary">
                  To prevent unnecessary costs we disabled this feature in the demo.
                </Typography>
              </div>
            )} */}
          </div>
        </Box>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <AuthLayout>
    {page}
  </AuthLayout>
);

export default Page;
