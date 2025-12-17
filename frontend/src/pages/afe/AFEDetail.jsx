import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Send as SubmitIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  PlayArrow as StartIcon,
  Stop as CloseIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import {
  fetchAFEById,
  submitAFE,
  approveAFE,
  rejectAFE,
  startAFEExecution,
  closeAFE,
  clearCurrentAFE,
} from '../../store/slices/afeSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const AFEDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentAFE: afe, loading } = useSelector((state) => state.afe);

  const [tabValue, setTabValue] = useState(0);
  const [actionDialog, setActionDialog] = useState({ open: false, action: null, title: '', message: '' });

  useEffect(() => {
    if (id) {
      dispatch(fetchAFEById(id));
    }
    return () => {
      dispatch(clearCurrentAFE());
    };
  }, [dispatch, id]);

  const handleAction = async () => {
    const { action } = actionDialog;
    try {
      switch (action) {
        case 'submit':
          await dispatch(submitAFE(id)).unwrap();
          break;
        case 'approve':
          await dispatch(approveAFE({ id })).unwrap();
          break;
        case 'reject':
          await dispatch(rejectAFE({ id })).unwrap();
          break;
        case 'start':
          await dispatch(startAFEExecution(id)).unwrap();
          break;
        case 'close':
          await dispatch(closeAFE({ id })).unwrap();
          break;
      }
      dispatch(fetchAFEById(id));
    } catch (error) {
      console.error('Action error:', error);
    }
    setActionDialog({ open: false, action: null, title: '', message: '' });
  };

  const openActionDialog = (action, title, message) => {
    setActionDialog({ open: true, action, title, message });
  };

  const getStatusColor = (status) => {
    const colors = {
      DRAFT: 'default',
      PENDING: 'warning',
      APPROVED: 'success',
      REJECTED: 'error',
      IN_PROGRESS: 'info',
      CLOSED: 'secondary',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  const getTypeColor = (type) => {
    const colors = {
      DRILLING: 'error',
      WORKOVER: 'warning',
      FACILITIES: 'info',
      EXPLORATION: 'secondary',
      MAINTENANCE: 'success',
      OTHER: 'default',
    };
    return colors[type] || 'default';
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('es-VE');
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('es-VE');
  };

  const calculateProgress = () => {
    if (!afe?.categories?.length) return 0;
    const totalEstimated = afe.categories.reduce((sum, c) => sum + parseFloat(c.estimated_amount || 0), 0);
    const totalActual = afe.categories.reduce((sum, c) => sum + parseFloat(c.actual_amount || 0), 0);
    if (totalEstimated === 0) return 0;
    return Math.min((totalActual / totalEstimated) * 100, 100);
  };

  if (loading || !afe) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  const progress = calculateProgress();
  const totalEstimated = afe.categories?.reduce((sum, c) => sum + parseFloat(c.estimated_amount || 0), 0) || 0;
  const totalActual = afe.categories?.reduce((sum, c) => sum + parseFloat(c.actual_amount || 0), 0) || 0;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/afe')}>
            {t('common.back')}
          </Button>
          <Typography variant="h4" component="h1">
            {afe.code}
          </Typography>
          <Chip label={t(`afe.status.${afe.status}`)} color={getStatusColor(afe.status)} />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {afe.status === 'DRAFT' && (
            <>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/afe/${id}/edit`)}
              >
                {t('common.edit')}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SubmitIcon />}
                onClick={() => openActionDialog('submit', t('afe.submitTitle'), t('afe.submitMessage'))}
              >
                {t('afe.submit')}
              </Button>
            </>
          )}
          {afe.status === 'PENDING' && (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<ApproveIcon />}
                onClick={() => openActionDialog('approve', t('afe.approveTitle'), t('afe.approveMessage'))}
              >
                {t('afe.approve')}
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<RejectIcon />}
                onClick={() => openActionDialog('reject', t('afe.rejectTitle'), t('afe.rejectMessage'))}
              >
                {t('afe.reject')}
              </Button>
            </>
          )}
          {afe.status === 'APPROVED' && (
            <Button
              variant="contained"
              color="info"
              startIcon={<StartIcon />}
              onClick={() => openActionDialog('start', t('afe.startTitle'), t('afe.startMessage'))}
            >
              {t('afe.startExecution')}
            </Button>
          )}
          {afe.status === 'IN_PROGRESS' && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<CloseIcon />}
              onClick={() => openActionDialog('close', t('afe.closeTitle'), t('afe.closeMessage'))}
            >
              {t('afe.close')}
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {formatCurrency(afe.estimated_cost, afe.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('afe.estimatedCost')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <MoneyIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="info.main">
                {formatCurrency(totalActual, afe.currency)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('afe.actualCost')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              {afe.variance >= 0 ? (
                <TrendingUpIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              ) : (
                <TrendingDownIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              )}
              <Typography
                variant="h5"
                fontWeight="bold"
                color={afe.variance >= 0 ? 'error.main' : 'success.main'}
              >
                {afe.variance !== null ? formatCurrency(afe.variance, afe.currency) : '-'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('afe.variance')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('afe.progress')}
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {progress.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                color={progress > 100 ? 'error' : 'primary'}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label={t('afe.info')} />
          <Tab label={t('afe.categoriesTab')} />
          <Tab label={t('afe.expenses')} />
          <Tab label={t('afe.approvals')} />
          <Tab label={t('afe.variances')} />
        </Tabs>
        <Divider />

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('afe.titleField')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {afe.title}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {t('common.description')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {afe.description || '-'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {t('afe.type.label')}
                </Typography>
                <Chip
                  label={t(`afe.type.${afe.type}`)}
                  color={getTypeColor(afe.type)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                <Typography variant="subtitle2" color="text.secondary">
                  {t('afe.priority')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {t(`afe.priorities.${afe.priority}`)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('production.field')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {afe.field?.name || '-'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {t('production.well')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {afe.well?.name || '-'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {t('projects.project')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {afe.project ? `${afe.project.code} - ${afe.project.name}` : '-'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  {t('afe.schedule')}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {formatDate(afe.start_date)} - {formatDate(afe.end_date)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('afe.justification')}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {afe.justification || '-'}
                </Typography>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('afe.category')}</TableCell>
                    <TableCell>{t('common.description')}</TableCell>
                    <TableCell align="right">{t('afe.estimated')}</TableCell>
                    <TableCell align="right">{t('afe.actual')}</TableCell>
                    <TableCell align="right">{t('afe.variance')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {afe.categories?.map((cat) => {
                    const variance = parseFloat(cat.actual_amount || 0) - parseFloat(cat.estimated_amount || 0);
                    return (
                      <TableRow key={cat.id}>
                        <TableCell>
                          <Chip label={t(`afe.categories.${cat.category}`)} size="small" />
                        </TableCell>
                        <TableCell>{cat.description || '-'}</TableCell>
                        <TableCell align="right">{formatCurrency(cat.estimated_amount)}</TableCell>
                        <TableCell align="right">{formatCurrency(cat.actual_amount)}</TableCell>
                        <TableCell align="right">
                          <Typography color={variance > 0 ? 'error.main' : 'success.main'}>
                            {formatCurrency(variance)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!afe.categories || afe.categories.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">{t('common.noData')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {afe.categories?.length > 0 && (
                    <TableRow sx={{ bgcolor: 'action.hover' }}>
                      <TableCell colSpan={2}>
                        <Typography fontWeight="bold">{t('common.total')}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">{formatCurrency(totalEstimated)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">{formatCurrency(totalActual)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color={totalActual - totalEstimated > 0 ? 'error.main' : 'success.main'}>
                          {formatCurrency(totalActual - totalEstimated)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 2 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('common.date')}</TableCell>
                    <TableCell>{t('common.description')}</TableCell>
                    <TableCell>{t('afe.vendor')}</TableCell>
                    <TableCell align="right">{t('afe.amount')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {afe.expenses?.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>{formatDate(expense.expense_date)}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>{expense.vendor || expense.contractor?.name || '-'}</TableCell>
                      <TableCell align="right">{formatCurrency(expense.amount_usd)}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`afe.expenseStatus.${expense.status}`)}
                          color={expense.status === 'APPROVED' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!afe.expenses || afe.expenses.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">{t('common.noData')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 3 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('afe.level')}</TableCell>
                    <TableCell>{t('afe.approver')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                    <TableCell>{t('afe.comments')}</TableCell>
                    <TableCell>{t('common.date')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {afe.approvals?.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>{approval.approval_level}</TableCell>
                      <TableCell>{approval.approver?.username || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`afe.approvalStatus.${approval.status}`)}
                          color={
                            approval.status === 'APPROVED'
                              ? 'success'
                              : approval.status === 'REJECTED'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{approval.comments || '-'}</TableCell>
                      <TableCell>{formatDateTime(approval.approved_at)}</TableCell>
                    </TableRow>
                  ))}
                  {(!afe.approvals || afe.approvals.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">{t('common.noData')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tabValue === 4 && (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('afe.varianceType')}</TableCell>
                    <TableCell>{t('common.description')}</TableCell>
                    <TableCell align="right">{t('afe.original')}</TableCell>
                    <TableCell align="right">{t('afe.new')}</TableCell>
                    <TableCell>{t('common.status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {afe.variances?.map((variance) => (
                    <TableRow key={variance.id}>
                      <TableCell>
                        <Chip label={t(`afe.varianceTypes.${variance.variance_type}`)} size="small" />
                      </TableCell>
                      <TableCell>{variance.description}</TableCell>
                      <TableCell align="right">
                        {variance.variance_type === 'COST'
                          ? formatCurrency(variance.original_value)
                          : variance.original_value}
                      </TableCell>
                      <TableCell align="right">
                        {variance.variance_type === 'COST'
                          ? formatCurrency(variance.new_value)
                          : variance.new_value}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={t(`afe.approvalStatus.${variance.status}`)}
                          color={
                            variance.status === 'APPROVED'
                              ? 'success'
                              : variance.status === 'REJECTED'
                              ? 'error'
                              : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!afe.variances || afe.variances.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">{t('common.noData')}</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      <ConfirmDialog
        open={actionDialog.open}
        title={actionDialog.title}
        message={actionDialog.message}
        onConfirm={handleAction}
        onCancel={() => setActionDialog({ open: false, action: null, title: '', message: '' })}
      />
    </Box>
  );
};

export default AFEDetail;
