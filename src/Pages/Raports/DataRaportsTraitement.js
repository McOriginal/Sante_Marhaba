import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllPatients } from '../../Api/queriesPatient';
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';
import { formatPrice } from '../components/capitalizeFunction';
import { Card, CardBody } from 'reactstrap';

Chart.register(CategoryScale);

const BarChartDataRaportsTraitement = () => {
  const { data: traitementsData = [] } = useAllTraitement();

  const sumTotalTraitementByMonth = (items) => {
    const monthlySums = new Array(12).fill(0);
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlySums[month] += 1;
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
        label: `Traitements`,
        data: sumTotalTraitementByMonth(traitementsData),
        backgroundColor: '#3d8ef8',
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
      <Card>
        <div className='card-header'>
          <h4 className='card-title mb-0'>Rapport du Traitements</h4>
        </div>
        <CardBody>
          <Bar width={537} height={268} data={data} options={options} />
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default BarChartDataRaportsTraitement;
