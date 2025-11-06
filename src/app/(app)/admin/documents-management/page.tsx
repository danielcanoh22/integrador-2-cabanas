 'use client';

import { useEffect, useMemo, useState } from 'react';
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

import {
  getUsers,
  updateUser,
  type ApiUser,
  getDocumentsPaged,
  createDocument,
  deleteDocument,
  activateDocument,
  deactivateDocument,
  type ApiDocument,
} from '@/services/documents';

type User = ApiUser;
type IdentityDocument = { id: number; number: string; active: boolean };

export default function DocumentsManagement() {
  const [activeTab, setActiveTab] = useState<'users' | 'documents'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [documents, setDocuments] = useState<IdentityDocument[]>([]);
  const [docNumber, setDocNumber] = useState('');
  const [docSearchTerm, setDocSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    const resp = await getUsers();
    setUsers(resp);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) =>
      [u.email, u.documentNumber, u.fullName, u.role]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

  const currentUsers = filteredUsers;

  const handleToggleActive = async (id: number, next: boolean) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;
    const updated = { ...current, active: next };
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    try {
      await updateUser(updated);
    } catch (e) {
      console.error('Error actualizando estado de usuario', e);
      // rollback
      setUsers((prev) => prev.map((u) => (u.id === id ? current : u)));
    }
  };

  const handleChangeRole = async (id: number, role: string) => {
    const current = users.find((u) => u.id === id);
    if (!current) return;
    const updated = { ...current, role } as User;
    // Optimistic update
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    try {
      await updateUser(updated);
    } catch (e) {
      console.error('Error actualizando rol de usuario', e);
      // rollback
      setUsers((prev) => prev.map((u) => (u.id === id ? current : u)));
    }
  };

  const mapApiToLocal = (d: ApiDocument): IdentityDocument => ({
    id: d.id,
    number: d.documentNumber,
    active: d.status === 'ACTIVE',
  });

  const fetchDocuments = async (page = currentPage) => {
    const resp = await getDocumentsPaged(page - 1, itemsPerPage);
    setDocuments(resp.content.map(mapApiToLocal));
    setTotalPages(Math.max(1, resp.totalPages || 1));
  };

  useEffect(() => {
    if (activeTab === 'documents') {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, currentPage]);

  const filteredDocuments = useMemo(() => {
    const q = docSearchTerm.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) => d.number.toLowerCase().includes(q));
  }, [documents, docSearchTerm]);

  const currentDocuments = filteredDocuments;

  const handleAddDocument = async () => {
    const value = docNumber.trim();
    if (!value) return;

    const exists = documents.some((d) => d.number.toLowerCase() === value.toLowerCase());
    if (exists) return;

    await createDocument(value);
    setDocNumber('');
    setCurrentPage(1);
    await fetchDocuments(1);
  };

  const handleToggleDocumentActive = async (id: number, next: boolean) => {
    if (next) {
      await activateDocument(id);
    } else {
      await deactivateDocument(id);
    }
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, active: next } : d)));
  };

  const handleDeleteDocument = async (id: number) => {
    await deleteDocument(id);
    if (documents.length === 1 && currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      await fetchDocuments(prevPage);
    } else {
      await fetchDocuments();
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold mb-2 text-primary-purple'>Administración</h1>
        <p className='text-muted-foreground'>Usuarios y Documentos</p>
      </div>

      <div className='flex items-center gap-2 mb-6'>
        <Button variant={activeTab === 'users' ? 'default' : 'secondary'} onClick={() => setActiveTab('users')}>
          Usuarios
        </Button>
        <Button variant={activeTab === 'documents' ? 'default' : 'secondary'} onClick={() => setActiveTab('documents')}>
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
                      <TableCell colSpan={6} className='text-center py-8 text-muted-foreground'>
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
                          <Select value={u.role} onValueChange={(val) => handleChangeRole(u.id, val)}>
                            <SelectTrigger className='w-[160px]'>
                              <SelectValue placeholder='Seleccionar rol' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='ADMIN'>ADMIN</SelectItem>
                              <SelectItem value='PROFESSOR'>PROFESSOR</SelectItem>
                              <SelectItem value='RETIREE'>RETIREE</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Switch checked={u.active} onCheckedChange={(v) => handleToggleActive(u.id, v)} />
                            <span className={u.active ? 'text-green-600' : 'text-muted-foreground'}>
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
              <CardTitle className='text-base'>Agregar/Habilitar documento</CardTitle>
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
                      <TableCell colSpan={4} className='text-center py-8 text-muted-foreground'>
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
                              onCheckedChange={(v) => handleToggleDocumentActive(doc.id, v)}
                            />
                            <span className={doc.active ? 'text-green-600' : 'text-muted-foreground'}>
                              {doc.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-right'>
                          <div className='flex items-center justify-end gap-2'>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant='destructive' size='sm' className='gap-2'>
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDocument(doc.id)}>
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
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className='cursor-pointer'
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
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
