import { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';

/**
 * ResponsiveTabs - Tabs que se convierten en un Select en mobile
 * 
 * Props:
 * - tabs: Array de { label, icon?, value? }
 * - value: Valor actual del tab seleccionado
 * - onChange: Función (event, newValue) => void
 * - ariaLabel: Label para accesibilidad
 */
const ResponsiveTabs = ({ tabs, value, onChange, ariaLabel = 'tabs' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel id="mobile-tabs-label">Sección</InputLabel>
        <Select
          labelId="mobile-tabs-label"
          value={value}
          label="Sección"
          onChange={(e) => onChange(null, e.target.value)}
        >
          {tabs.map((tab, index) => (
            <MenuItem key={index} value={tab.value ?? index}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {tab.icon}
                {tab.label}
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  return (
    <Tabs
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      variant="scrollable"
      scrollButtons="auto"
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          icon={tab.icon}
          label={tab.label}
          iconPosition="start"
          value={tab.value ?? index}
        />
      ))}
    </Tabs>
  );
};

export default ResponsiveTabs;
