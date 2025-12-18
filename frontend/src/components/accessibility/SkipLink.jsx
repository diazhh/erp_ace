import { Box, Link } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SkipLink = ({ mainContentId = 'main-content' }) => {
  const { t } = useTranslation();

  return (
    <Link
      href={`#${mainContentId}`}
      sx={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        zIndex: 9999,
        '&:focus': {
          position: 'fixed',
          top: 8,
          left: 8,
          width: 'auto',
          height: 'auto',
          padding: '16px 24px',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          borderRadius: 2,
          textDecoration: 'none',
          fontWeight: 'bold',
          boxShadow: 4,
          outline: '2px solid',
          outlineColor: 'primary.dark',
          outlineOffset: 2,
        },
      }}
    >
      {t('accessibility.skipToContent', 'Saltar al contenido principal')}
    </Link>
  );
};

export default SkipLink;
