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
import { useEffect, useState } from 'react';
import {
  errorMessageAlert,
  successMessageAlert,
} from '../components/AlerteModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  useCreatePaiement,
  useUpdatePaiement,
} from '../../Api/queriesPaiement';
import { capitalizeWords } from '../components/capitalizeFunction';
import { useAllTraitement } from '../../Api/queriesTraitement';

const PaiementForm = ({ paiementToEdit, tog_form_modal }) => {
  // Paiement Query pour créer la Paiement
  const { mutate: createPaiement } = useCreatePaiement();
  // Paiement Query pour Mettre à jour la Paiement
  const { mutate: updatePaiement } = useUpdatePaiement();

  // Query pour affiche toutes les traitementData
  const {
    data: traitementData,
    isLoading: isFetchingTraitement,
    error,
  } = useAllTraitement();

  // State pour gérer le chargement
  const [isLoading, setisLoading] = useState(false);

  // Form validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      traitement: paiementToEdit?.traitement._id || '',
      motifPaiement: paiementToEdit?.motifPaiement || '',
      paiementDate: paiementToEdit?.paiementDate.substring(0, 16) || '',
      totalAmount: paiementToEdit?.totalAmount || undefined,
      methode: paiementToEdit?.methode || '',
      statut: paiementToEdit?.statut || '',
    },
    validationSchema: Yup.object({
      traitement: Yup.string().required('Ce champ est obligatoire'),
      motifPaiement: Yup.string().required('Ce champ est obligatoire'),
      paiementDate: Yup.date().required('Ce champ est obligatoire'),
      totalAmount: Yup.number().required('Ce champ est obligatoire'),
      methode: Yup.string().required('Ce champ est obligatoire'),
      statut: Yup.string().required('Ce champ est obligatoire'),
    }),

    onSubmit: (values, { resetForm }) => {
      setisLoading(true);

      // Si la méthode est pour mise à jour alors
      const paiementsDataLoaded = {
        ...values,
      };

      if (paiementToEdit) {
        updatePaiement(
          { id: paiementToEdit._id, data: paiementsDataLoaded },
          {
            onSuccess: () => {
              successMessageAlert('Données mise à jour avec succès');
              setisLoading(false);
              tog_form_modal();
            },
            onError: (err) => {
              errorMessageAlert(
                err?.response?.data?.message ||
                  err?.message ||
                  'Erreur lors de la mise à jour'
              );
              setisLoading(false);
            },
          }
        );
      }

      // Sinon on créer un nouveau étudiant
      else {
        createPaiement(values, {
          onSuccess: () => {
            successMessageAlert('Paiement ajoutée avec succès');
            setisLoading(false);
            resetForm();
            tog_form_modal();
          },
          onError: (err) => {
            const errorMessage =
              err?.response?.data?.message ||
              err?.message ||
              "Oh Oh ! une erreur est survenu lors de l'enregistrement";
            errorMessageAlert(errorMessage);
            setisLoading(false);
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
            <Label htmlFor='traitement'>Traitement et Ordonnance</Label>

            <Input
              name='traitement'
              type='select'
              className='form-control'
              id='traitement'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.traitement || ''}
              invalid={
                validation.touched.traitement && validation.errors.traitement
                  ? true
                  : false
              }
            >
              {error && (
                <p className='text-getRectCenter text-danger'>
                  Erreur de chargement veillez acctualiser la page{' '}
                </p>
              )}
              {!error && isFetchingTraitement && <LoadingSpiner />}
              <option value=''>Sélectionner le traitement</option>
              {!error &&
                !isFetchingTraitement &&
                traitementData.map((trait) => (
                  <option key={trait._id} value={trait._id}>
                    {capitalizeWords(trait.patient['firstName'])}{' '}
                    {capitalizeWords(trait.patient['lastName'])}
                    {' | '}
                    {capitalizeWords(trait.motif)}
                    {' | '}{' '}
                    {new Date(trait.createdAt).toLocaleDateString('fr-Fr', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </option>
                ))}
            </Input>
            {validation.touched.traitement && validation.errors.traitement ? (
              <FormFeedback type='invalid'>
                {validation.errors.traitement}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col md='12'>
          <FormGroup className='mb-3'>
            <Label htmlFor='motifPaiement'>Motif de Paiement</Label>

            <Input
              name='motifPaiement'
              type='select'
              className='form-control'
              id='motifPaiement'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.motifPaiement || ''}
              invalid={
                validation.touched.motifPaiement &&
                validation.errors.motifPaiement
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner le motif de paiement</option>
              <option value='traitement'>Traitement</option>
              <option value='ordonnance'>Ordonnance</option>
              <option value='consultation'>Consultation</option>
            </Input>
            {validation.touched.motifPaiement &&
            validation.errors.motifPaiement ? (
              <FormFeedback type='invalid'>
                {validation.errors.motifPaiement}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='totalAmount'>Somme Total</Label>
            <p style={{ fontSize: '12px' }}>
              Il s'agit de la somme total de Traitement + l'Ordonnance
            </p>
            <Input
              name='totalAmount'
              type='number'
              className='form-control'
              id='totalAmount'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.totalAmount || ''}
              invalid={
                validation.touched.totalAmount && validation.errors.totalAmount
                  ? true
                  : false
              }
            />
            {validation.touched.totalAmount && validation.errors.totalAmount ? (
              <FormFeedback type='invalid'>
                {validation.errors.totalAmount}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='paiementDate'>Date de Paiement</Label>

            <Input
              name='paiementDate'
              type='date'
              className='form-control'
              id='paiementDate'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.paiementDate || ''}
              invalid={
                validation.touched.paiementDate &&
                validation.errors.paiementDate
                  ? true
                  : false
              }
            />
            {validation.touched.paiementDate &&
            validation.errors.paiementDate ? (
              <FormFeedback type='invalid'>
                {validation.errors.paiementDate}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
      </Row>
      <Row>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='methode'>Méthode de Paiement</Label>
            <Input
              name='methode'
              type='select'
              className='form-control'
              id='methode'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.methode || ''}
              invalid={
                validation.touched.methode && validation.errors.methode
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner la méthode de paiement</option>
              <option value='cash'>En Espèce</option>
              <option value='orange money'>Orange Money</option>
              <option value='moove money'>Moove Money</option>
            </Input>
            {validation.touched.methode && validation.errors.methode ? (
              <FormFeedback type='invalid'>
                {validation.errors.methode}
              </FormFeedback>
            ) : null}
          </FormGroup>
        </Col>
        <Col md='6'>
          <FormGroup className='mb-3'>
            <Label htmlFor='statut'>Méthode de Paiement</Label>
            <Input
              name='statut'
              placeholder='Paiement dédié pour les opérations chirugical.....'
              type='select'
              className='form-control'
              id='statut'
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.statut || ''}
              invalid={
                validation.touched.statut && validation.errors.statut
                  ? true
                  : false
              }
            >
              <option value=''>Sélectionner le statut</option>
              <option value='payé'>Payé</option>
              <option value='partiel'>Partiellement payé</option>
              <option value='non payé'>Non Payé</option>
            </Input>
            {validation.touched.statut && validation.errors.statut ? (
              <FormFeedback type='invalid'>
                {validation.errors.statut}
              </FormFeedback>
            ) : null}
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

export default PaiementForm;
