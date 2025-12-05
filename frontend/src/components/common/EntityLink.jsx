import { Link as RouterLink } from 'react-router-dom';
import { Link, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Person as PersonIcon,
  AccountBalance as AccountIcon,
  Receipt as TransactionIcon,
  CreditCard as LoanIcon,
  CalendarMonth as PeriodIcon,
  Folder as ProjectIcon,
  DirectionsCar as VehicleIcon,
  Inventory as InventoryIcon,
  AccountBalanceWallet as PettyCashIcon,
} from '@mui/icons-material';

const entityConfig = {
  employee: {
    path: '/employees',
    icon: PersonIcon,
    color: 'primary.main',
  },
  account: {
    path: '/finance/accounts',
    icon: AccountIcon,
    color: 'success.main',
  },
  transaction: {
    path: '/finance/transactions',
    icon: TransactionIcon,
    color: 'info.main',
  },
  loan: {
    path: '/payroll/loans',
    icon: LoanIcon,
    color: 'warning.main',
  },
  period: {
    path: '/payroll/periods',
    icon: PeriodIcon,
    color: 'secondary.main',
  },
  project: {
    path: '/projects',
    icon: ProjectIcon,
    color: 'primary.dark',
  },
  vehicle: {
    path: '/fleet',
    icon: VehicleIcon,
    color: 'error.main',
  },
  inventory: {
    path: '/inventory',
    icon: InventoryIcon,
    color: 'success.dark',
  },
  pettyCash: {
    path: '/petty-cash',
    icon: PettyCashIcon,
    color: 'warning.dark',
  },
};

/**
 * Componente reutilizable para enlaces entre entidades
 * @param {string} type - Tipo de entidad (employee, account, transaction, loan, period, project, vehicle)
 * @param {string} id - ID de la entidad
 * @param {string} label - Texto a mostrar
 * @param {boolean} showIcon - Mostrar icono (default: false)
 * @param {string} tooltip - Texto del tooltip (opcional)
 */
const EntityLink = ({ type, id, label, showIcon = false, tooltip }) => {
  const { t } = useTranslation();
  const config = entityConfig[type];
  
  if (!config) {
    console.warn(`EntityLink: ${t('components.entityLink.unknownType')} "${type}"`);
    return <span>{label}</span>;
  }
  
  const Icon = config.icon;
  
  const linkContent = (
    <Link
      component={RouterLink}
      to={`${config.path}/${id}`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        textDecoration: 'none',
        color: config.color,
        '&:hover': {
          textDecoration: 'underline',
        },
      }}
    >
      {showIcon && <Icon sx={{ fontSize: 16 }} />}
      {label}
    </Link>
  );
  
  if (tooltip) {
    return (
      <Tooltip title={tooltip} arrow>
        {linkContent}
      </Tooltip>
    );
  }
  
  return linkContent;
};

export default EntityLink;
