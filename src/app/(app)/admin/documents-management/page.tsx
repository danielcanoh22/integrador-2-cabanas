'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { User } from '@/types/user';
import { Document } from '@/types/document';
import {
  useUsers,
  useUpdateUser,
  useDocuments,
  useCreateDocument,
  useDeleteDocument,
  useActivateDocument,
  useDeactivateDocument,
} from '@/hooks/useDocuments';

type IdentityDocument = { id: number; number: string; active: boolean };

export default function DocumentsManagement() {
  const [activeTab, setActiveTab] = useState<'users' | 'documents'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [docNumber, setDocNumber] = useState('');
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: users = [] } = useUsers();
  const updateUserMutation = useUpdateUser();
  const { data: documentsData } = useDocuments(currentPage - 1, itemsPerPage);
  const createDocumentMutation = useCreateDocument();
  const deleteDocumentMutation = useDeleteDocument();
  const activateDocumentMutation = useActivateDocument();
  const deactivateDocumentMutation = useDeactivateDocument();

  const documents = useMemo(() => {
    const mapApiToLocal = (d: Document): IdentityDocument => ({
      id: d.id,
      number: d.documentNumber,
      active: d.status === 'ACTIVE',
    });
    return documentsData?.content.map(mapApiToLocal) || [];
  }, [documentsData]);

  const totalPages = Math.max(1, documentsData?.totalPages || 1);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [u.email, u.documentNumber, u.fullName, u.role]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const currentUsers = filteredUsers;

  const handleToggleActive = (id: number, next: boolean) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;
    const updated = { ...current, active: next };
    updateUserMutation.mutate(updated);
  };

  const handleChangeRole = (id: number, role: string) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;
    const updated = { ...current, role } as User;
    updateUserMutation.mutate(updated);
  };

  const filteredDocuments = useMemo(() => {
    const q = docSearchTerm.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) => d.number.toLowerCase().includes(q));
  }, [documents, docSearchTerm]);

  const currentDocuments = filteredDocuments;

  const handleAddDocument = () => {
    const value = docNumber.trim();
    if (!value) return;

    const exists = documents.some(
      (d) => d.number.toLowerCase() === value.toLowerCase()
    );
    if (exists) {
      alert('El documento ya existe');
      return;
    }

    createDocumentMutation.mutate(value, {
      onSuccess: () => {
        setDocNumber('');
        setCurrentPage(1);
      },
    });
  };

  const handleToggleDocumentActive = (id: number, next: boolean) => {
    if (next) {
      activateDocumentMutation.mutate(id);
    } else {
      deactivateDocumentMutation.mutate(id);
    }
  };

  const handleDeleteDocument = (id: number) => {
    deleteDocumentMutation.mutate(id, {
      onSuccess: () => {
        if (documents.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      },
    });
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2 text-primary-purple'>
          Administración
        </h1>
        <p className='text-muted-foreground'>Usuarios y Documentos</p>
      </div>

      <div className='flex items-center gap-2 mb-6'>
        <Button
          variant={activeTab === 'users' ? 'default' : 'secondary'}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </Button>
        <Button
          variant={activeTab === 'documents' ? 'default' : 'secondary'}
          onClick={() => setActiveTab('documents')}
        >
          Documentos
        </Button>
      </div>

      {activeTab === 'users' && (
        <>
          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                className='pl-10'
                placeholder='Buscar por email, documento, nombre o rol'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className='w-40'>
                <SelectValue placeholder='Filtrar por rol' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ALL'>Todos los roles</SelectItem>
                <SelectItem value='ADMIN'>Administrador</SelectItem>
                <SelectItem value='PROFESSOR'>Profesor</SelectItem>
                <SelectItem value='RETIREE'>Jubilado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[100px]'>ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead>Nombre completo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead className='w-[140px]'>Activo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className='text-center py-8 text-muted-foreground'
                      >
                        No hay usuarios
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className='font-medium'>#{u.id}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>{u.documentNumber}</TableCell>
                        <TableCell>{u.fullName}</TableCell>
                        <TableCell>
                          <Select
                            value={u.role}
                            onValueChange={(val) => handleChangeRole(u.id, val)}
                          >
                            <SelectTrigger className='w-40'>
                              <SelectValue placeholder='Seleccionar rol' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='ADMIN'>ADMIN</SelectItem>
                              <SelectItem value='PROFESSOR'>
                                PROFESSOR
                              </SelectItem>
                              <SelectItem value='RETIREE'>RETIREE</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Switch
                              checked={u.active}
                              onCheckedChange={(v) =>
                                handleToggleActive(u.id, v)
                              }
                            />
                            <span
                              className={
                                u.active
                                  ? 'text-green-600'
                                  : 'text-muted-foreground'
                              }
                            >
                              {u.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'documents' && (
        <>
          <Card className='mb-6'>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base'>
                Agregar/Habilitar documento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='flex flex-col md:flex-row gap-3'>
                <div className='relative flex-1'>
                  <Input
                    placeholder='Número de documento'
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddDocument} className='gap-2'>
                  Habilitar
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className='flex flex-col sm:flex-row gap-4 mb-6'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                className='pl-10'
                placeholder='Buscar por número de documento (solo BD)'
                value={docSearchTerm}
                onChange={(e) => setDocSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className='p-0'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[140px]'>ID</TableHead>
                    <TableHead>Documento</TableHead>
                    <TableHead className='w-[180px]'>Estado</TableHead>
                    <TableHead className='w-[220px]'>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className='text-center py-8 text-muted-foreground'
                      >
                        No hay documentos
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className='font-medium'>#{doc.id}</TableCell>
                        <TableCell>{doc.number}</TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Switch
                              checked={doc.active}
                              onCheckedChange={(v) =>
                                handleToggleDocumentActive(doc.id, v)
                              }
                            />
                            <span
                              className={
                                doc.active
                                  ? 'text-green-600'
                                  : 'text-muted-foreground'
                              }
                            >
                              {doc.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant='destructive'
                                  size='sm'
                                  className='gap-2'
                                >
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    ¿Eliminar documento?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteDocument(doc.id)}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {totalPages > 1 && (
            <div className='mt-6'>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? 'pointer-events-none opacity-50'
                          : 'cursor-pointer'
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
