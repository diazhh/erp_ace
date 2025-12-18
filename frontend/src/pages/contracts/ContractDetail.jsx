import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  CheckCircle as ActivateIcon,
  Cancel as TerminateIcon,
  Business as PartyIcon,
  Percent as WIIcon,
  AttachMoney as RoyaltyIcon,
  Map as ConcessionIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  fetchContractById,
  fetchContractParties,
  fetchWorkingInterests,
  fetchRoyalties,
  activateContract,
  terminateContract,
  clearCurrentContract,
} from '../../store/slices/contractSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUS_COLORS = {
  DRAFT: 'default',
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  EXPIRED: 'error',
  TERMINATED: 'error',
};

const PARTY_TYPE_COLORS = {
  OPERATOR: 'primary',
  PARTNER: 'info',
  GOVERNMENT: 'warning',
  NOC: 'secondary',
  CONTRACTOR: 'default',
};

const TabPanel = ({ children, value, index, ...other }) => (
  <div role="tabpanel" hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
  </div>
);

const ContractDetail = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentContract, parties, workingInterests, royalties, loading, error } = useSelector(
    (state) => state.contracts
  );

  const [tabValue, setTabValue] = useState(0);
  const [activateDialogOpen, setActivateDialogOpen] = useState(false);
  const [terminateDialogOpen, setTerminateDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchContractById(id));
    dispatch(fetchContractParties(id));
    dispatch(fetchWorkingInterests({ contractId: id }));
    dispatch(fetchRoyalties({ contractId: id }));
    return () => {
      dispatch(clearCurrentContract());
    };
  }, [dispatch, id]);

  const handleActivate = async () => {
    await dispatch(activateContract(id));
    setActivateDialogOpen(false);
  };

  const handleTerminate = async () => {
    await dispatch(terminateContract(id));
    setTerminateDialogOpen(false);
  };

  if (loading && !currentContract) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentContract) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('contracts.errors.notFound')}</Alert>
      </Box>
    );
  }

  const contract = currentContract;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' }, mb: 3, gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/contracts/list')}>
            {t('common.back')}
          </Button>
          <Box>
            <Typography variant="h5" component="h1">
              {contract.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {contract.code}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={t(`contracts.types.${contract.type?.toLowerCase()}`)}
            variant="outlined"
          />
          <Chip
            label={t(`contracts.status.${contract.status?.toLowerCase()}`)}
            color={STATUS_COLORS[contract.status] || 'default'}
          />
        </Box>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/contracts/${id}/edit`)}
        >
          {t('common.edit')}
        </Button>
        {contract.status === 'DRAFT' && (
          <Button
            variant="contained"
            color="success"
            startIcon={<ActivateIcon />}
            onClick={() => setActivateDialogOpen(true)}
          >
            {t('contracts.actions.activate')}
          </Button>
        )}
        {contract.status === 'ACTIVE' && (
          <Button
            variant="outlined"
            color="error"
            startIcon={<TerminateIcon />}
            onClick={() => setTerminateDialogOpen(true)}
          >
            {t('contracts.actions.terminate')}
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6">{contract.royalty_rate || 0}%</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('contracts.fields.royaltyRate')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6">{contract.cost_recovery_limit || 0}%</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('contracts.fields.costRecoveryLimit')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={2}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6">{contract.profit_oil_split || 0}%</Typography>
              <Typography variant="caption" color="text.secondary">
                {t('contracts.fields.profitOilSplit')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={4} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6">
                ${Number(contract.total_value || 0).toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('contracts.fields.totalValue')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <Card variant="outlined">
            <CardContent sx={{ textAlign: 'center', py: 1 }}>
              <Typography variant="h6">
                {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('contracts.fields.endDate')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs - Select en mobile, Tabs en desktop */}
      {isMobile ? (
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t('common.section')}</InputLabel>
          <Select
            value={tabValue}
            label={t('common.section')}
            onChange={(e) => setTabValue(e.target.value)}
          >
            <MenuItem value={0}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PartyIcon fontSize="small" /> {t('contracts.tabs.info')}
              </Box>
            </MenuItem>
            <MenuItem value={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PartyIcon fontSize="small" /> {t('contracts.tabs.parties')}
              </Box>
            </MenuItem>
            <MenuItem value={2}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WIIcon fontSize="small" /> {t('contracts.tabs.workingInterests')}
              </Box>
            </MenuItem>
            <MenuItem value={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <RoyaltyIcon fontSize="small" /> {t('contracts.tabs.royalties')}
              </Box>
            </MenuItem>
            <MenuItem value={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ConcessionIcon fontSize="small" /> {t('contracts.tabs.concessions')}
              </Box>
            </MenuItem>
          </Select>
        </FormControl>
      ) : (
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(e, v) => setTabValue(v)}
            variant="standard"
          >
            <Tab icon={<PartyIcon />} label={t('contracts.tabs.info')} iconPosition="start" />
            <Tab icon={<PartyIcon />} label={t('contracts.tabs.parties')} iconPosition="start" />
            <Tab icon={<WIIcon />} label={t('contracts.tabs.workingInterests')} iconPosition="start" />
            <Tab icon={<RoyaltyIcon />} label={t('contracts.tabs.royalties')} iconPosition="start" />
            <Tab icon={<ConcessionIcon />} label={t('contracts.tabs.concessions')} iconPosition="start" />
          </Tabs>
        </Paper>
      )}

      {/* Tab: Info */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('contracts.form.basicInfo')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.operator')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.operator?.name || '-'}</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.governmentEntity')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.government_entity || '-'}</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.startDate')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.start_date ? new Date(contract.start_date).toLocaleDateString() : '-'}</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.endDate')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.end_date ? new Date(contract.end_date).toLocaleDateString() : '-'}</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.signedDate')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.signed_date ? new Date(contract.signed_date).toLocaleDateString() : '-'}</Typography></Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                {t('contracts.form.legalTerms')}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={1}>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.disputeResolution')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.dispute_resolution || '-'}</Typography></Grid>
                <Grid item xs={4}><Typography variant="body2" color="text.secondary">{t('contracts.fields.governingLaw')}</Typography></Grid>
                <Grid item xs={8}><Typography variant="body2">{contract.governing_law || '-'}</Typography></Grid>
              </Grid>
              {contract.terms_summary && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">{t('contracts.fields.termsSummary')}</Typography>
                  <Typography variant="body2">{contract.terms_summary}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          {contract.description && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>{t('contracts.fields.description')}</Typography>
                <Typography variant="body2">{contract.description}</Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      {/* Tab: Parties */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/contracts/${id}/parties/new`)}>
            {t('contracts.actions.addParty')}
          </Button>
        </Box>
        {isMobile ? (
          <Box>
            {parties?.map((party) => (
              <Card key={party.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">{party.party_name}</Typography>
                      <Chip
                        label={t(`contracts.partyTypes.${party.party_type?.toLowerCase()}`)}
                        color={PARTY_TYPE_COLORS[party.party_type] || 'default'}
                        size="small"
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                    {party.is_operator && <Chip label={t('contracts.fields.operator')} color="primary" size="small" />}
                  </Box>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">{t('contracts.fields.workingInterest')}</Typography>
                      <Typography variant="body2">{party.working_interest}%</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">{t('contracts.fields.revenueInterest')}</Typography>
                      <Typography variant="body2">{party.revenue_interest}%</Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('contracts.fields.partyName')}</TableCell>
                  <TableCell>{t('contracts.fields.partyType')}</TableCell>
                  <TableCell align="right">{t('contracts.fields.workingInterest')}</TableCell>
                  <TableCell align="right">{t('contracts.fields.costBearingInterest')}</TableCell>
                  <TableCell align="right">{t('contracts.fields.revenueInterest')}</TableCell>
                  <TableCell>{t('contracts.fields.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parties?.map((party) => (
                  <TableRow key={party.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {party.party_name}
                        {party.is_operator && <Chip label={t('contracts.fields.operator')} color="primary" size="small" />}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={t(`contracts.partyTypes.${party.party_type?.toLowerCase()}`)}
                        color={PARTY_TYPE_COLORS[party.party_type] || 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">{party.working_interest}%</TableCell>
                    <TableCell align="right">{party.cost_bearing_interest}%</TableCell>
                    <TableCell align="right">{party.revenue_interest}%</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`contracts.status.${party.status?.toLowerCase()}`)}
                        color={STATUS_COLORS[party.status] || 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {(!parties || parties.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>{t('common.noData')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </TabPanel>

      {/* Tab: Working Interests */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(`/contracts/${id}/working-interests/new`)}>
            {t('contracts.actions.addWorkingInterest')}
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('contracts.fields.party')}</TableCell>
                <TableCell>{t('contracts.fields.assetType')}</TableCell>
                <TableCell>{t('contracts.fields.asset')}</TableCell>
                <TableCell align="right">{t('contracts.fields.workingInterest')}</TableCell>
                <TableCell align="right">{t('contracts.fields.netRevenueInterest')}</TableCell>
                <TableCell>{t('contracts.fields.effectiveDate')}</TableCell>
                <TableCell>{t('contracts.fields.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workingInterests?.map((wi) => (
                <TableRow key={wi.id}>
                  <TableCell>{wi.party?.party_name || '-'}</TableCell>
                  <TableCell>{t(`contracts.assetTypes.${wi.asset_type?.toLowerCase()}`)}</TableCell>
                  <TableCell>{wi.field?.name || wi.well?.name || '-'}</TableCell>
                  <TableCell align="right">{wi.working_interest}%</TableCell>
                  <TableCell align="right">{wi.net_revenue_interest}%</TableCell>
                  <TableCell>{wi.effective_date ? new Date(wi.effective_date).toLocaleDateString() : '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`contracts.status.${wi.status?.toLowerCase()}`)}
                      color={STATUS_COLORS[wi.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
              {(!workingInterests || workingInterests.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>{t('common.noData')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Royalties */}
      <TabPanel value={tabValue} index={3}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('contracts.fields.period')}</TableCell>
                <TableCell>{t('contracts.fields.field')}</TableCell>
                <TableCell align="right">{t('contracts.fields.productionValue')}</TableCell>
                <TableCell align="right">{t('contracts.fields.royaltyRate')}</TableCell>
                <TableCell align="right">{t('contracts.fields.royaltyAmount')}</TableCell>
                <TableCell>{t('contracts.fields.status')}</TableCell>
                <TableCell>{t('contracts.fields.paymentDate')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {royalties?.map((royalty) => (
                <TableRow key={royalty.id}>
                  <TableCell>{`${royalty.period_month}/${royalty.period_year}`}</TableCell>
                  <TableCell>{royalty.field?.name || '-'}</TableCell>
                  <TableCell align="right">${Number(royalty.production_value || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{royalty.royalty_rate}%</TableCell>
                  <TableCell align="right">${Number(royalty.royalty_amount || 0).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`contracts.royaltyStatus.${royalty.status?.toLowerCase()}`)}
                      color={royalty.status === 'PAID' ? 'success' : royalty.status === 'PENDING' ? 'warning' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{royalty.payment_date ? new Date(royalty.payment_date).toLocaleDateString() : '-'}</TableCell>
                </TableRow>
              ))}
              {(!royalties || royalties.length === 0) && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="text.secondary" sx={{ py: 2 }}>{t('common.noData')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab: Concessions */}
      <TabPanel value={tabValue} index={4}>
        {contract.concessions?.length > 0 ? (
          <Grid container spacing={2}>
            {contract.concessions.map((concession) => (
              <Grid item xs={12} md={6} key={concession.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">{concession.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{concession.code}</Typography>
                      </Box>
                      <Chip
                        label={t(`contracts.status.${concession.status?.toLowerCase()}`)}
                        color={STATUS_COLORS[concession.status] || 'default'}
                        size="small"
                      />
                    </Box>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('contracts.fields.area')}</Typography>
                        <Typography variant="body2">{concession.area_km2} km²</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('contracts.fields.type')}</Typography>
                        <Typography variant="body2">{t(`contracts.concessionTypes.${concession.type?.toLowerCase()}`)}</Typography>
                      </Grid>
                    </Grid>
                    <Button
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={() => navigate(`/contracts/concessions/${concession.id}`)}
                    >
                      {t('common.viewDetails')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">{t('contracts.messages.noConcessions')}</Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{ mt: 2 }}
              onClick={() => navigate('/contracts/concessions/new')}
            >
              {t('contracts.actions.addConcession')}
            </Button>
          </Paper>
        )}
      </TabPanel>

      {/* Dialogs */}
      <ConfirmDialog
        open={activateDialogOpen}
        title={t('contracts.dialogs.activateTitle')}
        message={t('contracts.dialogs.activateMessage')}
        onConfirm={handleActivate}
        onCancel={() => setActivateDialogOpen(false)}
        confirmText={t('contracts.actions.activate')}
        confirmColor="success"
      />
      <ConfirmDialog
        open={terminateDialogOpen}
        title={t('contracts.dialogs.terminateTitle')}
        message={t('contracts.dialogs.terminateMessage')}
        onConfirm={handleTerminate}
        onCancel={() => setTerminateDialogOpen(false)}
        confirmText={t('contracts.actions.terminate')}
        confirmColor="error"
      />
    </Box>
  );
};

export default ContractDetail;
