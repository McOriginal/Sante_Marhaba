import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { Chart, CategoryScale } from 'chart.js';
import { useAllTraitement } from '../../Api/queriesTraitement';
import { useAllPatients } from '../../Api/queriesPatient';
import { useAllOrdonnances } from '../../Api/queriesOrdonnance';

Chart.register(CategoryScale);

const BarChartPatientTraitementOrdonnance = () => {
  const { data: traitementsData = [] } = useAllTraitement();
  const { data: patientData = [] } = useAllPatients();
  const { data: ordonnanceData = [] } = useAllOrdonnances();

  const countPatientsByMonth = (patients) => {
    const monthlyCounts = new Array(12).fill(0);
    patients.forEach((patient) => {
      const date = new Date(patient.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlyCounts[month]++;
      }
    });
    return monthlyCounts;
  };

  const sumTotalAmountByMonth = (items) => {
    const monthlySums = new Array(12).fill(0);
    items.forEach((item) => {
      const date = new Date(item.createdAt);
      if (!isNaN(date)) {
        const month = date.getMonth();
        monthlySums[month] += Number(item.totalAmount || 0);
      }
    });
    return monthlySums;
  };

  // const sumTotalTraitement = () => {
  //   return traitementsData.reduce((acc, traitement) => {
  //     acc += Number(traitement.totalAmount || 0);
  //     return acc;
  //   }, 0);
  // };

  // const sumTotalOrdonnance = () => {
  //   return ordonnanceData.reduce((acc, ordonnance) => {
  //     acc += Number(ordonnance.totalAmount || 0);
  //     return acc;
  //   }, 0);
  // };

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
        label: `Traitements  `,
        data: sumTotalAmountByMonth(traitementsData),
        backgroundColor: '#3d8ef8',
        barThickness: 10,
      },
      {
        label: 'Patients',
        data: countPatientsByMonth(patientData),
        backgroundColor: '#c1c1c14',
        barThickness: 10,
      },
      {
        label: `Ordonnances`,
        data: sumTotalAmountByMonth(ordonnanceData),
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

export default BarChartPatientTraitementOrdonnance;
