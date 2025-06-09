import React, { useState, useMemo } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { useAllPaiements } from '../../Api/queriesPaiement';
import { useAllDepenses } from '../../Api/queriesDepense';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { formatPrice } from '../components/capitalizeFunction'; // Pour afficher les montants formatés
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';

const SelectedMounthTotalTraitement = () => {
  const { data: traitementsData = [] } = useAllTraitement();
  const { data: paiementsData = [] } = useAllPaiements();
  const { data: depenseData = [] } = useAllDepenses();
  const { data: ordonnancesData = [] } = useAllOrdonnances();

  const monthOptions = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Calcul des totaux Nombre de Traitement pour le mois sélectionné
  const totalTraitementsNumber = useMemo(() => {
    return traitementsData.filter((item) => {
      const date = new Date(item.createdAt);
      return !isNaN(date) && date.getMonth() === selectedMonth;
    }).length;
  }, [traitementsData, selectedMonth]);

  // Calcul des totaux pour Traitements pour le mois sélectionné
  const totalTraitementAmount = useMemo(() => {
    return traitementsData.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date) && date.getMonth() === selectedMonth) {
        acc += Number(item.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [traitementsData, selectedMonth]);

  // Calculer le Total des Ordonnances pour le mois sélectionné
  const totalOrdonnancesAmount = useMemo(() => {
    return ordonnancesData.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date) && date.getMonth() === selectedMonth) {
        acc += Number(item.totaAmount || 0);
      }
      return acc;
    }, 0);
  }, [ordonnancesData, selectedMonth]);

  // Calcul des totaux pour Paiements pour le mois sélectionné
  const totalPaiements = useMemo(() => {
    return paiementsData.reduce((acc, item) => {
      const date = new Date(item.paiementDate);
      if (!isNaN(date) && date.getMonth() === selectedMonth) {
        acc += Number(item.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [paiementsData, selectedMonth]);

  // Calcul des totaux pour Dépenses pour le mois sélectionné
  const totalDepenses = useMemo(() => {
    return depenseData.reduce((acc, item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date) && date.getMonth() === selectedMonth) {
        acc += Number(item.totalAmount || 0);
      }
      return acc;
    }, 0);
  }, [depenseData, selectedMonth]);

  // Calculer Le revenu (Bénéfice) pour le mois sélectionné
  const profit = useMemo(() => {
    return totalPaiements - totalDepenses;
  }, [totalPaiements, totalDepenses]);

  return (
    <React.Fragment>
      <Card style={{ boxShadow: '0px 0px 10px rgba(123, 123, 123, 0.28)' }}>
        {/* Filtrage Bouton */}
        <Row>
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(1deg, #641B2E 0%, #BE5B50 100%)',
              }}
            >
              <CardBody>
                <h6 className='text-white text-center'>Filtrage Mensuel</h6>
                <div className='d-flex align-items-center justify-content-between mb-3'>
                  <select
                    className='form-select form-select-sm'
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  >
                    {monthOptions.map((label, index) => (
                      <option key={index} value={index}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className='text-center text-white'></div>
              </CardBody>
            </Card>
          </Col>
          <Col md={4}>
            <h4 className='text-end mt-5' style={{ color: '#BE5B50' }}>
              Rapports Mensuel
            </h4>
          </Col>
        </Row>

        {/* Résultats */}
        <Row>
          {/* Bénefices */}
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #00D4FF)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              {' '}
              <h5 className='mb-1 text-white'>Bénéfice (Revenue)</h5>
              {profit <= 0 ? (
                <h4 className='text-danger'>{formatPrice(profit)}</h4>
              ) : (
                <h4 className='text-success'>{formatPrice(profit)}</h4>
              )}{' '}
              F
            </Card>{' '}
          </Col>
          {/* Paiements */}
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #00D4FF)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='mb-1 text-success'>
                {formatPrice(totalPaiements)} F
              </h4>
              <p className='text-white'>Paiements (Entrée)</p>
            </Card>{' '}
          </Col>

          {/* Dépences */}
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #00D4FF)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              {' '}
              <h4 className='mb-1 text-danger'>
                {formatPrice(totalDepenses)} F
              </h4>
              <p className='text-white'>Dépenses (Sortie)</p>
            </Card>{' '}
          </Col>

          {/* Traitements */}
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #00D4FF)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='text-warning mb-1'>
                {formatPrice(totalTraitementAmount)} F
              </h4>
              <p className='text-warning mb-1'>
                Nombre: {totalTraitementsNumber}
              </p>
              <p className='text-white'>Traitements</p>
            </Card>{' '}
          </Col>

          {/* Total Ordonnances */}
          <Col md={4}>
            <Card
              style={{
                background: 'linear-gradient(to top right , #090979, #00D4FF)',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100px',
              }}
            >
              <h4 className='text-warning mb-1'>
                {formatPrice(totalOrdonnancesAmount)} F
              </h4>

              <p className='text-white'>Ordonnances</p>
            </Card>{' '}
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  );
};

export default SelectedMounthTotalTraitement;
