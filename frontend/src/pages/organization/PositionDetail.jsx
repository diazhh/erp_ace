import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Work as WorkIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';

const getLevelLabels = (t) => ({
  0: t('organization.levelExecutive'),
  1: t('organization.levelDirector'),
  2: t('organization.levelManager'),
  3: t('organization.levelCoordinator'),
  4: t('organization.levelAnalyst'),
  5: t('organization.levelAssistant'),
  6: t('organization.levelOperative'),
});

const levelColors = ['error', 'warning', 'info', 'primary', 'default', 'default', 'default'];

const PositionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadPosition();
  }, [id]);

  const loadPosition = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getPositionById(id);
      setPosition(response.data);
    } catch (error) {
      toast.error(t('common.error'));
      navigate('/organization/positions');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    if (!amount) return '-';
    return new Intl.NumberFormat('es-VE', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!position) {
    return null;
  }

  const levelLabels = getLevelLabels(t);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/organization/positions')}
          >
            {t('common.back')}
          </Button>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <WorkIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {position.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {position.code}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/organization/positions/${id}/edit`)}
        >
          {t('common.edit')}
        </Button>
      </Box>

      {/* Status Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label={levelLabels[position.level] || `${t('organization.level')} ${position.level}`}
          color={levelColors[position.level] || 'default'}
        />
        <Chip
          label={position.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
          color={position.status === 'ACTIVE' ? 'success' : 'default'}
        />
        {position.isSupervisory && (
          <Chip label={t('organization.supervision')} color="secondary" />
        )}
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label={t('employees.tabs.info')} icon={<WorkIcon />} iconPosition="start" />
          <Tab label={t('organization.employees')} icon={<PersonIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{t('employees.tabs.info')}</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('employees.code')}</Typography>
              <Typography variant="body1" fontWeight="medium">{position.code}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('common.name')}</Typography>
              <Typography variant="body1" fontWeight="medium">{position.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.level')}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {levelLabels[position.level] || position.level}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('employees.department')}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {position.department?.name || t('organization.notAssigned')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.salaryRange')}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {position.minSalary || position.maxSalary
                  ? `${formatCurrency(position.minSalary, position.salaryCurrency)} - ${formatCurrency(position.maxSalary, position.salaryCurrency)}`
                  : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.maxHeadcount')}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {position.employees?.length || 0} / {position.maxHeadcount || 1}
              </Typography>
            </Grid>
            {position.description && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('common.description')}</Typography>
                <Typography variant="body1">{position.description}</Typography>
              </Grid>
            )}
            {position.requirements && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('organization.requirements')}</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{position.requirements}</Typography>
              </Grid>
            )}
            {position.responsibilities && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('organization.responsibilities')}</Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{position.responsibilities}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('organization.employees')} ({position.employees?.length || 0})
          </Typography>
          {position.employees?.length > 0 ? (
            <List>
              {position.employees.map((emp, index) => (
                <Box key={emp.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    button
                    onClick={() => navigate(`/employees/${emp.id}`)}
                  >
                    <ListItemAvatar>
                      <Avatar src={emp.photoUrl}>
                        {emp.firstName?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${emp.firstName} ${emp.lastName}`}
                      secondary={emp.employeeCode}
                    />
                    <Chip
                      label={emp.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
                      size="small"
                      color={emp.status === 'ACTIVE' ? 'success' : 'default'}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">{t('common.noData')}</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default PositionDetail;
