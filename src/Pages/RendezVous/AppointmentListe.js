import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { Link } from 'react-router-dom';
import { deleteButton } from '../components/AlerteModal';
import AppointmentForm from './AppointmentForm';
import {
  useAllAppointment,
  useDeleteAppointment,
} from '../../Api/queriesAppointments';

export default function AppointmentListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: appointmentData, isLoading, error } = useAllAppointment();
  const { mutate: deleteAppointment, isLoading: isDeleting } =
    useDeleteAppointment();
  const [appointmentToUpdate, setAppointmentToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Fixer un rendez-vous');

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Rendez-vous'
            breadcrumbItem='Lists des rendez-vous'
          />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <AppointmentForm
                appointmentToEdit={appointmentToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='appointmentList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setAppointmentToUpdate(null);
                              setFormModalTitle('Fixer un rendez-vous');
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Fixer un rendez-vous
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
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {appointmentData?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun Rendez-vous pour le moment !
                        </div>
                      )}
                      {!error && !isLoading && appointmentData.length > 0 && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='appointmentTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th data-sort='appointmentDate'>
                                Date de rendez-vous
                              </th>
                              <th data-sort='traitement'>Traitement</th>
                              <th data-sort='firstName'>Patient</th>

                              <th data-sort='date'>Date de naissance</th>

                              <th data-sort='adresse'>Domicile</th>
                              <th data-sort='phone'>Téléphone</th>
                              <th data-sort='action'>Action</th>
                            </tr>
                          </thead>
                          {appointmentData?.length > 0 &&
                            appointmentData?.map((appoint) => (
                              <tbody className='list form-check-all text-center'>
                                <tr key={appoint._id}>
                                  <th>
                                    {new Date(
                                      appoint.appointmentDate
                                    ).toLocaleDateString('fr-Fr', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      weekday: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}{' '}
                                  </th>

                                  <td>
                                    {capitalizeWords(
                                      appoint.traitement['motif']
                                    )}
                                  </td>
                                  <td>
                                    {capitalizeWords(
                                      appoint.traitement['patient'].firstName
                                    )}{' '}
                                    {capitalizeWords(
                                      appoint.traitement['patient'].lastName
                                    )}{' '}
                                  </td>

                                  <td>
                                    {new Date(
                                      appoint.traitement['patient'].dateOfBirth
                                    ).toLocaleDateString()}{' '}
                                  </td>

                                  <td>
                                    {capitalizeWords(
                                      appoint.traitement['patient'].adresse
                                    )}{' '}
                                  </td>
                                  <td>
                                    {formatPhoneNumber(
                                      appoint.traitement['patient'].phoneNumber
                                    )}
                                  </td>

                                  <td>
                                    <div className='d-flex gap-2'>
                                      <div className='edit'>
                                        <button
                                          className='btn btn-sm btn-success edit-item-btn'
                                          data-bs-toggle='modal'
                                          data-bs-target='#showModal'
                                          onClick={() => {
                                            setFormModalTitle(
                                              'Modifier les données'
                                            );
                                            setAppointmentToUpdate(appoint);
                                            tog_form_modal();
                                          }}
                                        >
                                          <i className='ri-pencil-fill text-white'></i>
                                        </button>
                                      </div>
                                      {isDeleting && <LoadingSpiner />}
                                      {!isDeleting && (
                                        <div className='remove'>
                                          <button
                                            className='btn btn-sm btn-danger remove-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#deleteRecordModal'
                                            onClick={() => {
                                              deleteButton(
                                                appoint._id,
                                                appoint.traitement['patient']
                                                  .firstName +
                                                  ' ' +
                                                  appoint.traitement['patient']
                                                    .lastName,
                                                deleteAppointment
                                              );
                                            }}
                                          >
                                            <i className='ri-delete-bin-fill text-white'></i>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            ))}
                        </table>
                      )}
                      <div className='noresult' style={{ display: 'none' }}>
                        <div className='text-center'>
                          <lord-icon
                            src='https://cdn.lordicon.com/msoeawqm.json'
                            trigger='loop'
                            colors='primary:#121331,secondary:#08a88a'
                            style={{ width: '75px', height: '75px' }}
                          ></lord-icon>
                          <h5 className='mt-2'>Sorry! No Result Found</h5>
                          <p className='text-muted mb-0'>
                            We've searched more than 150+ Orders We did not find
                            any orders for you search.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='d-flex justify-content-end'>
                      <div className='pagination-wrap hstack gap-2'>
                        <Link
                          className='page-item pagination-prev disabled'
                          to='#'
                        >
                          Previous
                        </Link>
                        <ul className='pagination listjs-pagination mb-0'></ul>
                        <Link className='page-item pagination-next' to='#'>
                          Next
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}
