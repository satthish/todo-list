import * as React from 'react';
import { Avatar, Button, CssBaseline, TextField, Box, Typography, Container, Card, CardContent, Grid, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../redux/authSlice';

// Validation schema with Yup
const validationSchema = Yup.object({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (values: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const inputData = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password
      };
      await axios.post(`${baseUrl}/auth/register`, inputData);
      alert('Registered successfully');
      const response = await axios.post(`${baseUrl}/auth/login`, inputData);
      dispatch(setCredentials({ token: response.data.token, user: values.firstName }));
      router.push('/todo'); // Redirect to the Todos page after login
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Card sx={{ width: '100%', mt: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign Up
              </Typography>
              <Formik
                initialValues={{ firstName: '', lastName: '', email: '', password: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {() => (
                  <Form>
                    <Box
                      sx={{
                        mt: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Field
                        as={TextField}
                        name="firstName"
                        label="First Name"
                        fullWidth
                        required
                        variant="outlined"
                        error={Boolean(<ErrorMessage name="firstName" />)}
                        helperText={<ErrorMessage name="firstName" />}
                      />
                      <Field
                        as={TextField}
                        name="lastName"
                        label="Last Name"
                        fullWidth
                        required
                        variant="outlined"
                        error={Boolean(<ErrorMessage name="lastName" />)}
                        helperText={<ErrorMessage name="lastName" />}
                      />
                      <Field
                        as={TextField}
                        name="email"
                        label="Email Address"
                        fullWidth
                        required
                        type="email"
                        variant="outlined"
                        error={Boolean(<ErrorMessage name="email" />)}
                        helperText={<ErrorMessage name="email" />}
                      />
                      <Field
                        as={TextField}
                        name="password"
                        label="Password"
                        fullWidth
                        required
                        type="password"
                        variant="outlined"
                        error={Boolean(<ErrorMessage name="password" />)}
                        helperText={<ErrorMessage name="password" />}
                      />
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                      >
                        Sign Up
                      </Button>
                      <Grid container justifyContent="flex-end">
                        <Grid item>
                          <Link href="/login" variant="body2">
                            Already have an account? Sign in
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                  </Form>
                )}
              </Formik>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Register;
