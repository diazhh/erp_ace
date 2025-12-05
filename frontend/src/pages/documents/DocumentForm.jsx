import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Autocomplete,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';

import { 
  fetchDocument, 
  createDocument, 
  updateDocument, 
  fetchDocumentCatalogs, 
  fetchCategories,
  clearCurrentDocument 
} from '../../store/slices/documentSlice';

const DocumentForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentDocument, currentDocumentLoading, catalogs, categories } = useSelector((state) => state.documents);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    documentType: 'OTHER',
    entityType: 'GENERAL',
    entityId: '',
    fileName: '',
    filePath: '',
    fileType: '',
    fileSize: '',
    externalUrl: '',
    issueDate: '',
    expiryDate: '',
    externalNumber: '',
    tags: [],
    confidentialityLevel: 'INTERNAL',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    dispatch(fetchDocumentCatalogs());
    dispatch(fetchCategories());
    if (isEdit) {
      dispatch(fetchDocument(id));
    }
    return () => {
      dispatch(clearCurrentDocument());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (isEdit && currentDocument) {
      setFormData({
        title: currentDocument.title || '',
        description: currentDocument.description || '',
        categoryId: currentDocument.category_id || '',
        documentType: currentDocument.document_type || 'OTHER',
        entityType: currentDocument.entity_type || 'GENERAL',
        entityId: currentDocument.entity_id || '',
        fileName: currentDocument.file_name || '',
        filePath: currentDocument.file_path || '',
        fileType: currentDocument.file_type || '',
        fileSize: currentDocument.file_size || '',
        externalUrl: currentDocument.external_url || '',
        issueDate: currentDocument.issue_date || '',
        expiryDate: currentDocument.expiry_date || '',
        externalNumber: currentDocument.external_number || '',
        tags: currentDocument.tags || [],
        confidentialityLevel: currentDocument.confidentiality_level || 'INTERNAL',
        notes: currentDocument.notes || '',
      });
    }
  }, [isEdit, currentDocument]);

  const handleChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleTagAdd = (event) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput('');
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToDelete),
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      if (isEdit) {
        await dispatch(updateDocument({ id, data: formData })).unwrap();
      } else {
        await dispatch(createDocument(formData)).unwrap();
      }
      navigate('/documents');
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setSaving(false);
    }
  };

  if (isEdit && currentDocumentLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/documents')}
          sx={{ mb: 2 }}
        >
          Volver a Documentos
        </Button>
        <Typography variant="h4" fontWeight="bold">
          {isEdit ? 'Editar Documento' : 'Nuevo Documento'}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Información del Documento
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Título"
                    value={formData.title}
                    onChange={handleChange('title')}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Descripción"
                    value={formData.description}
                    onChange={handleChange('description')}
                    multiline
                    rows={3}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Documento</InputLabel>
                    <Select
                      value={formData.documentType}
                      label="Tipo de Documento"
                      onChange={handleChange('documentType')}
                    >
                      {catalogs?.documentTypes?.map((type) => (
                        <MenuItem key={type.code} value={type.code}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={formData.categoryId}
                      label="Categoría"
                      onChange={handleChange('categoryId')}
                    >
                      <MenuItem value="">Sin categoría</MenuItem>
                      {categories?.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Entidad Relacionada</InputLabel>
                    <Select
                      value={formData.entityType}
                      label="Entidad Relacionada"
                      onChange={handleChange('entityType')}
                    >
                      {catalogs?.entityTypes?.map((type) => (
                        <MenuItem key={type.code} value={type.code}>
                          {type.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Confidencialidad</InputLabel>
                    <Select
                      value={formData.confidentialityLevel}
                      label="Confidencialidad"
                      onChange={handleChange('confidentialityLevel')}
                    >
                      {catalogs?.confidentialityLevels?.map((level) => (
                        <MenuItem key={level.code} value={level.code}>
                          {level.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Número Externo"
                    value={formData.externalNumber}
                    onChange={handleChange('externalNumber')}
                    placeholder="Ej: Número de contrato, licencia..."
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Dates */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fechas
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Emisión"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleChange('issueDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Fecha de Vencimiento"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange('expiryDate')}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* File/URL */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Archivo o Enlace
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL Externa"
                    value={formData.externalUrl}
                    onChange={handleChange('externalUrl')}
                    placeholder="https://..."
                    helperText="Enlace a documento en la nube (Google Drive, OneDrive, etc.)"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Alert severity="info">
                    La carga de archivos locales estará disponible próximamente. 
                    Por ahora, puede usar URLs externas para vincular documentos.
                  </Alert>
                </Grid>
              </Grid>
            </Paper>

            {/* Tags & Notes */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Etiquetas y Notas
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Agregar Etiqueta"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagAdd}
                    placeholder="Escriba y presione Enter"
                    helperText="Presione Enter para agregar etiquetas"
                  />
                  {formData.tags.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                      {formData.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          onDelete={() => handleTagDelete(tag)}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notas"
                    value={formData.notes}
                    onChange={handleChange('notes')}
                    multiline
                    rows={4}
                    placeholder="Notas adicionales sobre el documento..."
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom>
                Acciones
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                  type="submit"
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : (isEdit ? 'Actualizar' : 'Crear Documento')}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/documents')}
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </Box>

              {isEdit && currentDocument && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Información
                  </Typography>
                  <Typography variant="body2">
                    Código: {currentDocument.code}
                  </Typography>
                  <Typography variant="body2">
                    Versión: {currentDocument.version}
                  </Typography>
                  <Typography variant="body2">
                    Estado: {currentDocument.status}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default DocumentForm;
