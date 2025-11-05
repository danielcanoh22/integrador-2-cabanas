 'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  activateDocument,
  createDocument,
  deactivateDocument,
  deleteDocument,
  getDocumentsPaged,
  type ApiDocument,
} from '@/services/documents';

type IdentityDocument = {
  id: number;
  number: string;
  active: boolean;
};

export default function DocumentsManagement() {
  const [documents, setDocuments] = useState<IdentityDocument[]>([]);
  const [docNumber, setDocNumber] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

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
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const filteredDocuments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return documents;
    return documents.filter((d) => d.number.toLowerCase().includes(q));
  }, [documents, searchTerm]);

  const currentDocuments = filteredDocuments;

  const resetPagination = () => setCurrentPage(1);

  const handleAdd = async () => {
    const value = docNumber.trim();
    if (!value) return;

    const exists = documents.some((d) => d.number.toLowerCase() === value.toLowerCase());
    if (exists) return;

    await createDocument(value);
    setDocNumber('');
    setCurrentPage(1);
    await fetchDocuments(1);
  };

  const handleToggleActive = async (id: number, next: boolean) => {
    if (next) {
      await activateDocument(id);
    } else {
      await deactivateDocument(id);
    }
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, active: next } : d)));
  };

  const deleteDoc = async (id: number) => {
    await deleteDocument(id);
    // Si la página queda vacía y no es la primera, retroceder una página
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
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2 text-primary-purple'>
          Administrar Documentos de Identidad
        </h1>
        <p className='text-muted-foreground'>
          Administra los documentos válidos para el registro de usuarios
        </p>
      </div>

      <Card className='mb-6'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>Agregar nuevo documento</CardTitle>
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
            <Button onClick={handleAdd} className='gap-2'>
              <Plus className='h-4 w-4' />
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4' />
          <Input
            className='pl-10'
            placeholder='Buscar por número de documento'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              resetPagination();
            }}
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
                          onCheckedChange={(v) => handleToggleActive(doc.id, v)}
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
                              <Trash2 className='h-4 w-4' />
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar documento?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteDoc(doc.id)}>
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
    </div>
  );
}
