import React from 'react';
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
import { useAllPaiements } from '../../Api/queriesPaiement';
import {
  hospitalAdresse,
  hospitalName,
  hospitalTel,
  logoMedical,
} from '../Logo/logo';

export default function FactureListe() {
  const { data: paiementData, isLoading, error } = useAllPaiements();

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs
            title='Transactions'
            breadcrumbItem='Liste de Factures'
          />

          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}
          {paiementData?.length === 0 && (
            <div className='text-center'>Aucune Facture disponible.</div>
          )}

          <div style={{ width: '100%', borderBottom: '2px dotted #0ababa' }}>
            {!error &&
              !isLoading &&
              paiementData?.length > 0 &&
              paiementData?.map((paiement) => (
                <Card
                  key={paiement._id}
                  style={{
                    boxShadow: '0px 0px 10px rgba(100, 169, 238, 0.5)',
                    borderRadius: '15px',
                    width: '583px',
                    margin: '35px auto',
                    position: 'relative',
                  }}
                >
                  <CardBody>
                    <CardHeader>
                      <CardImg
                        src={logoMedical}
                        style={{
                          width: '70px',
                          position: 'absolute',
                          top: '30px',
                          left: '10px',
                        }}
                      />
                      <CardTitle className='text-center '>
                        <h3> {hospitalName} </h3>
                        <p style={{ margin: '15px', fontSize: '10px' }}>
                          {hospitalAdresse}{' '}
                        </p>
                        <p style={{ margin: '15px', fontSize: '10px' }}>
                          {hospitalTel}{' '}
                        </p>
                      </CardTitle>
                      <CardText style={{ fontSize: '15px', margin: '35px 0' }}>
                        <strong> Date:</strong>{' '}
                        {new Date(paiement.createdAt).toLocaleDateString()}
                      </CardText>
                      <CardImg
                        src={logoMedical}
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
                            paiement?.traitement['patient'].firstName
                          )}{' '}
                          {capitalizeWords(
                            paiement?.traitement['patient'].lastName
                          )}
                        </CardText>
                        <CardText>
                          {new Date(
                            paiement?.traitement['patient'].dateOfBirth
                          ).toLocaleDateString()}
                        </CardText>
                        <CardText>
                          {capitalizeWords(
                            paiement?.traitement['patient'].gender
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
                          {capitalizeWords(paiement?.traitement['motif'])}
                        </CardText>
                        <CardText>
                          {new Date(
                            paiement?.traitement['createdAt']
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
                              paiement.traitement['totalAmount']
                            )} F{' '}
                          </strong>{' '}
                        </CardText>
                        <CardText className='text-center '>
                          Payé:
                          <strong style={{ fontSize: '14px' }}>
                            {' '}
                            {formatPrice(paiement.totalAmount)} F{' '}
                          </strong>{' '}
                        </CardText>
                        <CardText className='text-center '>
                          Réliqua:
                          <strong style={{ fontSize: '14px' }}>
                            {' '}
                            {paiement.totalAmount -
                              paiement.traitement['totalAmount']}{' '}
                            F{' '}
                          </strong>
                        </CardText>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
}
