import React from 'react';
import { motion } from 'framer-motion';

import { Row, Container, Col } from 'reactstrap';
//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

import TotalFounisseurs from './TotalFournisseurs';
import TotalDoctors from './TotalDoctors';
import TotalPatients from './TotalPatients';
import TotalChambre from './TotalChambres';
import TotalBed from './TotalBed';
import TotalTraitement from './TotalTraitement';
import BarChartDataRaportsTraitement from '../Raports/DataRaportsTraitement';
import SelectedMounthTotalTraitement from './SelectedMounthTotalTraitement';

const Dashboard = () => {
  document.title = 'Dashboard | Upzet - React Admin & Dashboard Template';

  return (
    <React.Fragment>
      <div className='page-content'>
        <Container fluid={true}>
          <Breadcrumbs title='Upzet' breadcrumbItem='Dashboard' />

          <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Row>
              {/* Total Doctors */}
              <TotalDoctors />

              {/* Total Patients */}
              <TotalPatients />

              {/* Total Fournisseurs */}

              <TotalFounisseurs />

              {/* Total Lits */}

              <TotalBed />

              {/* Total Chambres */}

              <TotalChambre />

              {/* Total Traitements */}

              <TotalTraitement />
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -70 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Row style={{ margin: '50px auto' }}>
              <Col xl={8}>
                <BarChartDataRaportsTraitement />
              </Col>

              <Col xl={4}>
                {/* Filtre result by mounth */}
                <SelectedMounthTotalTraitement />
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
