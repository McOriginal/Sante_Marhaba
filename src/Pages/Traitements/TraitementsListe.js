import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import TraitementForm from './TraitementForm';
import {
  useAllTraitement,
  useDeleteTraitement,
} from '../../Api/queriesTraitement';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords } from '../components/capitalizeFunction';
import img1 from '../../assets/images/t1.jpg';
import img2 from '../../assets/images/t2.jpg';
import img3 from '../../assets/images/t3.jpg';
import img4 from '../../assets/images/t4.jpg';
import { deleteButton } from '../components/AlerteModal';
import { useNavigate } from 'react-router-dom';

export default function TraitementsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: traitements, isLoading, error } = useAllTraitement();
  const { mutate: deleteTraitement } = useDeleteTraitement();
  const [traitementToUpdate, setTraitementToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un patien(e)');
  const images = [img1, img2, img3, img4];
  const randomImage = images[Math.floor(Math.random() * images.length)];

  const navigate = useNavigate();

  const handleNavigateToDetails = (id) => {
    return navigate(`/traitements/details/${id}`);
  };

  const handleNavigateToOrdonnance = (id) => {
    return navigate(`/traitements/ordonnance/${id}`);
  };

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Traitements'
            breadcrumbItem='Lists des traitements'
          />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='lg'
            bodyContent={
              <TraitementForm
                traitementToEdit={traitementToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='traitementList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Ajouter un Traitement
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm'>
                        <div className='d-flex justify-content-sm-end'>
                          <div className='search-box ms-2'>
                            <input
                              type='text'
                              className='form-control search'
                              placeholder='Search...'
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <p className='text-center text-warning'>
                      Pour ajouter un traitement rassurez-vous que le patient
                      est bien enregistré avant
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            {isLoading && <LoadingSpiner />}
            {error && (
              <div className='text-danger text-center'>
                Erreur lors de chargement des données
              </div>
            )}

            {!error &&
              !isLoading &&
              traitements?.length > 0 &&
              traitements?.map((trait) => (
                <Col mg={6} xl={3}>
                  <Card
                    style={{
                      boxShadow: '0px 0px 10px rgba(121,3,105,0.5)',
                      borderRadius: '15px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '5%',
                        right: '5%',
                      }}
                    >
                      <UncontrolledDropdown className='dropdown d-inline-block'>
                        <DropdownToggle
                          className='btn btn-soft-secondary btn-sm'
                          tag='button'
                        >
                          <i className='bx bx-caret-down-square fs-2 text-info'></i>
                        </DropdownToggle>
                        <DropdownMenu className='dropdown-menu-end'>
                          <DropdownItem
                            onClick={() => {
                              handleNavigateToOrdonnance(trait._id);
                            }}
                          >
                            <i className='bx bx-joystick-button align-center me-2 text-info'></i>
                            Ordonnance
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              handleNavigateToDetails(trait._id);
                            }}
                          >
                            <i className='bx bx-show align-center me-2 text-info'></i>
                            Détails
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setFormModalTitle('Modifier les données');
                              setTraitementToUpdate(trait);
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-pencil-fill align-center me-2 text-warning'></i>
                            Modifier
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              deleteButton(
                                trait._id,
                                trait.motif,
                                deleteTraitement
                              );
                            }}
                          >
                            {' '}
                            <i className='ri-delete-bin-fill align-center me-2 text-danger'></i>{' '}
                            Supprimer{' '}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                    <CardImg
                      top
                      className='img-fluid'
                      style={{ borderRadius: '15px 15px 0 0' }}
                      src={randomImage}
                      alt={trait.motif}
                    />
                    <CardBody>
                      <CardTitle className='mt-0'>
                        <span style={{ color: 'gray' }}>Traitement:</span>{' '}
                        {capitalizeWords(trait.motif)}{' '}
                      </CardTitle>
                      <CardText>
                        {trait.patient
                          ? capitalizeWords(trait?.patient['firstName']) +
                            ' ' +
                            capitalizeWords(trait?.patient['lastName'])
                          : '---------'}
                      </CardText>
                      <CardText>
                        {new Date(
                          trait?.patient['dateOfBirth']
                        ).toLocaleDateString()}
                      </CardText>
                    </CardBody>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
