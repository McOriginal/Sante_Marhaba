import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { useAllPaiements, useDeletePaiement } from '../../Api/queriesPaiement';
import PaiementForm from './PaiementForm';

export default function PaiementsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: paiementsData, isLoading, error } = useAllPaiements();
  const { mutate: deletePaiement, isDeleting } = useDeletePaiement();
  const [paiementToUpdate, setpaiementToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Paiement');

  const navigate = useNavigate();

  // Navigation ver la FACTURE avec ID de Paiement
  const handlePaiementClick = (id) => {
    navigate(`/facture/${id}`);
  };
  // Ouverture de Modal Form
  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Transaction' breadcrumbItem='Paiements' />

          {/* -------------------------- */}
          <FormModal
            form_modal={form_modal}
            setForm_modal={setForm_modal}
            tog_form_modal={tog_form_modal}
            modal_title={formModalTitle}
            size='md'
            bodyContent={
              <PaiementForm
                paiementToEdit={paiementToUpdate}
                tog_form_modal={tog_form_modal}
              />
            }
          />

          {/* -------------------- */}
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='paiementsList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setpaiementToUpdate(null);
                              tog_form_modal();
                            }}
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Ajouter un Paiement
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
                      {paiementsData?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun paiement enregistrée pour le moment !
                        </div>
                      )}
                      {!error && !isLoading && paiementsData.length > 0 && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='paiementTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th
                                style={{ width: '50px' }}
                                data-sort='paiementDate'
                              >
                                Date de Paiement
                              </th>
                              <th className='sort' data-sort='paiement_name'>
                                Patient(e)
                              </th>

                              <th className='sort' data-sort='genre'>
                                Genre
                              </th>
                              <th className='sort' data-sort='date'>
                                Date de naissance
                              </th>
                              <th className='sort' data-sort='traitement'>
                                Maladie Traitée
                              </th>

                              <th className='sort' data-sort='totaAmount'>
                                Somme Payé
                              </th>
                              <th className='sort' data-sort='motif'>
                                Motif de Paiement
                              </th>

                              <th className='sort' data-sort='statut'>
                                Statut
                              </th>
                              <th className='sort' data-sort='action'>
                                Action
                              </th>
                            </tr>
                          </thead>
                          {paiementsData?.length > 0 &&
                            paiementsData?.map((paiement) => (
                              <tbody className='list form-check-all text-center'>
                                <tr key={paiement._id}>
                                  <th scope='row'>
                                    {new Date(
                                      paiement.paiementDate
                                    ).toLocaleDateString()}
                                  </th>
                                  <td
                                    className='id'
                                    style={{ display: 'none' }}
                                  ></td>
                                  <td className='firstName'>
                                    {capitalizeWords(
                                      paiement.traitement['patient'].firstName
                                    )}{' '}
                                    {capitalizeWords(
                                      paiement.traitement['patient'].lastName
                                    )}
                                  </td>
                                  <td className='genre'>
                                    {capitalizeWords(
                                      paiement.traitement['patient'].gender
                                    )}{' '}
                                  </td>
                                  <td>
                                    {new Date(
                                      paiement.traitement['patient'].dateOfBirth
                                    ).toLocaleDateString()}{' '}
                                  </td>

                                  <td>
                                    {capitalizeWords(
                                      paiement.traitement['motif']
                                    )}
                                  </td>

                                  <td className='adresse'>
                                    {formatPrice(paiement.totalAmount)}
                                    {' F '}
                                  </td>
                                  <td>
                                    {capitalizeWords(paiement.motifPaiement)}
                                  </td>

                                  <td>
                                    <span
                                      className={`badge badge-soft-${
                                        paiement.statut === 'payé'
                                          ? 'success'
                                          : 'danger'
                                      } text-uppercase`}
                                    >
                                      {paiement.statut}
                                    </span>
                                  </td>

                                  <td>
                                    <div className='d-flex gap-2'>
                                      <div>
                                        <button
                                          className='btn btn-sm btn-secondary show-item-btn'
                                          data-bs-toggle='modal'
                                          data-bs-target='#showModal'
                                          onClick={() => {
                                            handlePaiementClick(paiement._id);
                                          }}
                                        >
                                          <i className='bx bx-show align-center text-white'></i>
                                        </button>
                                      </div>
                                      <div className='edit'>
                                        <button
                                          className='btn btn-sm btn-success edit-item-btn'
                                          onClick={() => {
                                            setFormModalTitle(
                                              'Modifier les données'
                                            );
                                            setpaiementToUpdate(paiement);
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
                                                paiement._id,
                                                `Paiement de ${paiement.totalAmount} F
                                                   `,
                                                deletePaiement
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
