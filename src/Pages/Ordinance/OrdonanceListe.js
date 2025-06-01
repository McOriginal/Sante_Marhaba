import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords } from '../components/capitalizeFunction';
import { Link, useNavigate } from 'react-router-dom';
import { deleteButton } from '../components/AlerteModal';
import {
  useAllOrdonnances,
  useDeleteOrdonnance,
} from '../../Api/queriesOrdonnance';
import React, { useState } from 'react';
import OrdonnanceDetails from './OrdonnanceDetails';

export default function OrdonnanceListe() {
  const { data: ordonnances, isLoading, error } = useAllOrdonnances();
  const { mutate: deleteOrdonnance, isLoading: isDeleting } =
    useDeleteOrdonnance();
  const [show_modal, setShow_modal] = useState(false);
  const [selectedOrdonnanceID, setSelectedOrdonnanceID] = useState(false);
  const navigate = useNavigate();

  function tog_show_modal() {
    setShow_modal(!show_modal);
  }

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Traitements' breadcrumbItem='Ordonnances' />
          {/* -------------------------- */}
          <OrdonnanceDetails
            show_modal={show_modal}
            setForm_modal={setShow_modal}
            tog_show_modal={tog_show_modal}
            selectedOrdonnanceID={selectedOrdonnanceID} // Pass the selected ordonnance ID here
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div id='ordonnanceList'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            id='create-btn'
                            onClick={() => {
                              navigate('/traitements');
                            }}
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Ajouter une Ordonnance
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
                    <p className='text-center my-4 text-warning'>
                      Pour ajouter une Ordonnance vous devez retourner
                      sélectionner le Traitement concernée
                    </p>
                    {error && (
                      <div className='text-danger text-center'>
                        Erreur de chargement des données
                      </div>
                    )}
                    {isLoading && <LoadingSpiner />}

                    <div className='table-responsive table-card mt-3 mb-1'>
                      {ordonnances?.length === 0 && (
                        <div className='text-center text-mutate'>
                          Aucun ordo pour le moment !
                        </div>
                      )}
                      {!error && !isLoading && (
                        <table
                          className='table align-middle table-nowrap table-hover'
                          id='ordonnanceTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th scope='col' style={{ width: '50px' }}>
                                ID
                              </th>
                              <th className='sort' data-sort='date'>
                                Date d'ordonnance
                              </th>
                              <th className='sort' data-sort='ordonnance_name'>
                                Type de traitement
                              </th>
                              <th className='sort' data-sort='traitementDate'>
                                Date de Traitement
                              </th>
                              <th className='sort' data-sort='medicamentItems'>
                                Nombre de Médicaments
                              </th>

                              <th className='sort' data-sort='action'>
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody className='list form-check-all text-center'>
                            {ordonnances?.length > 0 &&
                              ordonnances?.map((ordo) => (
                                <tr key={ordo._id}>
                                  <th scope='row'></th>
                                  <td
                                    className='id'
                                    style={{ display: 'none' }}
                                  ></td>
                                  <td>
                                    {new Date(
                                      ordo.createdAt
                                    ).toLocaleDateString('fr-Fr', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                    })}
                                  </td>
                                  <td>
                                    {capitalizeWords(ordo.traitement['motif'])}
                                  </td>
                                  <td>
                                    {new Date(
                                      ordo.createdAt
                                    ).toLocaleDateString('fr-Fr', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit',
                                    })}{' '}
                                  </td>

                                  <td>
                                    {ordo.items.length} médicaments
                                    {'  '}
                                  </td>

                                  <td>
                                    <div className='d-flex gap-2'>
                                      <div className='show-details'>
                                        <button
                                          className='btn btn-sm btn-info show-item-btn'
                                          data-bs-toggle='modal'
                                          data-bs-target='#showdetails'
                                          onClick={() => {
                                            setSelectedOrdonnanceID(ordo._id);
                                            tog_show_modal();
                                          }}
                                        >
                                          <i className=' bx bx-show-alt text-white'></i>
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
                                                ordo._id,
                                                'ordonnance: ' +
                                                  ordo.traitement['motif'],
                                                deleteOrdonnance
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
