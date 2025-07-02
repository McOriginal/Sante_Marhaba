import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import FormModal from '../components/FormModal';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import { useAllPaiements, useDeletePaiement } from '../../Api/queriesPaiement';
import PaiementForm from './PaiementForm';
import { useNavigate } from 'react-router-dom';

export default function PaiementsListe() {
  const [form_modal, setForm_modal] = useState(false);
  const { data: paiementsData, isLoading, error } = useAllPaiements();
  const { mutate: deletePaiement, isDeleting } = useDeletePaiement();
  const [paiementToUpdate, setPaiementToUpdate] = useState(null);
  const [formModalTitle, setFormModalTitle] = useState('Ajouter un Paiement');

  // State de Recherche
  const [searchTerm, setSearchTerm] = useState('');

  // Fonction de Rechercher
  const filterSearchPaiement = paiementsData?.filter((paiement) => {
    const search = searchTerm.toLowerCase();
    return (
      `${paiement?.traitement?.patient?.firstName} ${paiement?.traitement?.patient?.lastName}`
        .toLowerCase()
        .includes(search) ||
      paiement?.traitement?.patient?.gender.toLowerCase().includes(search) ||
      paiement?.traitement?.motif?.toLowerCase().includes(search) ||
      paiement?.totalAmount.toString().includes(search) ||
      (paiement?.totalPaye || '').toString().includes(search) ||
      (paiement?.reduction || 0).toString().includes(search) ||
      (
        paiement?.paiementDate &&
        new Date(paiement?.paiementDate).toLocaleDateString()
      ).includes(search)
    );
  });

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
                            color='info'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              setPaiementToUpdate(null);
                              setFormModalTitle('Ajouter un Paiement');
                              tog_form_modal();
                            }}
                          >
                            <i className='fas fa-dollar-sign align-center me-1'></i>{' '}
                            Ajouter un Paiement
                          </Button>
                        </div>
                      </Col>
                      <Col className='col-sm'>
                        <div className='d-flex justify-content-sm-end gap-3'>
                          {searchTerm !== '' && (
                            <Button
                              color='warning'
                              onClick={() => setSearchTerm('')}
                            >
                              {' '}
                              <i className='fas fa-window-close'></i>{' '}
                            </Button>
                          )}
                          <div className='search-box me-4'>
                            <input
                              type='text'
                              className='form-control search border border-dark rounded'
                              placeholder='Rechercher...'
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
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
                      {filterSearchPaiement?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun paiement trouvée !
                        </div>
                      )}
                      {!error &&
                        !isLoading &&
                        filterSearchPaiement?.length > 0 && (
                          <table
                            className='table align-middle table-nowrap text-center table-hover'
                            id='paiementTable'
                          >
                            <thead className='table-light border-bottom border-secondary'>
                              <tr>
                                <th
                                  style={{ width: '50px' }}
                                  data-sort='paiementDate'
                                >
                                  Date de Paiement
                                </th>
                                <th data-sort='paiement_name'>Patient</th>

                                <th data-sort='genre'>Genre</th>
                                <th data-sort='age'>Age</th>
                                <th data-sort='traitement'>Maladie Traitée</th>

                                <th data-sort='totaAmount'>Somme Total</th>
                                <th className='sort' data-sort='totaPayer'>
                                  Somme Payé
                                </th>
                                <th className='sort' data-sort='reliqua'>
                                  Réliqua
                                </th>
                                <th data-sort='motif'>Réduction</th>

                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>

                            <tbody className='list form-check-all text-center'>
                              {filterSearchPaiement?.length > 0 &&
                                filterSearchPaiement?.map((paiement) => (
                                  <tr
                                    key={paiement?._id}
                                    className='text-center border-bottom border-secondary'
                                  >
                                    <th scope='row'>
                                      {new Date(
                                        paiement?.paiementDate
                                      ).toLocaleDateString()}
                                    </th>
                                    <td
                                      className='id'
                                      style={{ display: 'none' }}
                                    ></td>
                                    <td>
                                      {capitalizeWords(
                                        paiement?.traitement?.patient?.firstName
                                      )}{' '}
                                      {capitalizeWords(
                                        paiement?.traitement?.patient?.lastName
                                      )}
                                    </td>
                                    <td>
                                      {capitalizeWords(
                                        paiement?.traitement?.patient?.gender
                                      )}{' '}
                                    </td>
                                    <td>
                                      {paiement?.traitement?.patient?.age
                                        ? paiement?.traitement?.patient?.age
                                        : '----'}
                                    </td>

                                    <td>
                                      {capitalizeWords(
                                        paiement?.traitement['motif']
                                      )}
                                    </td>

                                    <td>
                                      {formatPrice(paiement?.totalAmount)}
                                      {' F '}
                                    </td>
                                    <td>
                                      {formatPrice(paiement?.totalPaye)}
                                      {' F '}
                                    </td>
                                    <td>
                                      {paiement?.totalAmount -
                                        paiement?.totalPaye >
                                      0 ? (
                                        <span className='text-danger'>
                                          {' '}
                                          {formatPrice(
                                            paiement?.totalAmount -
                                              paiement?.totalPaye
                                          )}
                                          {' F '}
                                        </span>
                                      ) : (
                                        <span>
                                          {' '}
                                          {formatPrice(
                                            paiement?.totalAmount -
                                              paiement?.totalPaye
                                          )}
                                          {' F '}
                                        </span>
                                      )}
                                    </td>
                                    <td className='text-warning'>
                                      {formatPrice(paiement?.reduction)} F
                                    </td>

                                    <td>
                                      <div className='d-flex gap-2'>
                                        <div>
                                          <button
                                            className='btn btn-sm btn-secondary show-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#showModal'
                                            onClick={() => {
                                              handlePaiementClick(
                                                paiement?._id
                                              );
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
                                              setPaiementToUpdate(paiement);
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
                                                  paiement?._id,
                                                  `Paiement de ${paiement?.totalAmount} F
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
                                ))}
                            </tbody>
                          </table>
                        )}
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
