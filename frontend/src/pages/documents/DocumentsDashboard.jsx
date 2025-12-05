import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Description as DocumentIcon,
  Folder as CategoryIcon,
  Warning as ExpiringIcon,
  CheckCircle as ApprovedIcon,
  HourglassEmpty as PendingIcon,
  Archive as ArchivedIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

import { fetchDocumentStats, fetchExpiringDocuments, fetchCategories } from '../../store/slices/documentSlice';

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

const DocumentsDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { stats, statsLoading, expiringDocuments, expiringLoading, categories } = useSelector((state) => state.documents);

  useEffect(() => {
    dispatch(fetchDocumentStats());
    dispatch(fetchExpiringDocuments(30));
    dispatch(fetchCategories());
  }, [dispatch]);

  if (statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Gestión de Documentos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Control y seguimiento de documentos corporativos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/documents/new')}
        >
          Nuevo Documento
        </Button>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Documents */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary.main">
                    {stats?.total || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Documentos
                  </Typography>
                </Box>
                <DocumentIcon sx={{ fontSize: 48, color: 'primary.light' }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/documents')}>
                Ver todos
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Approved */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {stats?.byStatus?.APPROVED || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Aprobados
                  </Typography>
                </Box>
                <ApprovedIcon sx={{ fontSize: 48, color: 'success.light' }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/documents?status=APPROVED')}>
                Ver aprobados
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Pending Review */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {stats?.byStatus?.PENDING_REVIEW || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Pendientes de Revisión
                  </Typography>
                </Box>
                <PendingIcon sx={{ fontSize: 48, color: 'warning.light' }} />
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => navigate('/documents?status=PENDING_REVIEW')}>
                Ver pendientes
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* Expiring Soon */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: stats?.expiring > 0 ? 'error.light' : 'inherit' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" color={stats?.expiring > 0 ? 'error.dark' : 'text.primary'}>
                    {stats?.expiring || 0}
                  </Typography>
                  <Typography variant="body2" color={stats?.expiring > 0 ? 'error.dark' : 'text.secondary'}>
                    Próximos a Vencer
                  </Typography>
                </Box>
                <ExpiringIcon sx={{ fontSize: 48, color: stats?.expiring > 0 ? 'error.dark' : 'warning.light' }} />
              </Box>
              {stats?.expired > 0 && (
                <Chip 
                  label={`${stats.expired} vencidos`} 
                  color="error" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color={stats?.expiring > 0 ? 'inherit' : 'primary'} onClick={() => navigate('/documents?expiring=true')}>
                Ver alertas
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Documents by Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Documentos por Estado
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense>
              {Object.entries(stats?.byStatus || {}).map(([status, count]) => (
                <ListItem 
                  key={status}
                  secondaryAction={
                    <Chip label={count} size="small" color={statusColors[status]} />
                  }
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/documents?status=${status}`)}
                >
                  <ListItemText primary={statusLabels[status] || status} />
                </ListItem>
              ))}
              {Object.keys(stats?.byStatus || {}).length === 0 && (
                <ListItem>
                  <ListItemText primary="Sin documentos registrados" secondary="Crea tu primer documento" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Documents by Type */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Documentos por Tipo
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {Object.entries(stats?.byType || {}).slice(0, 8).map(([type, count]) => (
                <ListItem 
                  key={type}
                  secondaryAction={
                    <Chip label={count} size="small" variant="outlined" />
                  }
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/documents?documentType=${type}`)}
                >
                  <ListItemText primary={type.replace(/_/g, ' ')} />
                </ListItem>
              ))}
              {Object.keys(stats?.byType || {}).length === 0 && (
                <ListItem>
                  <ListItemText primary="Sin documentos registrados" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Expiring Documents */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Documentos Próximos a Vencer
              </Typography>
              <ScheduleIcon color="warning" />
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {expiringDocuments?.slice(0, 5).map((doc) => (
                <ListItem 
                  key={doc.id}
                  secondaryAction={
                    <Chip 
                      label={new Date(doc.expiry_date).toLocaleDateString()} 
                      size="small" 
                      color="warning"
                    />
                  }
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/documents/${doc.id}`)}
                >
                  <ListItemIcon>
                    <DocumentIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc.title} 
                    secondary={doc.code}
                  />
                </ListItem>
              ))}
              {(!expiringDocuments || expiringDocuments.length === 0) && (
                <ListItem>
                  <ListItemText 
                    primary="Sin documentos próximos a vencer" 
                    secondary="Todos los documentos están al día"
                  />
                </ListItem>
              )}
            </List>
            {expiringDocuments?.length > 5 && (
              <Button fullWidth onClick={() => navigate('/documents?expiring=true')}>
                Ver todos ({expiringDocuments.length})
              </Button>
            )}
          </Paper>
        </Grid>

        {/* Categories */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Categorías
              </Typography>
              <Button size="small" onClick={() => navigate('/documents/categories')}>
                Gestionar
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
              {categories?.slice(0, 8).map((cat) => (
                <ListItem 
                  key={cat.id}
                  secondaryAction={
                    <Chip 
                      label={cat.documents?.length || 0} 
                      size="small" 
                      variant="outlined"
                    />
                  }
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/documents?categoryId=${cat.id}`)}
                >
                  <ListItemIcon>
                    <CategoryIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={cat.name} 
                    secondary={cat.module}
                  />
                </ListItem>
              ))}
              {(!categories || categories.length === 0) && (
                <ListItem>
                  <ListItemText 
                    primary="Sin categorías" 
                    secondary="Crea categorías para organizar documentos"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/documents/new')}
                  sx={{ py: 2 }}
                >
                  Nuevo Documento
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<CategoryIcon />}
                  onClick={() => navigate('/documents/categories/new')}
                  sx={{ py: 2 }}
                >
                  Nueva Categoría
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PendingIcon />}
                  onClick={() => navigate('/documents?status=PENDING_REVIEW')}
                  sx={{ py: 2 }}
                >
                  Revisar Pendientes
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ExpiringIcon />}
                  onClick={() => navigate('/documents?expiring=true')}
                  sx={{ py: 2 }}
                >
                  Ver Vencimientos
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ArchivedIcon />}
                  onClick={() => navigate('/documents?status=ARCHIVED')}
                  sx={{ py: 2 }}
                >
                  Archivados
                </Button>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DocumentIcon />}
                  onClick={() => navigate('/documents')}
                  sx={{ py: 2 }}
                >
                  Ver Todos
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DocumentsDashboard;
