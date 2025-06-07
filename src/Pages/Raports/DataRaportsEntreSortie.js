import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllPatients } from '../../Api/queriesPatient';
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';
import { formatPrice } from '../components/capitalizeFunction';
import { useAllPaiements } from '../../Api/queriesPaiement';
import { useAllDepenses } from '../../Api/queriesDepense';

Chart.register(CategoryScale);

const BarChartEntreSortie = () => {
  const { data: paiementsData = [] } = useAllPaiements();
  const { data: depenseData = [] } = useAllDepenses();

  const sumPaiementTotalAmoutByMonth = (paiement) => {
    const monthlySums = new Array(12).fill(0);
    paiement.forEach((paie) => {
      const date = new Date(paie.paiementDate);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlySums[month] += Number(paie.totalAmount || 0);
      }
    });
    return monthlySums;
  };

  const sumTotalAmountByMonth = (items) => {
    const monthlySums = new Array(12).fill(0);
    items.forEach((item) => {
      const date = new Date(item.dateOfDepense);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlySums[month] += Number(item.totalAmount || 0);
      }
    });
    return monthlySums;
  };

  const labels = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Jui',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ];

  const data = {
    labels,
    datasets: [
      {
        label: 'Entrée',
        data: sumPaiementTotalAmoutByMonth(paiementsData),
        backgroundColor: '#3d8ef8',
        barThickness: 10,
      },

      {
        label: 'Sortie(Dépenses)',
        data: sumTotalAmountByMonth(depenseData),
        backgroundColor: '#01baba',
        barThickness: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: '#686868',
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          color: '#7b919e',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <React.Fragment>
      <Bar width={537} height={268} data={data} options={options} />
    </React.Fragment>
  );
};

export default BarChartEntreSortie;
