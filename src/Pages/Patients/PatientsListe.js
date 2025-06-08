import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import { useAllPatients, useDeletePatient } from '../../Api/queriesPatient';
import PatientForm from './PatientForm';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { Link } from 'react-router-dom';
import { deleteButton } from '../components/AlerteModal';

export default function PatientsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data, isLoading, error } = useAllPatients();
  const { mutate: deletePatient, isLoading: isDeleting } = useDeletePatient();
  const [patientToUpdate, setpatientToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un patien(e)');

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Patients' breadcrumbItem='Lists des patients' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <PatientForm
                patientToEdit={patientToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='customerList'>
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
                            Ajouter un(e) Patient(e)
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
                      {data?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun patient pour le moment !
                        </div>
                      )}
                      {!error && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='customerTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th scope='col' style={{ width: '50px' }}>
                                ID
                              </th>
                              <th className='sort' data-sort='customer_name'>
                                Nom
                              </th>
                              <th className='sort' data-sort='email'>
                                Prénom
                              </th>
                              <th className='sort' data-sort='groupeSanguin'>
                                Groupe Sanguin
                              </th>
                              <th className='sort' data-sort='date'>
                                Date de naissance
                              </th>

                              <th className='sort' data-sort='adresse'>
                                Domicile
                              </th>
                              <th className='sort' data-sort='phone'>
                                Téléphone
                              </th>
                              <th className='sort' data-sort='action'>
                                Action
                              </th>
                            </tr>
                          </thead>
                          {data?.length > 0 &&
                            data?.map((patient) => (
                              <tbody className='list form-check-all text-center'>
                                <tr key={patient._id}>
                                  <th scope='row'></th>
                                  <td
                                    className='id'
                                    style={{ display: 'none' }}
                                  ></td>
                                  <td>{capitalizeWords(patient.firstName)} </td>
                                  <td>{capitalizeWords(patient.lastName)} </td>
                                  <td className='badge bg-warning text-light'>
                                    {capitalizeWords(patient.groupeSanguin)}{' '}
                                  </td>

                                  <td className='date'>
                                    {new Date(
                                      patient.dateOfBirth
                                    ).toLocaleDateString()}{' '}
                                  </td>

                                  <td className='adresse'>
                                    {capitalizeWords(patient.adresse)}{' '}
                                  </td>
                                  <td className='phone'>
                                    {formatPhoneNumber(patient.phoneNumber)}
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
                                            setpatientToUpdate(patient);
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
                                                patient._id,
                                                patient.firstName +
                                                  ' ' +
                                                  patient.lastName,
                                                deletePatient
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
