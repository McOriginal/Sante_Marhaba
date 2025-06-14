import React, { useState } from 'react';
import logolight from '../../assets/images/logo-light.png';
import logodark from '../../assets/images/logo-dark.png';

import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Form,
  Input,
  FormFeedback,
  Label,
} from 'reactstrap';

import { Link, useNavigate } from 'react-router-dom';

// Formik validation
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useLogin } from '../../Api/queriesAuth';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';

const Login = () => {
  document.title = 'Inscription | Santé MARHABA ';

  // Query de Login
  const { mutate: loginUser } = useLogin();
  // State de chargement des données
  const [isLoading, setIsLoading] = useState(false);

  // State de Navigation
  const navigate = useNavigate();

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Veuillez entrer votre Email'),
      password: Yup.string().required('Veuillez entrer votre mot de passe'),
    }),
    onSubmit: (values, { resetForm }) => {
      // Désactiver le bouton de soumission pour éviter les doubles clics
      setIsLoading(true);

      // Appel de la mutation pour se connecter
      loginUser(values, {
        onSuccess: () => {
          setIsLoading(false);

          resetForm();
          // Afficher un message de succès ou une alerte
          successMessageAlert('Connexion réussie !');
          // Redirection vers le tableau de bord
          setTimeout(() => {
            try {
              const authUser = JSON.parse(localStorage.getItem('authUser'));
              const role = authUser?.user?.role;

              if (!role) {
                return errorMessageAlert('Rôle utilisateur introuvable.');
              }

              switch (role) {
                case 'admin':
                  navigate('/dashboard');
                  break;
                case 'medecin':
                  navigate('/dashboard-medecin');
                  break;
                case 'secretaire':
                  navigate('/dashboard-secretaire');
                  break;
                default:
                  errorMessageAlert('Rôle non reconnu.');
              }
            } catch (err) {
              console.error(err);
              errorMessageAlert('Erreur de redirection.');
            }
          }, 2000);
        },
        onError: (error) => {
          setIsLoading(false);
          const errorMessage =
            error?.response?.data?.message ||
            error ||
            'Une erreur est survenue lors de la connexion.';
          console.log(error);
          errorMessageAlert(errorMessage);
        },
      });
    },
  });

  return (
    <React.Fragment>
      <div className='bg-overlay'></div>
      <div className='account-pages my-5 pt-5'>
        <Container>
          <Row className='justify-content-center'>
            <Col lg={6} md={8} xl={4}>
              <Card>
                <CardBody className='p-4'>
                  <div>
                    <div className='text-center'>
                      <Link to='/'>
                        <img
                          src={logodark}
                          alt=''
                          height='24'
                          className='auth-logo logo-dark mx-auto'
                        />
                        <img
                          src={logolight}
                          alt=''
                          height='24'
                          className='auth-logo logo-light mx-auto'
                        />
                      </Link>
                    </div>
                    <h4 className='font-size-18 text-muted mt-2 text-center'>
                      Bienvenue !
                    </h4>
                    <p className='mb-5 text-center'>
                      Entrez vos coordonnées pour vous connecter à votre compte.
                    </p>
                    <Form
                      className='form-horizontal'
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <Row>
                        <Col md={12}>
                          <div className='mb-4'>
                            <Label className='form-label'>Email</Label>
                            <Input
                              name='email'
                              className='form-control'
                              placeholder='Enter email'
                              type='email'
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ''}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <FormFeedback type='invalid'>
                                <div>{validation.errors.email}</div>
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className='mb-4'>
                            <Label className='form-label'>Mot de passe</Label>
                            <Input
                              name='password'
                              value={validation.values.password || ''}
                              type='password'
                              placeholder='Enter Password'
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type='invalid'>
                                <div> {validation.errors.password} </div>
                              </FormFeedback>
                            ) : null}
                          </div>

                          <Row>
                            <Col className='col-7'>
                              <div className='text-md-end mt-3 mt-md-0'>
                                <Link
                                  to='/auth-recoverpw'
                                  className='text-muted'
                                >
                                  <i className='mdi mdi-lock'></i> Forgot your
                                  password?
                                </Link>
                              </div>
                            </Col>
                          </Row>
                          <div className='d-grid mt-4'>
                            {isLoading ? (
                              <LoadingSpiner />
                            ) : (
                              <button
                                className='btn btn-primary waves-effect waves-light'
                                type='submit'
                              >
                                Se Connecter
                              </button>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className='mt-5 text-center'>
                <p className='text-white-50'>
                  Vous n'avez pas de compte ?{' '}
                  <Link to='/register' className='fw-medium text-primary'>
                    {' '}
                    S'inscrire{' '}
                  </Link>{' '}
                </p>
                <p className='text-white-50'>
                  © {new Date().getFullYear()} Inscription | Santé MARHABA.{' '}
                  <i className='mdi mdi-heart text-danger'></i> Créé Par{' '}
                  <Link to={'https://www.cissemohamed.com'} target='blank'>
                    Cisse Mohamed
                  </Link>
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Login;
