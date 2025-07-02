import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Container,
} from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';

import LoadingSpiner from '../components/LoadingSpiner';
import { capitalizeWords, formatPrice } from '../components/capitalizeFunction';
import { useOnePaiement } from '../../Api/queriesPaiement';
import { useParams } from 'react-router-dom';
import React from 'react';
import html2pdf from 'html2pdf.js';
import {
  hospitalAdresse,
  hospitalName,
  hospitalTel,
  logoMedical,
} from '../Logo/logo';

export default function FactureDetails() {
  const { id } = useParams();
  const { data: selectedPaiement, isLoading, error } = useOnePaiement(id);

  // ------------------------------------------
  // ------------------------------------------
  // Export En PDF
  // ------------------------------------------
  // ------------------------------------------
  const exportPDFFacture = () => {
    const element = document.getElementById('facture');
    const opt = {
      filename: 'facture.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .catch((err) => console.error('Error generating PDF:', err));
  };

  // -----------------------------------------
  // -----------------------------------------
  // Impression
  // -----------------------------------------
  // -----------------------------------------

  const handlePrintFacture = () => {
    const content = document.getElementById('facture');
    // Ouvre une nouvelle fenêtre pour l'impression
    const printWindow = window.open('', '', 'width=800,height=600');

    // Récupère tous les <style> et <link rel="stylesheet">
    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    )
      .map((node) => node.outerHTML)
      .join('');

    printWindow.document.write(`
    <html>
      <head>
        <title>Impression d'Ordonnance</title>
        ${styles}
        <style>
          @media print {
            body {
              margin: 20px;
            }
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid>
          <Breadcrumbs title='Transactions' breadcrumbItem='Factures' />

          <Col className='col-sm-auto'>
            <div className='d-flex gap-4  justify-content-center align-items-center'>
              <Button
                color='info'
                className='add-btn'
                id='create-btn'
                onClick={handlePrintFacture}
              >
                <i className='fas fa-print align-center me-1'></i> Imprimer
              </Button>

              <Button color='danger' onClick={exportPDFFacture}>
                <i className='fas fa-paper-plane  me-1 '></i>
                Exporter en PDF
              </Button>
            </div>
          </Col>

          {error && (
            <div className='text-danger text-center'>
              Erreur de chargement des données
            </div>
          )}
          {isLoading && <LoadingSpiner />}

          {!error && !isLoading && (
            <Card
              id={'facture'}
              className='d-flex justify-content-center'
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
                    src={logoMedical}
                    style={{
                      width: '70px',
                      position: 'absolute',
                      top: '30px',
                      left: '10px',
                    }}
                  />
                  <CardTitle className='text-center '>
                    <h3>{hospitalName} </h3>
                    <p style={{ margin: '15px', fontSize: '10px' }}>
                      {hospitalAdresse}
                    </p>
                    <p style={{ margin: '15px', fontSize: '10px' }}>
                      {hospitalTel}
                    </p>
                  </CardTitle>
                  <CardText style={{ fontSize: '15px', margin: '35px 0' }}>
                    <strong> Date:</strong>{' '}
                    {new Date(selectedPaiement.createdAt).toLocaleDateString()}
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
                    <h6 style={{ marginBottom: '20px' }}>Patient</h6>
                    <CardText>
                      <strong>Nom et Prénom: </strong>
                      {capitalizeWords(
                        selectedPaiement?.traitement?.patient?.firstName
                      )}{' '}
                      {capitalizeWords(
                        selectedPaiement?.traitement?.patient?.lastName
                      )}
                    </CardText>
                    <CardText>
                      <strong>Sexe: </strong>
                      {capitalizeWords(
                        selectedPaiement?.traitement?.patient?.gender
                      )}
                    </CardText>
                    <CardText>
                      <strong>Age: </strong>
                      {selectedPaiement?.traitement?.patient?.age}
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
                      {capitalizeWords(selectedPaiement?.traitement?.motif)}
                    </CardText>
                    <CardText>
                      <strong>Date de Maladie : </strong>
                      {new Date(
                        selectedPaiement?.traitement?.createdAt
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
                        {formatPrice(selectedPaiement?.totalAmount)} F{' '}
                      </strong>{' '}
                    </CardText>
                    <CardText className='text-center '>
                      Payé:
                      <strong style={{ fontSize: '14px' }}>
                        {' '}
                        {formatPrice(
                          selectedPaiement?.traitement?.totalAmount
                        )}{' '}
                        F{' '}
                      </strong>{' '}
                    </CardText>
                    <CardText className='text-center '>
                      Réliqua:
                      <strong style={{ fontSize: '14px' }}>
                        {' '}
                        {formatPrice(
                          selectedPaiement?.totalAmount -
                            selectedPaiement?.traitement?.totalAmount
                        )}{' '}
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
