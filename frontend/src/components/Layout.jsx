import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  AccountBalance as FinanceIcon,
  Inventory as InventoryIcon,
  DirectionsCar as FleetIcon,
  Assignment as ProjectsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Payments as PayrollIcon,
  CreditCard as LoansIcon,
  AccountBalanceWallet as AccountsIcon,
  Receipt as TransactionsIcon,
  LocalAtm as PettyCashIcon,
  AccountTree as OrgChartIcon,
  Business as DepartmentIcon,
  ContactPhone as DirectoryIcon,
  Engineering as ContractorIcon,
  ShoppingCart as ProcurementIcon,
  Description as QuoteIcon,
  Receipt as InvoiceIcon,
  Payment as PaymentIcon,
  HealthAndSafety as HSEIcon,
  Folder as DocumentIcon,
  ExpandLess,
  ExpandMore,
  List as ListIcon,
  Warehouse as WarehouseIcon,
  SwapHoriz as MovementIcon,
  Build as MaintenanceIcon,
  LocalGasStation as FuelIcon,
  Warning as IncidentIcon,
  Checklist as InspectionIcon,
  School as TrainingIcon,
  Construction as EquipmentIcon,
  Category as CategoryIcon,
  WorkOutline as PositionIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as UsersIcon,
  Security as RolesIcon,
} from '@mui/icons-material';

import { logout } from '../store/slices/authSlice';
import LanguageSelector from './LanguageSelector';
import { checkPermission } from '../hooks/usePermission';

const drawerWidth = 260;

// Componente para item de menú con submenú
const MenuItemWithSubmenu = ({ item, openMenus, toggleMenu, navigate, setMobileOpen, location }) => {
  const isOpen = openMenus[item.id];
  const isActive = location.pathname === item.path || 
    (item.children && item.children.some(child => location.pathname === child.path));

  if (!item.children) {
    return (
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => {
            navigate(item.path);
            setMobileOpen(false);
          }}
          selected={location.pathname === item.path}
          sx={{
            '&.Mui-selected': {
              bgcolor: 'primary.light',
              '&:hover': { bgcolor: 'primary.light' },
            },
          }}
        >
          <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItemButton>
      </ListItem>
    );
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => toggleMenu(item.id)}
          sx={{
            bgcolor: isActive ? 'action.selected' : 'transparent',
          }}
        >
          <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.text} />
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((child) => (
            <ListItemButton
              key={child.path}
              sx={{ pl: 4 }}
              onClick={() => {
                navigate(child.path);
                setMobileOpen(false);
              }}
              selected={location.pathname === child.path}
            >
              <ListItemIcon sx={{ color: location.pathname === child.path ? 'primary.main' : 'inherit', minWidth: 36 }}>
                {child.icon}
              </ListItemIcon>
              <ListItemText primary={child.text} primaryTypographyProps={{ fontSize: '0.875rem' }} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

const Layout = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user, permissions } = useSelector((state) => state.auth);

  // Función para verificar si el usuario tiene acceso a un módulo
  const hasAccess = (requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    return requiredPermissions.some(p => checkPermission(permissions, p));
  };

  // Estructura del menú con submenús y permisos requeridos
  const menuItems = [
    { id: 'dashboard', text: t('menu.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
    { id: 'employees', text: t('menu.employees'), icon: <PeopleIcon />, path: '/employees', permissions: ['employees:read', 'employees:*'] },
    { 
      id: 'organization', 
      text: 'Organización', 
      icon: <OrgChartIcon />,
      permissions: ['organization:read', 'employees:read', 'organization:*'],
      children: [
        { text: 'Organigrama', icon: <OrgChartIcon />, path: '/organization/chart' },
        { text: 'Directorio', icon: <DirectoryIcon />, path: '/organization/directory' },
        { text: 'Departamentos', icon: <DepartmentIcon />, path: '/organization/departments', permissions: ['organization:read', 'organization:*'] },
        { text: 'Cargos', icon: <PositionIcon />, path: '/organization/positions', permissions: ['organization:read', 'organization:*'] },
      ],
    },
    { 
      id: 'payroll', 
      text: t('menu.payroll'), 
      icon: <PayrollIcon />,
      permissions: ['payroll:read', 'payroll:*', 'loans:read', 'loans:*'],
      children: [
        { text: 'Períodos', icon: <PayrollIcon />, path: '/payroll', permissions: ['payroll:read', 'payroll:*'] },
        { text: t('menu.loans'), icon: <LoansIcon />, path: '/payroll/loans', permissions: ['loans:read', 'loans:*'] },
      ],
    },
    { 
      id: 'finance', 
      text: t('menu.finance'), 
      icon: <FinanceIcon />,
      permissions: ['finance:read', 'finance:*'],
      children: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/finance' },
        { text: 'Transacciones', icon: <TransactionsIcon />, path: '/finance/transactions' },
        { text: t('menu.bankAccounts'), icon: <AccountsIcon />, path: '/finance/accounts' },
      ],
    },
    { id: 'pettyCash', text: t('menu.pettyCash') || 'Caja Chica', icon: <PettyCashIcon />, path: '/petty-cash', permissions: ['petty_cash:read', 'petty_cash:*', 'petty_cash:expense'] },
    { 
      id: 'projects', 
      text: t('menu.projects'), 
      icon: <ProjectsIcon />,
      permissions: ['projects:read', 'projects:*', 'contractors:read', 'contractors:*'],
      children: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/projects', permissions: ['projects:read', 'projects:*'] },
        { text: 'Lista', icon: <ListIcon />, path: '/projects/list', permissions: ['projects:read', 'projects:*'] },
        { text: 'Contratistas', icon: <ContractorIcon />, path: '/contractors', permissions: ['contractors:read', 'contractors:*'] },
      ],
    },
    { 
      id: 'procurement', 
      text: 'Compras', 
      icon: <ProcurementIcon />,
      permissions: ['procurement:read', 'procurement:*'],
      children: [
        { text: 'Órdenes de Compra', icon: <ProcurementIcon />, path: '/procurement/purchase-orders' },
        { text: 'Cotizaciones', icon: <QuoteIcon />, path: '/procurement/quotes' },
        { text: 'Facturas', icon: <InvoiceIcon />, path: '/procurement/invoices' },
        { text: 'Pagos', icon: <PaymentIcon />, path: '/procurement/payments' },
      ],
    },
    { 
      id: 'inventory', 
      text: t('menu.inventory'), 
      icon: <InventoryIcon />,
      permissions: ['inventory:read', 'inventory:*'],
      children: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/inventory' },
        { text: 'Items', icon: <InventoryIcon />, path: '/inventory/items' },
        { text: 'Almacenes', icon: <WarehouseIcon />, path: '/inventory/warehouses' },
        { text: 'Movimientos', icon: <MovementIcon />, path: '/inventory/movements' },
      ],
    },
    { 
      id: 'fleet', 
      text: t('menu.fleet'), 
      icon: <FleetIcon />,
      permissions: ['fleet:read', 'fleet:*'],
      children: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/fleet' },
        { text: 'Vehículos', icon: <FleetIcon />, path: '/fleet/vehicles' },
        { text: 'Mantenimientos', icon: <MaintenanceIcon />, path: '/fleet/maintenances' },
        { text: 'Combustible', icon: <FuelIcon />, path: '/fleet/fuel-logs' },
      ],
    },
    { 
      id: 'hse', 
      text: 'HSE', 
      icon: <HSEIcon />,
      permissions: ['hse:read', 'hse:*', 'hse:create'],
      children: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/hse' },
        { text: 'Incidentes', icon: <IncidentIcon />, path: '/hse/incidents' },
        { text: 'Inspecciones', icon: <InspectionIcon />, path: '/hse/inspections' },
        { text: 'Capacitaciones', icon: <TrainingIcon />, path: '/hse/trainings' },
        { text: 'Equipos', icon: <EquipmentIcon />, path: '/hse/equipment' },
      ],
    },
    { 
      id: 'documents', 
      text: 'Documentos', 
      icon: <DocumentIcon />,
      permissions: ['documents:read', 'documents:*'],
      children: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/documents' },
        { text: 'Lista', icon: <ListIcon />, path: '/documents/list' },
        { text: 'Categorías', icon: <CategoryIcon />, path: '/documents/categories' },
      ],
    },
    { 
      id: 'admin', 
      text: 'Administración', 
      icon: <AdminIcon />,
      permissions: ['users:read', 'users:*', 'roles:read', 'roles:*'],
      children: [
        { text: 'Usuarios', icon: <UsersIcon />, path: '/admin/users', permissions: ['users:read', 'users:*'] },
        { text: 'Roles', icon: <RolesIcon />, path: '/admin/roles', permissions: ['roles:read', 'roles:*'] },
      ],
    },
  ];

  // Filtrar menús según permisos
  const filteredMenuItems = menuItems
    .filter(item => hasAccess(item.permissions))
    .map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => hasAccess(child.permissions)),
        };
      }
      return item;
    })
    .filter(item => !item.children || item.children.length > 0); // Eliminar menús sin hijos visibles

  const toggleMenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          {t('common.appName')}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => (
          <MenuItemWithSubmenu
            key={item.id}
            item={item}
            openMenus={openMenus}
            toggleMenu={toggleMenu}
            navigate={navigate}
            setMobileOpen={setMobileOpen}
            location={location}
          />
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {t('common.appDescription')}
          </Typography>
          <LanguageSelector />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">
              {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton onClick={handleMenuOpen} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user?.firstName?.[0] || 'U'}
              </Avatar>
            </IconButton>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              {t('menu.settings')}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {t('auth.logout')}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
