import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
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
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

import { logout } from '../store/slices/authSlice';
import LanguageSelector from './LanguageSelector';

const drawerWidth = 260;

const getMenuItems = (t) => [
  { text: t('menu.dashboard'), icon: <DashboardIcon />, path: '/dashboard' },
  { text: t('menu.employees'), icon: <PeopleIcon />, path: '/employees' },
  { text: 'Organigrama', icon: <OrgChartIcon />, path: '/organization/chart' },
  { text: 'Directorio', icon: <DirectoryIcon />, path: '/organization/directory' },
  { text: 'Departamentos', icon: <DepartmentIcon />, path: '/organization/departments' },
  { text: t('menu.payroll'), icon: <PayrollIcon />, path: '/payroll' },
  { text: t('menu.loans'), icon: <LoansIcon />, path: '/payroll/loans' },
  { text: t('menu.finance'), icon: <FinanceIcon />, path: '/finance' },
  { text: t('menu.bankAccounts'), icon: <AccountsIcon />, path: '/finance/accounts' },
  { text: t('menu.pettyCash') || 'Caja Chica', icon: <PettyCashIcon />, path: '/petty-cash' },
  { text: t('menu.projects'), icon: <ProjectsIcon />, path: '/projects' },
  { text: t('menu.inventory'), icon: <InventoryIcon />, path: '/inventory' },
  { text: t('menu.fleet'), icon: <FleetIcon />, path: '/fleet' },
];

const Layout = () => {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const menuItems = getMenuItems(t);

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
    <Box>
      <Toolbar sx={{ justifyContent: 'center' }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          {t('common.appName')}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
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
