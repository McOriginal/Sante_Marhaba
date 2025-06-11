import {
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Container,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { useOnePaiement } from '../../Api/queriesPaiement';
import { useParams } from 'react-router-dom';
import logo_medical from './../../assets/images/logo_medical.png';
import React from 'react';

export default function FactureDetails() {
  const { id } = useParams();
  const { data: selectedPaiement, isLoading, error } = useOnePaiement(id);

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Transactions' breadcrumbItem='Factures' />

          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}

          {!error && !isLoading && (
            <Card
              style={{
                boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                borderRadius: '15px',
                width: '583px',
                margin: '20px auto',
                position: 'relative',
              }}
            >
              <CardBody>
                <CardHeader>
                  <CardImg
                    src={logo_medical}
                    style={{
                      width: '70px',
                      position: 'absolute',
                      top: '30px',
                      left: '10px',
                    }}
                  />
                  <CardTitle className='text-center '>
                    <h2>Centre de Santé MARHABA</h2>
                    <p style={{ margin: '15px', fontSize: '10px' }}>
                      Kabala zone universitaire sur le goudron de COURALE
                    </p>
                    <p style={{ margin: '15px', fontSize: '10px' }}>
                      78-87-91-34 / 63-00-67-89
                    </p>
                  </CardTitle>
                  <CardText style={{ fontSize: '15px', margin: '35px 0' }}>
                    <strong> Date:</strong>{' '}
                    {new Date(selectedPaiement.createdAt).toLocaleDateString()}
                  </CardText>
                  <CardImg
                    src={logo_medical}
                    style={{
                      width: '70px',
                      position: 'absolute',
                      top: '30px',
                      right: '10px',
                    }}
                  />
                </CardHeader>
                <h4 className='text-center'>Réçu</h4>
                <div className='d-flex justify-content-around align-item-center'>
                  <div className='my-2 '>
                    <h6 style={{ marginBottom: '20px' }}>Patient(e)</h6>
                    <CardText>
                      {capitalizeWords(
                        selectedPaiement?.traitement['patient'].firstName
                      )}{' '}
                      {capitalizeWords(
                        selectedPaiement?.traitement['patient'].lastName
                      )}
                    </CardText>
                    <CardText>
                      {new Date(
                        selectedPaiement?.traitement['patient'].dateOfBirth
                      ).toLocaleDateString()}
                    </CardText>
                    <CardText>
                      {capitalizeWords(
                        selectedPaiement?.traitement['patient'].gender
                      )}
                    </CardText>
                  </div>
                  {/* Bordure Séparateur */}

                  <div
                    style={{
                      borderLeft: '2px solid #ccc',
                      height: '100px',
                      margin: '0 20px',
                      alignSelf: 'center',
                    }}
                  ></div>

                  <div className='my-2 px-2'>
                    <h6 style={{ marginBottom: '20px' }}>Traitement</h6>
                    <CardText>
                      <strong> Maladie: </strong>{' '}
                      {capitalizeWords(selectedPaiement?.traitement['motif'])}
                    </CardText>
                    <CardText>
                      {new Date(
                        selectedPaiement?.traitement['createdAt']
                      ).toLocaleDateString('fr-Fr', {
                        weekday: 'long',
                        year: 'numeric',
                        month: '2-digit',
                      })}
                    </CardText>
                  </div>
                </div>

                <div className='my-3'>
                  <CardText className='d-flex justify-content-center align-items-center fs-5'>
                    <strong> Paiement:</strong>
                  </CardText>

                  <div
                    className='d-flex
                  flex-column
                  justif-content-center'
                  >
                    <CardText className={'text-center'}>
                      Somme Total:{' '}
                      <strong style={{ fontSize: '14px' }}>
                        {' '}
                        {formatPrice(
                          selectedPaiement.traitement['totalAmount']
                        )}{' '}
                        F{' '}
                      </strong>{' '}
                    </CardText>
                    <CardText className='text-center '>
                      Payé:
                      <strong style={{ fontSize: '14px' }}>
                        {' '}
                        {formatPrice(selectedPaiement.totalAmount)} F{' '}
                      </strong>{' '}
                    </CardText>
                    <CardText className='text-center '>
                      Réliqua:
                      <strong style={{ fontSize: '14px' }}>
                        {' '}
                        {selectedPaiement.totalAmount -
                          selectedPaiement.traitement['totalAmount']}{' '}
                        F{' '}
                      </strong>
                    </CardText>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
}
