import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Divider,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Add as AddIcon,
  LocalGasStation as TankIcon,
} from '@mui/icons-material';
import { fetchTankById, fetchGaugingsByTank, createGauging, clearCurrentTank, clearGaugings } from '../../../store/slices/logisticsSlice';

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const TankDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentTank, gaugings, gaugingsPagination, loading } = useSelector((state) => state.logistics);

  const [tabValue, setTabValue] = useState(0);
  const [gaugingDialog, setGaugingDialog] = useState(false);
  const [gaugingForm, setGaugingForm] = useState({
    volume: '',
    temperature: '',
    api_gravity: '',
    bsw: '',
    level_inches: '',
    gauging_method: 'MANUAL',
    notes: '',
  });

  useEffect(() => {
    dispatch(fetchTankById(id));
    dispatch(fetchGaugingsByTank({ tankId: id }));
    return () => {
      dispatch(clearCurrentTank());
      dispatch(clearGaugings());
    };
  }, [dispatch, id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleGaugingSubmit = async () => {
    const data = {
      tank_id: id,
      gauging_datetime: new Date().toISOString(),
      volume: parseFloat(gaugingForm.volume) || 0,
      temperature: gaugingForm.temperature ? parseFloat(gaugingForm.temperature) : null,
      api_gravity: gaugingForm.api_gravity ? parseFloat(gaugingForm.api_gravity) : null,
      bsw: gaugingForm.bsw ? parseFloat(gaugingForm.bsw) : null,
      level_inches: gaugingForm.level_inches ? parseFloat(gaugingForm.level_inches) : null,
      gauging_method: gaugingForm.gauging_method,
      notes: gaugingForm.notes,
    };
    await dispatch(createGauging(data));
    setGaugingDialog(false);
    setGaugingForm({
      volume: '',
      temperature: '',
      api_gravity: '',
      bsw: '',
      level_inches: '',
      gauging_method: 'MANUAL',
      notes: '',
    });
    dispatch(fetchTankById(id));
    dispatch(fetchGaugingsByTank({ tankId: id }));
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      MAINTENANCE: 'warning',
      OUT_OF_SERVICE: 'error',
      DECOMMISSIONED: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      CRUDE: 'primary',
      WATER: 'info',
      DIESEL: 'warning',
      CHEMICALS: 'error',
      GAS: 'secondary',
      CONDENSATE: 'success',
    };
    return colors[type] || 'default';
  };

  const getCapacityPercentage = () => {
    if (!currentTank?.capacity || currentTank.capacity === 0) return 0;
    return (parseFloat(currentTank.current_volume || 0) / parseFloat(currentTank.capacity)) * 100;
  };

  if (loading && !currentTank) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!currentTank) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>{t('common.notFound')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        mb: 3, 
        gap: 2 
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/logistics/tanks')} fullWidth={isMobile}>
            {t('common.back')}
          </Button>
          <Typography variant={isMobile ? 'h5' : 'h4'} component="h1">
            {currentTank.code}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Chip label={currentTank.type} color={getTypeColor(currentTank.type)} size={isMobile ? 'small' : 'medium'} />
            <Chip label={currentTank.status} color={getStatusColor(currentTank.status)} size={isMobile ? 'small' : 'medium'} />
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/logistics/tanks/${id}/edit`)}
          fullWidth={isMobile}
        >
          {t('common.edit')}
        </Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <TankIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                <Box>
                  <Typography variant="h5">{currentTank.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {currentTank.location || t('common.noLocation')}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">{t('logistics.field')}</Typography>
                  <Typography variant="body1">{currentTank.field?.name || '-'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">{t('logistics.lastGauging')}</Typography>
                  <Typography variant="body1">
                    {currentTank.last_gauging_date 
                      ? new Date(currentTank.last_gauging_date).toLocaleDateString() 
                      : '-'}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>{t('logistics.tankCapacity')}</Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h4">
                    {parseFloat(currentTank.current_volume || 0).toLocaleString()} bbl
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    / {parseFloat(currentTank.capacity || 0).toLocaleString()} bbl
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={Math.min(getCapacityPercentage(), 100)} 
                  color={getCapacityPercentage() > 80 ? 'error' : 'primary'}
                  sx={{ height: 16, borderRadius: 8 }}
                />
                <Typography variant="body2" align="right" sx={{ mt: 0.5 }}>
                  {getCapacityPercentage().toFixed(1)}% {t('logistics.full')}
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">{t('logistics.diameter')}</Typography>
                  <Typography variant="body1">{currentTank.diameter_ft || '-'} ft</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">{t('logistics.height')}</Typography>
                  <Typography variant="body1">{currentTank.height_ft || '-'} ft</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs - Select en mobile, Tabs en desktop */}
      <Card>
        {isMobile ? (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth>
              <InputLabel>{t('common.section')}</InputLabel>
              <Select
                value={tabValue}
                label={t('common.section')}
                onChange={(e) => setTabValue(e.target.value)}
              >
                <MenuItem value={0}>{t('logistics.gaugingHistory')}</MenuItem>
                <MenuItem value={1}>{t('common.notes')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        ) : (
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="standard"
          >
            <Tab label={t('logistics.gaugingHistory')} />
            <Tab label={t('common.notes')} />
          </Tabs>
        )}
        <Divider />
        <CardContent>
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setGaugingDialog(true)}
                fullWidth={isMobile}
              >
                {t('logistics.newGauging')}
              </Button>
            </Box>
            {isMobile ? (
              <Box>
                {gaugings.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">{t('common.noData')}</Typography>
                  </Paper>
                ) : (
                  gaugings.map((gauging) => (
                    <Card key={gauging.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent sx={{ pb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {parseFloat(gauging.volume || 0).toLocaleString()} bbl
                          </Typography>
                          <Chip label={gauging.gauging_method} size="small" />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {new Date(gauging.gauging_datetime).toLocaleString()}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">{t('logistics.temperature')}</Typography>
                            <Typography variant="body2">{gauging.temperature ? `${gauging.temperature}°F` : '-'}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">{t('logistics.apiGravity')}</Typography>
                            <Typography variant="body2">{gauging.api_gravity ? `${gauging.api_gravity}°` : '-'}</Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography variant="caption" color="text.secondary">{t('logistics.bsw')}</Typography>
                            <Typography variant="body2">{gauging.bsw ? `${gauging.bsw}%` : '-'}</Typography>
                          </Grid>
                        </Grid>
                        {gauging.gauger?.username && (
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            {t('logistics.gaugedBy')}: {gauging.gauger.username}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </Box>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.date')}</TableCell>
                      <TableCell align="right">{t('logistics.volume')}</TableCell>
                      <TableCell align="right">{t('logistics.temperature')}</TableCell>
                      <TableCell align="right">{t('logistics.apiGravity')}</TableCell>
                      <TableCell align="right">{t('logistics.bsw')}</TableCell>
                      <TableCell>{t('logistics.method')}</TableCell>
                      <TableCell>{t('logistics.gaugedBy')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gaugings.map((gauging) => (
                      <TableRow key={gauging.id} hover>
                        <TableCell>
                          {new Date(gauging.gauging_datetime).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {parseFloat(gauging.volume || 0).toLocaleString()} bbl
                        </TableCell>
                        <TableCell align="right">
                          {gauging.temperature ? `${gauging.temperature}°F` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {gauging.api_gravity ? `${gauging.api_gravity}°` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {gauging.bsw ? `${gauging.bsw}%` : '-'}
                        </TableCell>
                        <TableCell>{gauging.gauging_method}</TableCell>
                        <TableCell>{gauging.gauger?.username || '-'}</TableCell>
                      </TableRow>
                    ))}
                    {gaugings.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          {t('common.noData')}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Typography variant="body1">
              {currentTank.notes || t('common.noNotes')}
            </Typography>
          </TabPanel>
        </CardContent>
      </Card>

      {/* Gauging Dialog */}
      <Dialog open={gaugingDialog} onClose={() => setGaugingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('logistics.newGauging')}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="number"
                label={t('logistics.volumeBbl')}
                value={gaugingForm.volume}
                onChange={(e) => setGaugingForm({ ...gaugingForm, volume: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('logistics.temperatureF')}
                value={gaugingForm.temperature}
                onChange={(e) => setGaugingForm({ ...gaugingForm, temperature: e.target.value })}
                inputProps={{ step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('logistics.apiGravity')}
                value={gaugingForm.api_gravity}
                onChange={(e) => setGaugingForm({ ...gaugingForm, api_gravity: e.target.value })}
                inputProps={{ step: 0.1 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('logistics.bswPercent')}
                value={gaugingForm.bsw}
                onChange={(e) => setGaugingForm({ ...gaugingForm, bsw: e.target.value })}
                inputProps={{ min: 0, max: 100, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('logistics.levelInches')}
                value={gaugingForm.level_inches}
                onChange={(e) => setGaugingForm({ ...gaugingForm, level_inches: e.target.value })}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label={t('logistics.method')}
                value={gaugingForm.gauging_method}
                onChange={(e) => setGaugingForm({ ...gaugingForm, gauging_method: e.target.value })}
              >
                <MenuItem value="MANUAL">MANUAL</MenuItem>
                <MenuItem value="AUTOMATIC">AUTOMATIC</MenuItem>
                <MenuItem value="RADAR">RADAR</MenuItem>
                <MenuItem value="ULTRASONIC">ULTRASONIC</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label={t('common.notes')}
                value={gaugingForm.notes}
                onChange={(e) => setGaugingForm({ ...gaugingForm, notes: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGaugingDialog(false)}>{t('common.cancel')}</Button>
          <Button variant="contained" onClick={handleGaugingSubmit} disabled={!gaugingForm.volume}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TankDetail;
