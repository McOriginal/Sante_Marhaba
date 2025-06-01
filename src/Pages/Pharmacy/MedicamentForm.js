import {
  Button,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import { Link } from 'react-router-dom';
import {
  useCreateMedicament,
  useUpdateMedicament,
} from '../../Api/queriesMedicament';
import { useAllFournisseur } from '../../Api/queriesFournisseur';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';

const MedicamentForm = ({ medicamentToEdit, tog_form_modal }) => {
  // Matériels Query pour créer la Medicament
  const { mutate: createMedicament } = useCreateMedicament();
  // Matériels Query pour Mettre à jour la Medicament
  const { mutate: updateMedicament } = useUpdateMedicament();
  const {
    data: fournisseurData,
    isLoading: fourniLoading,
    error: fourniError,
  } = useAllFournisseur();
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: medicamentToEdit?.name || '',
      stock: medicamentToEdit?.stock || undefined,
      price: medicamentToEdit?.price || undefined,
      deliveryDate: medicamentToEdit?.deliveryDate?.substring(0, 10) || '',
      imageUrl: medicamentToEdit?.imageUrl || '',
      fournisseur: medicamentToEdit?.fournisseur._id || '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Veillez Entrez une valeur correct !')
        .required('Ce champ est obligatoire'),

      stock: Yup.number().required('Ce champ est obligatoire'),
      price: Yup.number().required('Ce champ est obligatoire'),
      deliveryDate: Yup.date().required('Ce champ est obligatoire'),
      fournisseur: Yup.string().required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setIsLoading(true);

      // Si la méthode est pour mise à jour alors
      const medicamentDataLoaded = {
        ...values,
      };
      if (isLoading) {
        setTimeout(() => {
          errorMessageAlert('Une Erreur est survenue veillez réesayer !');
          setIsLoading(false);
        }, 10000);
      }

      if (medicamentToEdit) {
        updateMedicament(
          { id: medicamentToEdit._id, data: medicamentDataLoaded },
          {
            onSuccess: () => {
              successMessageAlert('Données mise à jour avec succès');
              setIsLoading(false);
              tog_form_modal();
            },
            onError: (err) => {
              errorMessageAlert(
                err?.response?.data?.message ||
                  err?.message ||
                  'Erreur lors de la mise à jour'
              );
              setIsLoading(false);
            },
          }
        );
      }

      // Sinon on créer un nouveau étudiant
      else {
        createMedicament(values, {
          onSuccess: () => {
            successMessageAlert('Médicament ajoutée avec succès');
            setIsLoading(false);
            resetForm();
            tog_form_modal();
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! une erreur est survenu lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setIsLoading(false);
          },
        });
      }
    },
  });
  return (
    <Form
      className='needs-validation'
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}
    >
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='name'>Nom</Label>
            <Input
              name='name'
              placeholder="Chambre d'opération; Chambre de Serum..."
              type='text'
              className='form-control'
              id='name'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.name || ''}
              invalid={
                validation.touched.name && validation.errors.name ? true : false
              }
            />
            {validation.touched.name && validation.errors.name ? (
              <FormFeedback type='invalid'>
                {validation.errors.name}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col sm='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='stock'>Stock</Label>
            <Input
              name='stock'
              placeholder='10; 4; 0'
              type='number'
              className='form-control'
              id='stock'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.stock || ''}
              invalid={
                validation.touched.stock && validation.errors.stock
                  ? true
                  : false
              }
            />
            {validation.touched.stock && validation.errors.stock ? (
              <FormFeedback type='invalid'>
                {validation.errors.stock}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col sm='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='price'>Prix</Label>
            <Input
              name='price'
              placeholder='Entrez les prix de médicament'
              type='number'
              className='form-control'
              id='price'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.price || ''}
              invalid={
                validation.touched.price && validation.errors.price
                  ? true
                  : false
              }
            />
            {validation.touched.price && validation.errors.price ? (
              <FormFeedback type='invalid'>
                {validation.errors.price}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='deliveryDate'>Date d'arrivée</Label>
            <Input
              name='deliveryDate'
              placeholder='Chambre dédié pour les opérations chirugical.....'
              type='date'
              className='form-control'
              id='deliveryDate'
              max={new Date().toISOString().split('T')[0]} // Limite à aujourd'hui
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.deliveryDate || ''}
              invalid={
                validation.touched.deliveryDate &&
                validation.errors.deliveryDate
                  ? true
                  : false
              }
            />
            {validation.touched.deliveryDate &&
            validation.errors.deliveryDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.deliveryDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup>
            <Label htmlFor='fournisseur'>Fournisseur</Label>
            <Input
              type='select'
              name='fournisseur'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.fournisseur || ''}
              invalid={
                validation.touched.fournisseur && validation.errors.fournisseur
                  ? true
                  : false
              }
            >
              {fourniLoading && <LoadingSpiner />}
              {fourniError && (
                <div className='fw-bold text-danger text-center'></div>
              )}
              <option value=''>Sélectionner un fourni</option>
              {!fourniError &&
                !fourniLoading &&
                fournisseurData?.length > 0 &&
                fournisseurData.map((four) => (
                  <option key={four._id} value={four._id}>
                    {capitalizeWords(four.firstName)}{' '}
                    {capitalizeWords(four.lastName)}{' '}
                    {formatPhoneNumber(four.phoneNumber)}
                  </option>
                ))}
            </Input>
            {validation.touched.fournisseur && validation.errors.fournisseur ? (
              <FormFeedback type='invalid'>
                {validation.errors.fournisseur}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='imageUrl'>Image de Couverture</Label>
            <Input
              name='imageUrl'
              placeholder='Veillez copiez une image en ligne.....'
              type='text'
              className='form-control'
              id='imageUrl'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.imageUrl || ''}
              invalid={
                validation.touched.imageUrl && validation.errors.imageUrl
                  ? true
                  : false
              }
            />
            <Link
              to={`https://www.google.com/search?sca_esv=36ac96dba69ebed1&sxsrf=AE3TifPFX9Ag6g7OHGRvbMuvmwEvx86_AA:1748385419157&q=${
                validation.values.name || 'médicament pharmacy'
              }&udm=2&fbs=AIIjpHx4nJjfGojPVHhEACUHPiMQ_pbg5bWizQs3A_kIenjtcpTTqBUdyVgzq0c3_k8z34GAwf0jHaPgz38H1UrFi4JZ_wsbaZy5bcislJwEjK9aKAAgw7EDHBpnhJERxbAHVFJEPpsPJRN2Lf5NIxh4Y6E23jLfuJM1k2vNHWwZgjeinct1k1SwMNRPIUfhAwFDaWeIbf0gNPayotFQo8sw3bnjAaBRZQ&sa=X&ved=2ahUKEwj6otue28SNAxWJKvsDHURDCkcQtKgLegQIFRAB&biw=1280&bih=585&dpr=1.5`}
              target='blank'
              style={{
                color: 'blue',
                textAlign: 'center',
                display: 'block',
              }}
            >
              cliquer ici pour copier une image en ligne
            </Link>
          </FormGroup>
        </Col>
      </Row>

      <div className='d-grid text-center mt-4'>
        {isLoading && <LoadingSpiner />}
        {!isLoading && (
          <Button color='success' type='submit'>
            Enregisrer
          </Button>
        )}
      </div>
    </Form>
  );
};

export default MedicamentForm;
