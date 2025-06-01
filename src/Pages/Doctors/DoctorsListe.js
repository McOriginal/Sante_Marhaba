import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import DoctorForm from './DoctorForm';
import { Link } from 'react-router-dom';
import { useAllDoctors, useDeleteDoctor } from '../../Api/queriesDoctors';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';

export default function DoctorsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: doctorsData, isLoading, error } = useAllDoctors();
  const { mutate: deleteDoctor, isDeleting } = useDeleteDoctor();
  const [doctorToUpdate, setDoctorToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Médecin');

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Médecins' breadcrumbItem='List des médecins' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <DoctorForm
                doctorToEdit={doctorToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='doctorsList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setDoctorToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Ajouter un Médecin
                          </Button>
                          <Button
                            color='soft-danger'
                            // onClick="deleteMultiple()"
                          >
                            <i className='ri-delete-bin-2-line'></i>
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
                            <i className='ri-search-line search-icon'></i>
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
                      {doctorsData?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun médecin pour le moment !
                        </div>
                      )}
                      {!error && !isLoading && (
                        <table
                          className='table align-middle table-nowrap'
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
                              <th className='sort' data-sort='genre'>
                                Genre
                              </th>
                              <th className='sort' data-sort='speciality'>
                                Spécialité
                              </th>
                              <th className='sort' data-sort='email'>
                                Adresse Email
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
                          {doctorsData?.length > 0 &&
                            doctorsData?.map((doctor) => (
                              <tbody className='list form-check-all text-center'>
                                <tr key={doctor._id}>
                                  <th scope='row'></th>
                                  <td
                                    className='id'
                                    style={{ display: 'none' }}
                                  ></td>
                                  <td className='firstName'>
                                    {capitalizeWords(doctor.firstName)}{' '}
                                  </td>
                                  <td className='firstName'>
                                    {capitalizeWords(doctor.lastName)}{' '}
                                  </td>
                                  <td className='gender'>{doctor.gender} </td>
                                  <td className='speciality'>
                                    {capitalizeWords(doctor.speciality)}{' '}
                                  </td>
                                  <td className='email'>
                                    {doctor.emailAdresse}{' '}
                                  </td>

                                  <td className='date'>
                                    {new Date(
                                      doctor.dateOfBirth
                                    ).toLocaleDateString()}{' '}
                                  </td>

                                  <td className='adresse'>
                                    {capitalizeWords(doctor.adresse)}{' '}
                                  </td>
                                  <td className='phone'>
                                    {formatPhoneNumber(doctor.phoneNumber)}
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
                                            setDoctorToUpdate(doctor);
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
                                                doctor._id,
                                                doctor.firstName +
                                                  ' ' +
                                                  doctor.lastName,
                                                deleteDoctor
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
