import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Inventory as AssetIcon,
  Build as MaintenanceIcon,
  SwapHoriz as TransferIcon,
  TrendingDown as DepreciationIcon,
  Delete as DisposeIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  fetchAssetFull,
  disposeAsset,
  fetchAssetCatalogs,
  clearCurrentAsset,
} from '../../store/slices/assetSlice';

const statusColors = {
  ACTIVE: 'success',
  IN_MAINTENANCE: 'warning',
  STORED: 'info',
  DISPOSED: 'default',
  SOLD: 'default',
  LOST: 'error',
  DAMAGED: 'error',
};

const statusLabels = {
  ACTIVE: 'Activo',
  IN_MAINTENANCE: 'En Mantenimiento',
  STORED: 'Almacenado',
  DISPOSED: 'Dado de Baja',
  SOLD: 'Vendido',
  LOST: 'Perdido',
  DAMAGED: 'Dañado',
};

const conditionLabels = {
  EXCELLENT: 'Excelente',
  GOOD: 'Bueno',
  FAIR: 'Regular',
  POOR: 'Malo',
};

const maintenanceTypeLabels = {
  PREVENTIVE: 'Preventivo',
  CORRECTIVE: 'Correctivo',
  PREDICTIVE: 'Predictivo',
  CALIBRATION: 'Calibración',
  INSPECTION: 'Inspección',
};

const maintenanceStatusLabels = {
  SCHEDULED: 'Programado',
  IN_PROGRESS: 'En Progreso',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const transferTypeLabels = {
  LOCATION: 'Cambio de Ubicación',
  EMPLOYEE: 'Asignación a Empleado',
  PROJECT: 'Asignación a Proyecto',
  DEPARTMENT: 'Asignación a Departamento',
  RETURN: 'Devolución',
};

const transferStatusLabels = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  IN_TRANSIT: 'En Tránsito',
  COMPLETED: 'Completado',
  CANCELLED: 'Cancelado',
};

const AssetDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentAsset, catalogs, loading, error } = useSelector((state) => state.assets);

  const [activeTab, setActiveTab] = useState(0);
  const [disposeDialogOpen, setDisposeDialogOpen] = useState(false);
  const [disposeData, setDisposeData] = useState({
    disposalMethod: 'SCRAPPED',
    disposalDate: new Date().toISOString().split('T')[0],
    disposalAmount: '',
    disposalNotes: '',
  });

  useEffect(() => {
    dispatch(fetchAssetCatalogs());
    dispatch(fetchAssetFull(id));

    return () => {
      dispatch(clearCurrentAsset());
    };
  }, [dispatch, id]);

  const formatCurrency = (value, currency = 'USD') => {
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('es-VE');
  };

  const handleDisposeAsset = async () => {
    try {
      await dispatch(disposeAsset({ id, data: disposeData })).unwrap();
      setDisposeDialogOpen(false);
      dispatch(fetchAssetFull(id));
    } catch (err) {
      console.error('Error disposing asset:', err);
    }
  };

  if (loading || !currentAsset) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderInfoTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Información General
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={4}><Typography color="text.secondary">Código:</Typography></Grid>
              <Grid item xs={8}><Typography fontWeight="bold">{currentAsset.code}</Typography></Grid>
              <Grid item xs={4}><Typography color="text.secondary">Nombre:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentAsset.name}</Typography></Grid>
              <Grid item xs={4}><Typography color="text.secondary">Categoría:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentAsset.category?.name}</Typography></Grid>
              <Grid item xs={4}><Typography color="text.secondary">Marca:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentAsset.brand || '-'}</Typography></Grid>
              <Grid item xs={4}><Typography color="text.secondary">Modelo:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentAsset.model || '-'}</Typography></Grid>
              <Grid item xs={4}><Typography color="text.secondary">Serie:</Typography></Grid>
              <Grid item xs={8}><Typography>{currentAsset.serialNumber || '-'}</Typography></Grid>
              <Grid item xs={4}><Typography color="text.secondary">Estado:</Typography></Grid>
              <Grid item xs={8}>
                <Chip label={statusLabels[currentAsset.status]} color={statusColors[currentAsset.status]} size="small" />
              </Grid>
              <Grid item xs={4}><Typography color="text.secondary">Condición:</Typography></Grid>
              <Grid item xs={8}>
                <Chip label={conditionLabels[currentAsset.condition]} size="small" variant="outlined" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <DepreciationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Valores y Depreciación
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}><Typography color="text.secondary">Costo Adquisición:</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight="bold">{formatCurrency(currentAsset.acquisitionCost, currentAsset.currency)}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Depreciación Acum.:</Typography></Grid>
              <Grid item xs={6}><Typography color="error">{formatCurrency(currentAsset.accumulatedDepreciation, currentAsset.currency)}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Valor en Libros:</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight="bold" color="primary">{formatCurrency(currentAsset.bookValue, currentAsset.currency)}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Valor Residual:</Typography></Grid>
              <Grid item xs={6}><Typography>{formatCurrency(currentAsset.salvageValue, currentAsset.currency)}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Método:</Typography></Grid>
              <Grid item xs={6}><Typography>{catalogs?.depreciationMethods?.find(m => m.value === currentAsset.depreciationMethod)?.label}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Vida Útil:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentAsset.usefulLifeYears} años</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Inicio Deprec.:</Typography></Grid>
              <Grid item xs={6}><Typography>{formatDate(currentAsset.depreciationStartDate)}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Adquisición
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}><Typography color="text.secondary">Fecha:</Typography></Grid>
              <Grid item xs={6}><Typography>{formatDate(currentAsset.acquisitionDate)}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Proveedor:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentAsset.supplier?.name || '-'}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Factura:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentAsset.invoiceNumber || '-'}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ubicación y Asignación
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={6}><Typography color="text.secondary">Ubicación:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentAsset.location?.name || currentAsset.locationDescription || '-'}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Empleado:</Typography></Grid>
              <Grid item xs={6}>
                <Typography>
                  {currentAsset.assignedToEmployee 
                    ? `${currentAsset.assignedToEmployee.firstName} ${currentAsset.assignedToEmployee.lastName}` 
                    : '-'}
                </Typography>
              </Grid>
              <Grid item xs={6}><Typography color="text.secondary">Proyecto:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentAsset.assignedToProject?.name || '-'}</Typography></Grid>
              <Grid item xs={6}><Typography color="text.secondary">Departamento:</Typography></Grid>
              <Grid item xs={6}><Typography>{currentAsset.assignedToDepartment?.name || '-'}</Typography></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {currentAsset.warrantyExpiry && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Garantía
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={6}><Typography color="text.secondary">Vencimiento:</Typography></Grid>
                <Grid item xs={6}><Typography>{formatDate(currentAsset.warrantyExpiry)}</Typography></Grid>
                <Grid item xs={12}><Typography color="text.secondary">Notas:</Typography></Grid>
                <Grid item xs={12}><Typography>{currentAsset.warrantyNotes || '-'}</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      )}

      {currentAsset.notes && (
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notas</Typography>
              <Typography>{currentAsset.notes}</Typography>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );

  const renderMaintenancesTab = () => (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6">Historial de Mantenimientos</Typography>
        <Button
          variant="contained"
          startIcon={<MaintenanceIcon />}
          onClick={() => navigate(`/assets/maintenances/new?assetId=${id}`)}
          disabled={['DISPOSED', 'SOLD'].includes(currentAsset.status)}
          fullWidth={isMobile}
        >
          Nuevo Mantenimiento
        </Button>
      </Box>
      {currentAsset.maintenances?.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No hay mantenimientos registrados</Typography>
        </Paper>
      ) : isMobile ? (
        <Box>
          {currentAsset.maintenances?.map((m) => (
            <Card key={m.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {maintenanceTypeLabels[m.maintenanceType]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(m.scheduledDate || m.completedDate)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={maintenanceStatusLabels[m.status]} 
                    size="small"
                    color={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                  />
                </Box>
                <Typography variant="body2" sx={{ mb: 1 }}>{m.description?.substring(0, 80)}...</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {m.serviceProvider?.name || m.serviceProviderName || '-'}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary">
                    {formatCurrency(m.totalCost)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell align="right">Costo</TableCell>
                <TableCell>Proveedor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAsset.maintenances?.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>{formatDate(m.scheduledDate || m.completedDate)}</TableCell>
                  <TableCell>{maintenanceTypeLabels[m.maintenanceType]}</TableCell>
                  <TableCell>{m.description?.substring(0, 50)}...</TableCell>
                  <TableCell>
                    <Chip 
                      label={maintenanceStatusLabels[m.status]} 
                      size="small"
                      color={m.status === 'COMPLETED' ? 'success' : m.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(m.totalCost)}</TableCell>
                  <TableCell>{m.serviceProvider?.name || m.serviceProviderName || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderTransfersTab = () => (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Typography variant="h6">Historial de Transferencias</Typography>
        <Button
          variant="contained"
          startIcon={<TransferIcon />}
          onClick={() => navigate(`/assets/transfers/new?assetId=${id}`)}
          disabled={['DISPOSED', 'SOLD'].includes(currentAsset.status)}
          fullWidth={isMobile}
        >
          Nueva Transferencia
        </Button>
      </Box>
      {currentAsset.transfers?.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">No hay transferencias registradas</Typography>
        </Paper>
      ) : isMobile ? (
        <Box>
          {currentAsset.transfers?.map((t) => (
            <Card key={t.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {transferTypeLabels[t.transferType]}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(t.transferDate)}
                    </Typography>
                  </Box>
                  <Chip 
                    label={transferStatusLabels[t.status]} 
                    size="small"
                    color={t.status === 'COMPLETED' ? 'success' : t.status === 'PENDING' ? 'warning' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">
                    {t.fromEmployee ? `${t.fromEmployee.firstName} ${t.fromEmployee.lastName}` :
                     t.fromProject?.name || t.fromLocation?.name || '-'}
                  </Typography>
                  <TransferIcon fontSize="small" color="action" />
                  <Typography variant="body2">
                    {t.toEmployee ? `${t.toEmployee.firstName} ${t.toEmployee.lastName}` :
                     t.toProject?.name || t.toLocation?.name || '-'}
                  </Typography>
                </Box>
                {t.reason && (
                  <Typography variant="body2" color="text.secondary">
                    {t.reason?.substring(0, 60)}...
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Desde</TableCell>
                <TableCell>Hacia</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Motivo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentAsset.transfers?.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>{formatDate(t.transferDate)}</TableCell>
                  <TableCell>{transferTypeLabels[t.transferType]}</TableCell>
                  <TableCell>
                    {t.fromEmployee ? `${t.fromEmployee.firstName} ${t.fromEmployee.lastName}` :
                     t.fromProject?.name || t.fromLocation?.name || '-'}
                  </TableCell>
                  <TableCell>
                    {t.toEmployee ? `${t.toEmployee.firstName} ${t.toEmployee.lastName}` :
                     t.toProject?.name || t.toLocation?.name || '-'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={transferStatusLabels[t.status]} 
                      size="small"
                      color={t.status === 'COMPLETED' ? 'success' : t.status === 'PENDING' ? 'warning' : 'default'}
                    />
                  </TableCell>
                  <TableCell>{t.reason?.substring(0, 30) || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );

  const renderDepreciationsTab = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Historial de Depreciación</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Período</TableCell>
              <TableCell align="right">Valor Inicial</TableCell>
              <TableCell align="right">Depreciación</TableCell>
              <TableCell align="right">Valor Final</TableCell>
              <TableCell align="right">Acumulada</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAsset.depreciations?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No hay depreciaciones registradas
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              currentAsset.depreciations?.map((d) => (
                <TableRow key={d.id} hover>
                  <TableCell>{`${d.month}/${d.year}`}</TableCell>
                  <TableCell align="right">{formatCurrency(d.openingBookValue)}</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>
                    -{formatCurrency(d.depreciationAmount)}
                  </TableCell>
                  <TableCell align="right">{formatCurrency(d.closingBookValue)}</TableCell>
                  <TableCell align="right">{formatCurrency(d.closingAccumulatedDepreciation)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={d.status === 'POSTED' ? 'Contabilizado' : 'Calculado'} 
                      size="small"
                      color={d.status === 'POSTED' ? 'success' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/assets')} sx={{ mr: 2 }}>
            Volver
          </Button>
          <Typography variant="h4" component="h1">
            <AssetIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            {currentAsset.code}
          </Typography>
          <Chip 
            label={statusLabels[currentAsset.status]} 
            color={statusColors[currentAsset.status]} 
            sx={{ ml: 2 }}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/assets/${id}/edit`)}
            disabled={['DISPOSED', 'SOLD'].includes(currentAsset.status)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DisposeIcon />}
            onClick={() => setDisposeDialogOpen(true)}
            disabled={['DISPOSED', 'SOLD'].includes(currentAsset.status)}
          >
            Dar de Baja
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} variant="scrollable">
          <Tab label="Información" icon={<InfoIcon />} iconPosition="start" />
          <Tab label="Mantenimientos" icon={<MaintenanceIcon />} iconPosition="start" />
          <Tab label="Transferencias" icon={<TransferIcon />} iconPosition="start" />
          <Tab label="Depreciación" icon={<DepreciationIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && renderInfoTab()}
        {activeTab === 1 && renderMaintenancesTab()}
        {activeTab === 2 && renderTransfersTab()}
        {activeTab === 3 && renderDepreciationsTab()}
      </Box>

      {/* Dialog para dar de baja */}
      <Dialog open={disposeDialogOpen} onClose={() => setDisposeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Dar de Baja Activo</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta acción marcará el activo como dado de baja y no podrá ser revertida.
          </Alert>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Método de Disposición</InputLabel>
                <Select
                  value={disposeData.disposalMethod}
                  label="Método de Disposición"
                  onChange={(e) => setDisposeData({ ...disposeData, disposalMethod: e.target.value })}
                >
                  {catalogs?.disposalMethods?.map((m) => (
                    <MenuItem key={m.value} value={m.value}>
                      {m.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Fecha de Disposición"
                value={disposeData.disposalDate}
                onChange={(e) => setDisposeData({ ...disposeData, disposalDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            {disposeData.disposalMethod === 'SOLD' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Monto de Venta"
                  value={disposeData.disposalAmount}
                  onChange={(e) => setDisposeData({ ...disposeData, disposalAmount: e.target.value })}
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notas"
                value={disposeData.disposalNotes}
                onChange={(e) => setDisposeData({ ...disposeData, disposalNotes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDisposeDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDisposeAsset}>
            Confirmar Baja
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssetDetail;
