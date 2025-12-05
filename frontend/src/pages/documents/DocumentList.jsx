import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  CardActions,
  Pagination,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Description as DocumentIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

import { fetchDocuments, fetchDocumentCatalogs, fetchCategories, deleteDocument } from '../../store/slices/documentSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const statusColors = {
  DRAFT: 'default',
  PENDING_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'error',
  EXPIRED: 'error',
  ARCHIVED: 'info',
  CANCELLED: 'default',
};

const statusLabels = {
  DRAFT: 'Borrador',
  PENDING_REVIEW: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  EXPIRED: 'Vencido',
  ARCHIVED: 'Archivado',
  CANCELLED: 'Cancelado',
};

const DocumentList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { documents, documentsPagination, documentsLoading, catalogs, categories } = useSelector((state) => state.documents);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    documentType: searchParams.get('documentType') || '',
    categoryId: searchParams.get('categoryId') || '',
  });
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchDocumentCatalogs());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const params = {
      page,
      limit: 10,
      search: search || undefined,
      status: filters.status || undefined,
      documentType: filters.documentType || undefined,
      categoryId: filters.categoryId || undefined,
    };
    dispatch(fetchDocuments(params));
  }, [dispatch, page, search, filters]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setFilters({ status: '', documentType: '', categoryId: '' });
    setPage(1);
  };

  const handleMenuOpen = (event, doc) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  const handleDelete = async () => {
    if (selectedDoc) {
      await dispatch(deleteDocument(selectedDoc.id));
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const hasActiveFilters = search || filters.status || filters.documentType || filters.categoryId;

  // Desktop Table View
  const TableView = () => (
    <Paper sx={{ overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: theme.palette.grey[100] }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Código</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Título</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Categoría</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Vencimiento</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr 
                key={doc.id} 
                style={{ borderBottom: `1px solid ${theme.palette.divider}` }}
                onDoubleClick={() => navigate(`/documents/${doc.id}`)}
              >
                <td style={{ padding: '12px 16px' }}>
                  <Typography variant="body2" fontWeight="medium">{doc.code}</Typography>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Typography variant="body2">{doc.title}</Typography>
                  {doc.description && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                      {doc.description.substring(0, 50)}...
                    </Typography>
                  )}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Typography variant="body2">{doc.document_type?.replace(/_/g, ' ')}</Typography>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Typography variant="body2">{doc.category?.name || '-'}</Typography>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <Chip 
                    label={statusLabels[doc.status] || doc.status} 
                    color={statusColors[doc.status]} 
                    size="small"
                  />
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {doc.expiry_date ? (
                    <Typography 
                      variant="body2" 
                      color={new Date(doc.expiry_date) < new Date() ? 'error' : 'text.primary'}
                    >
                      {new Date(doc.expiry_date).toLocaleDateString()}
                    </Typography>
                  ) : '-'}
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <Tooltip title="Ver">
                    <IconButton size="small" onClick={() => navigate(`/documents/${doc.id}`)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => navigate(`/documents/${doc.id}/edit`)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, doc)}>
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </td>
              </tr>
            ))}
            {documents.length === 0 && !documentsLoading && (
              <tr>
                <td colSpan={7} style={{ padding: '32px', textAlign: 'center' }}>
                  <DocumentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography color="text.secondary">
                    No se encontraron documentos
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Paper>
  );

  // Mobile Card View
  const CardView = () => (
    <Grid container spacing={2}>
      {documents.map((doc) => (
        <Grid item xs={12} key={doc.id}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    {doc.code}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {doc.title}
                  </Typography>
                </Box>
                <Chip 
                  label={statusLabels[doc.status] || doc.status} 
                  color={statusColors[doc.status]} 
                  size="small"
                />
              </Box>
              
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Tipo</Typography>
                  <Typography variant="body2">{doc.document_type?.replace(/_/g, ' ')}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Categoría</Typography>
                  <Typography variant="body2">{doc.category?.name || '-'}</Typography>
                </Grid>
                {doc.expiry_date && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">Vencimiento</Typography>
                    <Typography 
                      variant="body2" 
                      color={new Date(doc.expiry_date) < new Date() ? 'error' : 'text.primary'}
                    >
                      {new Date(doc.expiry_date).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate(`/documents/${doc.id}`)}>
                Ver
              </Button>
              <Button size="small" onClick={() => navigate(`/documents/${doc.id}/edit`)}>
                Editar
              </Button>
              <IconButton size="small" onClick={(e) => handleMenuOpen(e, doc)} sx={{ ml: 'auto' }}>
                <MoreIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Grid>
      ))}
      {documents.length === 0 && !documentsLoading && (
        <Grid item xs={12}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <DocumentIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography color="text.secondary">
              No se encontraron documentos
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h4" fontWeight="bold">
          Documentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/documents/new')}
        >
          Nuevo Documento
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Buscar por código, título..."
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select
                value={filters.status}
                label="Estado"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {catalogs?.statuses?.map((s) => (
                  <MenuItem key={s.code} value={s.code}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo</InputLabel>
              <Select
                value={filters.documentType}
                label="Tipo"
                onChange={(e) => handleFilterChange('documentType', e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {catalogs?.documentTypes?.map((t) => (
                  <MenuItem key={t.code} value={t.code}>{t.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={filters.categoryId}
                label="Categoría"
                onChange={(e) => handleFilterChange('categoryId', e.target.value)}
              >
                <MenuItem value="">Todas</MenuItem>
                {categories?.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {hasActiveFilters && (
            <Grid item xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
              >
                Limpiar
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* Loading */}
      {documentsLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Content */}
      {!documentsLoading && (
        <>
          {isMobile ? <CardView /> : <TableView />}

          {/* Pagination */}
          {documentsPagination && documentsPagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={documentsPagination.totalPages}
                page={page}
                onChange={(e, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate(`/documents/${selectedDoc?.id}`); handleMenuClose(); }}>
          <ViewIcon fontSize="small" sx={{ mr: 1 }} /> Ver Detalle
        </MenuItem>
        <MenuItem onClick={() => { navigate(`/documents/${selectedDoc?.id}/edit`); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); }} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Documento"
        message={`¿Está seguro de eliminar el documento "${selectedDoc?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteDialogOpen(false); handleMenuClose(); }}
        confirmText="Eliminar"
        confirmColor="error"
      />
    </Box>
  );
};

export default DocumentList;
