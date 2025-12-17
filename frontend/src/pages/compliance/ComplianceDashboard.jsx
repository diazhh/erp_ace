import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Description as ReportIcon,
  Gavel as PermitIcon,
  FactCheck as AuditIcon,
  Policy as PolicyIcon,
  VerifiedUser as CertificationIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { fetchComplianceDashboard, fetchComplianceAlerts } from '../../store/slices/complianceSlice';

const COLORS = ['#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#607d8b'];

const StatCard = ({ title, value, icon, color, onClick, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card
      sx={{
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)', boxShadow: 4 } : {},
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}20`,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AlertItem = ({ alert, onClick }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'info';
      default:
        return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'HIGH':
        return <ErrorIcon color="error" />;
      case 'MEDIUM':
        return <WarningIcon color="warning" />;
      case 'LOW':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <ListItem
      button
      onClick={onClick}
      sx={{
        borderLeft: 3,
        borderColor: `${getSeverityColor(alert.severity)}.main`,
        mb: 1,
        backgroundColor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <ListItemIcon>{getSeverityIcon(alert.severity)}</ListItemIcon>
      <ListItemText
        primary={alert.title}
        secondary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            <Chip label={alert.code} size="small" variant="outlined" />
            <Typography variant="caption" color="text.secondary">
              {new Date(alert.date).toLocaleDateString()}
            </Typography>
          </Box>
        }
      />
    </ListItem>
  );
};

const ComplianceDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { dashboard, dashboardLoading, alerts, alertsLoading, error } = useSelector(
    (state) => state.compliance
  );

  useEffect(() => {
    dispatch(fetchComplianceDashboard());
    dispatch(fetchComplianceAlerts());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchComplianceDashboard());
    dispatch(fetchComplianceAlerts());
  };

  const getAlertRoute = (alert) => {
    switch (alert.entity) {
      case 'RegulatoryReport':
        return `/compliance/reports/${alert.id}`;
      case 'EnvironmentalPermit':
        return `/compliance/permits/${alert.id}`;
      case 'ComplianceAudit':
        return `/compliance/audits/${alert.id}`;
      case 'Policy':
        return `/compliance/policies/${alert.id}`;
      case 'Certification':
        return `/compliance/certifications/${alert.id}`;
      default:
        return '/compliance';
    }
  };

  if (dashboardLoading && !dashboard) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const reportStatusData = dashboard?.reports?.byStatus?.map((s) => ({
    name: t(`compliance.status.${s.status?.toLowerCase()}`),
    value: parseInt(s.count),
  })) || [];

  const permitStatusData = dashboard?.permits?.byStatus?.map((s) => ({
    name: t(`compliance.status.${s.status?.toLowerCase()}`),
    value: parseInt(s.count),
  })) || [];

  const auditTypeData = dashboard?.audits?.byType?.map((a) => ({
    name: t(`compliance.auditType.${a.type?.toLowerCase()}`),
    value: parseInt(a.count),
  })) || [];

  const certTypeData = dashboard?.certifications?.byType?.map((c) => ({
    name: c.type?.replace('_', ' '),
    value: parseInt(c.count),
  })) || [];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="bold">
            {t('compliance.moduleTitle')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('compliance.dashboardSubtitle')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={t('common.refresh')}>
            <IconButton onClick={handleRefresh} disabled={dashboardLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title={t('compliance.reportsOverdue')}
            value={dashboard?.reports?.overdue || 0}
            icon={<ReportIcon sx={{ color: 'error.main', fontSize: 32 }} />}
            color="error.main"
            onClick={() => navigate('/compliance/reports?status=DRAFT')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title={t('compliance.reportsDueSoon')}
            value={dashboard?.reports?.dueSoon || 0}
            icon={<ReportIcon sx={{ color: 'warning.main', fontSize: 32 }} />}
            color="warning.main"
            onClick={() => navigate('/compliance/reports')}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title={t('compliance.permitsExpiring')}
            value={(dashboard?.permits?.expiring30 || 0) + (dashboard?.permits?.expired || 0)}
            icon={<PermitIcon sx={{ color: 'warning.main', fontSize: 32 }} />}
            color="warning.main"
            onClick={() => navigate('/compliance/permits?expiringDays=30')}
            subtitle={`${dashboard?.permits?.expired || 0} ${t('compliance.expired')}`}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title={t('compliance.auditsPlanned')}
            value={(dashboard?.audits?.planned || 0) + (dashboard?.audits?.inProgress || 0)}
            icon={<AuditIcon sx={{ color: 'info.main', fontSize: 32 }} />}
            color="info.main"
            onClick={() => navigate('/compliance/audits')}
            subtitle={`${dashboard?.audits?.inProgress || 0} ${t('compliance.inProgress')}`}
          />
        </Grid>
        <Grid item xs={6} sm={4} md={2.4}>
          <StatCard
            title={t('compliance.activeCertifications')}
            value={dashboard?.certifications?.active || 0}
            icon={<CertificationIcon sx={{ color: 'success.main', fontSize: 32 }} />}
            color="success.main"
            onClick={() => navigate('/compliance/certifications')}
            subtitle={`${dashboard?.certifications?.expiring30 || 0} ${t('compliance.expiringSoon')}`}
          />
        </Grid>
      </Grid>

      {/* Alerts Section */}
      {alerts && alerts.length > 0 && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              <WarningIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'warning.main' }} />
              {t('compliance.alerts')}
            </Typography>
            <Chip label={alerts.length} color="warning" size="small" />
          </Box>
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {alerts.slice(0, 10).map((alert, index) => (
              <AlertItem
                key={`${alert.entity}-${alert.id}-${index}`}
                alert={alert}
                onClick={() => navigate(getAlertRoute(alert))}
              />
            ))}
          </List>
        </Paper>
      )}

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Reports by Status */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {t('compliance.reportsByStatus')}
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/compliance/reports')}
                >
                  {t('common.viewAll')}
                </Button>
              </Box>
              {reportStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={reportStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {reportStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                  <Typography color="text.secondary">{t('common.noData')}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Audits by Type */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {t('compliance.auditsByType')}
                </Typography>
                <Button
                  size="small"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => navigate('/compliance/audits')}
                >
                  {t('common.viewAll')}
                </Button>
              </Box>
              {auditTypeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={auditTypeData}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="value" fill="#2196f3" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 250 }}>
                  <Typography color="text.secondary">{t('common.noData')}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions & Recent Items */}
      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('compliance.quickActions')}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => navigate('/compliance/reports/new')}
                >
                  {t('compliance.newReport')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => navigate('/compliance/permits/new')}
                >
                  {t('compliance.newPermit')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => navigate('/compliance/audits/new')}
                >
                  {t('compliance.newAudit')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => navigate('/compliance/policies/new')}
                >
                  {t('compliance.newPolicy')}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => navigate('/compliance/certifications/new')}
                >
                  {t('compliance.newCertification')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Reports */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {t('compliance.recentReports')}
                </Typography>
                <Button size="small" onClick={() => navigate('/compliance/reports')}>
                  {t('common.viewAll')}
                </Button>
              </Box>
              <List dense>
                {dashboard?.reports?.recent?.map((report) => (
                  <ListItem
                    key={report.id}
                    button
                    onClick={() => navigate(`/compliance/reports/${report.id}`)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon>
                      <ReportIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={report.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={report.code} size="small" variant="outlined" />
                          <Chip
                            label={t(`compliance.status.${report.status?.toLowerCase()}`)}
                            size="small"
                            color={report.status === 'ACCEPTED' ? 'success' : report.status === 'REJECTED' ? 'error' : 'default'}
                          />
                        </Box>
                      }
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItem>
                ))}
                {(!dashboard?.reports?.recent || dashboard.reports.recent.length === 0) && (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                    {t('common.noData')}
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Audits */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {t('compliance.recentAudits')}
                </Typography>
                <Button size="small" onClick={() => navigate('/compliance/audits')}>
                  {t('common.viewAll')}
                </Button>
              </Box>
              <List dense>
                {dashboard?.audits?.recent?.map((audit) => (
                  <ListItem
                    key={audit.id}
                    button
                    onClick={() => navigate(`/compliance/audits/${audit.id}`)}
                    sx={{ borderRadius: 1, mb: 0.5 }}
                  >
                    <ListItemIcon>
                      <AuditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={audit.title}
                      secondary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={audit.code} size="small" variant="outlined" />
                          <Chip
                            label={t(`compliance.status.${audit.status?.toLowerCase()}`)}
                            size="small"
                            color={audit.status === 'COMPLETED' ? 'success' : audit.status === 'IN_PROGRESS' ? 'warning' : 'default'}
                          />
                        </Box>
                      }
                      primaryTypographyProps={{ noWrap: true }}
                    />
                  </ListItem>
                ))}
                {(!dashboard?.audits?.recent || dashboard.audits.recent.length === 0) && (
                  <Typography color="text.secondary" align="center" sx={{ py: 2 }}>
                    {t('common.noData')}
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ComplianceDashboard;
