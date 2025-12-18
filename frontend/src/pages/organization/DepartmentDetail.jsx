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
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  AccountTree as TreeIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import organizationService from '../../services/organizationService';

const departmentTypeColors = {
  DIRECTION: 'error',
  MANAGEMENT: 'warning',
  DEPARTMENT: 'primary',
  AREA: 'info',
  UNIT: 'default',
};

const DepartmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadDepartment();
  }, [id]);

  const loadDepartment = async () => {
    try {
      setLoading(true);
      const response = await organizationService.getDepartmentById(id);
      setDepartment(response.data);
    } catch (error) {
      toast.error(t('common.error'));
      navigate('/organization/departments');
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      DIRECTION: t('organization.typeDirection'),
      MANAGEMENT: t('organization.typeManagement'),
      DEPARTMENT: t('organization.typeDepartment'),
      AREA: t('organization.typeArea'),
      UNIT: t('organization.typeUnit'),
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!department) {
    return null;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            startIcon={<BackIcon />}
            onClick={() => navigate('/organization/departments')}
          >
            {t('common.back')}
          </Button>
          <Avatar sx={{ bgcolor: department.color || 'primary.main', width: 48, height: 48 }}>
            <BusinessIcon />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              {department.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {department.code}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/organization/departments/${id}/edit`)}
        >
          {t('common.edit')}
        </Button>
      </Box>

      {/* Status Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label={getTypeLabel(department.type)}
          color={departmentTypeColors[department.type] || 'default'}
        />
        <Chip
          label={department.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
          color={department.status === 'ACTIVE' ? 'success' : 'default'}
        />
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, v) => setActiveTab(v)}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
        >
          <Tab label={t('employees.tabs.info')} icon={<BusinessIcon />} iconPosition="start" />
          <Tab label={t('organization.employees')} icon={<PersonIcon />} iconPosition="start" />
          <Tab label={t('organization.positions')} icon={<WorkIcon />} iconPosition="start" />
          <Tab label={t('organization.departments')} icon={<TreeIcon />} iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>{t('employees.tabs.info')}</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('employees.code')}</Typography>
              <Typography variant="body1" fontWeight="medium">{department.code}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('common.name')}</Typography>
              <Typography variant="body1" fontWeight="medium">{department.name}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.level')}</Typography>
              <Typography variant="body1" fontWeight="medium">{getTypeLabel(department.type)}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.belongsTo')}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {department.parent?.name || t('organization.topLevel')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.manager')}</Typography>
              <Typography variant="body1" fontWeight="medium">
                {department.manager ? `${department.manager.firstName} ${department.manager.lastName}` : '-'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" color="text.secondary">{t('organization.costCenter')}</Typography>
              <Typography variant="body1" fontWeight="medium">{department.costCenter || '-'}</Typography>
            </Grid>
            {department.description && (
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">{t('common.description')}</Typography>
                <Typography variant="body1">{department.description}</Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('organization.employees')} ({department.employees?.length || 0})
          </Typography>
          {department.employees?.length > 0 ? (
            <List>
              {department.employees.map((emp, index) => (
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
                      secondary={emp.position || emp.employeeCode}
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

      {activeTab === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('organization.positions')} ({department.positions?.length || 0})
          </Typography>
          {department.positions?.length > 0 ? (
            <Grid container spacing={2}>
              {department.positions.map((pos) => (
                <Grid item xs={12} sm={6} md={4} key={pos.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">{pos.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{pos.code}</Typography>
                      <Chip
                        label={pos.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
                        size="small"
                        color={pos.status === 'ACTIVE' ? 'success' : 'default'}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">{t('common.noData')}</Typography>
          )}
        </Paper>
      )}

      {activeTab === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {t('organization.departments')} ({department.children?.length || 0})
          </Typography>
          {department.children?.length > 0 ? (
            <Grid container spacing={2}>
              {department.children.map((child) => (
                <Grid item xs={12} sm={6} md={4} key={child.id}>
                  <Card 
                    variant="outlined" 
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/organization/departments/${child.id}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: child.color || 'primary.main', width: 32, height: 32 }}>
                          <BusinessIcon fontSize="small" />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">{child.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{child.code}</Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={getTypeLabel(child.type)}
                        size="small"
                        color={departmentTypeColors[child.type] || 'default'}
                        sx={{ mt: 1 }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="text.secondary">{t('common.noData')}</Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default DepartmentDetail;
