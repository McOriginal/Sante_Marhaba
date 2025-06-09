import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import { Link } from 'react-router-dom';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import {
  useAllFournisseur,
  useDeleteFournisseur,
} from '../../Api/queriesFournisseur';
import FournisseurForm from './FournisseurForm';

export default function FournisseurListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: fournisseurData, isLoading, error } = useAllFournisseur();
  const { mutate: deleteFournisseur, isDeleting } = useDeleteFournisseur();
  const [fournisseurToUpdate, setFournisseurToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState(
    'Ajouter un Fournisseur'
  );

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Fournisseurs'
            breadcrumbItem='List des fournisseurs'
          />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <FournisseurForm
                fournisseurToEdit={fournisseurToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='fourniseursList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setFournisseurToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Ajouter un Fournisseur
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
                      {!fournisseurData?.length && !isLoading && !error && (
                        <div className='text-center text-mutate'>
                          Aucun Fournisseur pour le moment !
                        </div>
                      )}
                      {!error && fournisseurData?.length > 0 && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='fournisseurTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th scope='col' style={{ width: '50px' }}>
                                ID
                              </th>
                              <th className='sort' data-sort='fournisseur_name'>
                                Nom
                              </th>
                              <th className='sort' data-sort='email'>
                                Prénom
                              </th>
                              <th className='sort' data-sort='genre'>
                                Genre
                              </th>

                              <th className='sort' data-sort='email'>
                                Adresse Email
                              </th>

                              <th className='sort' data-sort='adresse'>
                                Domicile
                              </th>
                              <th className='sort' data-sort='phone'>
                                Téléphone
                              </th>
                              <th className='sort' data-sort='marchandise'>
                                Marchandise
                              </th>
                              <th className='sort' data-sort='action'>
                                Action
                              </th>
                            </tr>
                          </thead>

                          {fournisseurData?.map((fourniseur, index) => (
                            <tbody className='list form-check-all text-center'>
                              <tr key={fourniseur._id}>
                                <th scope='row'>{index + 1}</th>
                                <td className='firstName'>
                                  {capitalizeWords(fourniseur.firstName)}{' '}
                                </td>
                                <td className='firstName'>
                                  {capitalizeWords(fourniseur.lastName)}{' '}
                                </td>
                                <td className='gender'>{fourniseur.gender} </td>

                                <td className='email'>
                                  {fourniseur.emailAdresse}{' '}
                                </td>

                                <td className='adresse'>
                                  {capitalizeWords(fourniseur.adresse)}{' '}
                                </td>
                                <td className='phone'>
                                  {formatPhoneNumber(fourniseur.phoneNumber)}
                                </td>
                                <td className='speciality'>
                                  {capitalizeWords(fourniseur.marchandise)}{' '}
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
                                          setFournisseurToUpdate(fourniseur);
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
                                              fourniseur._id,
                                              fourniseur.firstName +
                                                ' ' +
                                                fourniseur.lastName,
                                              deleteFournisseur
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
