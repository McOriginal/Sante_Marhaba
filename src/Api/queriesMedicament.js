import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Medicaments
export const useCreateMedicament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/medicaments/addMedicament', data),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};

// Mettre à jour une Medicaments
export const useUpdateMedicament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/medicaments/updateMedicament/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};

// Mettre à jour une Medicaments avec Stock
export const useDecrementMultipleStocks = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items) =>
      api.post('/medicaments/decrementMultipleStocks', { items }),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};

// Lire toutes les Medicaments
export const useAllMedicament = () =>
  useQuery({
    queryKey: ['medicaments'],
    queryFn: () =>
      api.get('/medicaments/getAllMedicaments').then((res) => res.data),
  });

// Obtenir une Medicament
export const useOneMedicament = (id) =>
  useQuery({
    queryKey: ['getMedicament', id],
    queryFn: () =>
      api.get(`/medicaments/getOneMedicament/${id}`).then((res) => res.data),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Supprimer une Medicaments
export const useDeleteMedicament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/medicaments/deleteMedicament/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['medicaments']),
  });
};
