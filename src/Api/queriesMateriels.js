import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Materiel
export const useCreateMateriel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/materiels/createMateriel', data),
    onSuccess: () => queryClient.invalidateQueries(['materiels']),
  });
};

// Mettre à jour une Materiel
export const useUpdateMateriel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/materiels/updateMateriel/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['materiels']),
  });
};

// Lire toutes les Materiels
export const useAllMateriels = () =>
  useQuery({
    queryKey: ['materiels'],
    queryFn: () => api.get('/materiels/getMateriels').then((res) => res.data),
  });

// Obtenir une Materiel
export const useOneMateriel = () =>
  useQuery({
    queryKey: ['getOneMateriel'],
    queryFn: () => api.get('/materiels/getOneMateriel').then((res) => res.data),
  });

// Supprimer une Materiel
export const useDeleteMateriel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/materiels/deleteMateriel/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['materiels']),
  });
};
