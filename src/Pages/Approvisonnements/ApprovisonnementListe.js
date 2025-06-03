import React, { useState } from 'react';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { Link } from 'react-router-dom';
import LoadingSpiner from '../components/LoadingSpiner';
import {
  capitalizeWords,
  formatPhoneNumber,
  formatPrice,
} from '../components/capitalizeFunction';
import { deleteButton } from '../components/AlerteModal';
import {
  useAllApprovisonnement,
  useDeleteApprovisonnement,
} from '../../Api/queriesApprovisonnement';

export default function ApprovisonnementListe() {
  const [form_modal, setForm_modal] = useState(false);
  const {
    data: ApprovisonnementData,
    isLoading,
    error,
  } = useAllApprovisonnement();
  const { mutate: deleteApprovisonnement, isDeleting } =
    useDeleteApprovisonnement();

  function tog_form_modal() {
    setForm_modal(!form_modal);
  }
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Pharmacie' breadcrumbItem='Approvisonnement' />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='approvisonnementList'>
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
                            Ajouter
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
                      {!ApprovisonnementData?.length &&
                        !isLoading &&
                        !error && (
                          <div className='text-center text-mutate'>
                            Aucune approvisonnement pour le moment !
                          </div>
                        )}
                      {!error &&
                        ApprovisonnementData?.length > 0 &&
                        !isLoading && (
                          <table
                            className='table align-middle table-nowrap'
                            id='fournisseurTable'
                          >
                            <thead className='table-light'>
                              <tr>
                                <th scope='col' style={{ width: '50px' }}>
                                  ID
                                </th>
                                <th data-sort='marchandise'>Médicaments</th>
                                <th data-sort='marchandise'>
                                  Quantité arrivée
                                </th>
                                <th data-sort='price'>Prix d'achat</th>
                                <th data-sort='deliveryDate'>Date d'arrivée</th>
                                <th data-sort='fournisseur_name'>
                                  Fournisseur
                                </th>

                                <th data-sort='phone'>Téléphone</th>

                                <th data-sort='action'>Action</th>
                              </tr>
                            </thead>

                            {ApprovisonnementData?.map((appro, index) => (
                              <tbody className='list form-check-all text-center'>
                                <tr key={appro._id}>
                                  <th scope='row'>{index + 1}</th>
                                  <td>
                                    {capitalizeWords(appro.medicament['name'])}
                                  </td>

                                  <td>{formatPrice(appro.quantity)}</td>
                                  <td>
                                    {formatPrice(appro.price)}
                                    {' F '}
                                  </td>

                                  <td>
                                    {new Date(
                                      appro.deliveryDate
                                    ).toLocaleDateString('fr-Fr', {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                      weekday: 'short',
                                    })}
                                  </td>
                                  <td>
                                    {capitalizeWords(
                                      appro.fournisseur['firstName']
                                    )}{' '}
                                    {capitalizeWords(
                                      appro.fournisseur['lastName']
                                    )}{' '}
                                  </td>

                                  <td>
                                    {formatPhoneNumber(
                                      appro.fournisseur['phoneNumber']
                                    )}
                                  </td>

                                  <td>
                                    <div className='d-flex gap-2'>
                                      {isDeleting && <LoadingSpiner />}
                                      {!isDeleting && (
                                        <div className='remove'>
                                          <button
                                            className='btn btn-sm btn-danger remove-item-btn'
                                            data-bs-toggle='modal'
                                            data-bs-target='#deleteRecordModal'
                                            onClick={() => {
                                              deleteButton(
                                                appro._id,
                                                appro.medicament['name'],
                                                deleteApprovisonnement
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
