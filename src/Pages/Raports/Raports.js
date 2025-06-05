import { Card, CardBody, CardTitle, Col, Container, Row } from 'reactstrap';
import Breadcrumbs from '../../components/Common/Breadcrumb';
import React from 'react';
import RaportsBarChart from './DataRaports';

const Raports = () => {
  document.title = 'Raports | Centre de Santé - MARHABA ';
  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid={true}>
          <Breadcrumbs title='Statistique' breadcrumbItem='Raports' />

          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle>Raports et Revenu Annuel</CardTitle>
                  <p className='card-title-desc'>
                    Le raports de Centre de Santé MARHABA vous permet de
                    visualiser les données statistiques concernant les
                    <span className='text-info'>
                      {' '}
                      traitements, les patients et les ordonnances.
                    </span>{' '}
                    Vous pouvez également suivre l'évolution des revenus
                    mensuels.
                  </p>
                  <RaportsBarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Raports;
