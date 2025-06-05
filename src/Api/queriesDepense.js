import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Depense
export const useCreateDepense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/depenses/createDepense', data),
    onSuccess: () => queryClient.invalidateQueries(['depenses']),
  });
};

// Mettre à jour une Depense
export const useUpdateDepense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/depenses/updateDepense/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['depenses']),
  });
};
// Lire toutes les depenses
export const useAllDepenses = () =>
  useQuery({
    queryKey: ['depenses'],
    queryFn: () => api.get('/depenses/getAllDepense').then((res) => res.data),
  });

// Obtenir une Depense
export const useOneDepense = (id) =>
  useQuery({
    queryKey: ['depenses', id],
    queryFn: () =>
      api.get(`/depenses/getDepenseById/${id}`).then((res) => res.data),
  });

// Supprimer une Depense
export const useDeleteDepense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/depenses/deleteDepense/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['depenses']),
  });
};
