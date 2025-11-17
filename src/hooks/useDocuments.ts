import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDocumentsPaged,
  createDocument,
  deleteDocument,
  activateDocument,
  deactivateDocument,
} from '@/services/documents';
import { getAllUsers, updateUser } from '@/services/users-admin';
import { User } from '@/types/user';
import toast from 'react-hot-toast';

export const documentKeys = {
  all: ['documents'] as const,
  users: () => [...documentKeys.all, 'users'] as const,
  documents: (page?: number, size?: number) =>
    [...documentKeys.all, 'list', { page, size }] as const,
};

/**
 * Hook para obtener todos los usuarios
 */
export const useUsers = () => {
  return useQuery({
    queryKey: documentKeys.users(),
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para actualizar un usuario
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: User) => updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.users() });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar el usuario');
    },
  });
};

/**
 * Hook para obtener documentos paginados
 */
export const useDocuments = (page = 0, size = 10) => {
  return useQuery({
    queryKey: documentKeys.documents(page, size),
    queryFn: () => getDocumentsPaged(page, size),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

/**
 * Hook para crear un documento
 */
export const useCreateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentNumber: string) => createDocument(documentNumber),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      toast.success('Documento agregado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear documento');
    },
  });
};

/**
 * Hook para activar un documento (con optimistic update)
 */
export const useActivateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => activateDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      toast.success('Documento activado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al activar documento');
    },
  });
};

/**
 * Hook para desactivar un documento (con optimistic update)
 */
export const useDeactivateDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deactivateDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      toast.success('Documento desactivado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al desactivar documento');
    },
  });
};

/**
 * Hook para eliminar un documento
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentKeys.all });
      toast.success('Documento eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al eliminar documento');
    },
  });
};
