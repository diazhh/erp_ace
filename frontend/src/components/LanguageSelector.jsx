import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
];

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    handleClose();
  };

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <>
      <Tooltip title={t('language.select')}>
        <IconButton color="inherit" onClick={handleOpen}>
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={lang.code === i18n.language}
          >
            <ListItemIcon sx={{ fontSize: '1.2rem', minWidth: 36 }}>
              {lang.flag}
            </ListItemIcon>
            <ListItemText>{lang.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
