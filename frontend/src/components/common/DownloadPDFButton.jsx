import { useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../services/api';

/**
 * Botón reutilizable para descargar reportes PDF
 * @param {string} endpoint - Endpoint del API para descargar el PDF (ej: '/reports/transactions/123')
 * @param {string} filename - Nombre del archivo a descargar
 * @param {string} label - Texto del botón (opcional)
 * @param {string} variant - Variante del botón (outlined, contained, text)
 * @param {string} color - Color del botón
 * @param {boolean} fullWidth - Si el botón ocupa todo el ancho
 * @param {string} size - Tamaño del botón (small, medium, large)
 */
const DownloadPDFButton = ({
  endpoint,
  filename,
  label,
  variant = 'outlined',
  color = 'primary',
  fullWidth = false,
  size = 'medium',
  disabled = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!endpoint) {
      toast.error(t('common.downloadError', 'Error al descargar PDF'));
      return;
    }

    setLoading(true);
    try {
      const response = await api.get(endpoint, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || 'documento.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(t('common.downloadSuccess', 'PDF descargado correctamente'));
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error(t('common.downloadError', 'Error al descargar PDF'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      color={color}
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PdfIcon />}
      onClick={handleDownload}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      size={size}
      {...props}
    >
      {label || t('common.downloadPDF', 'Descargar PDF')}
    </Button>
  );
};

export default DownloadPDFButton;
