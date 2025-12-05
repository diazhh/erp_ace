import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';

import { fetchCategories, deleteCategory } from '../../store/slices/documentSlice';
import ConfirmDialog from '../../components/ConfirmDialog';

const moduleColors = {
  GENERAL: 'default',
  EMPLOYEE: 'primary',
  PROJECT: 'secondary',
  CONTRACTOR: 'info',
  VEHICLE: 'warning',
  FINANCE: 'success',
  HSE: 'error',
  LEGAL: 'default',
  ADMINISTRATIVE: 'default',
};

const CategoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { categories, categoriesLoading } = useSelector((state) => state.documents);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleMenuOpen = (event, category) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  const handleDelete = async () => {
    if (selectedCategory) {
      await dispatch(deleteCategory(selectedCategory.id));
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  // Group categories by module
  const categoriesByModule = categories.reduce((acc, cat) => {
    const module = cat.module || 'GENERAL';
    if (!acc[module]) acc[module] = [];
    acc[module].push(cat);
    return acc;
  }, {});

  if (categoriesLoading) {
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

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h4" fontWeight="bold">
            Categorías de Documentos
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/documents/categories/new')}
          >
            Nueva Categoría
          </Button>
        </Box>
      </Box>

      {/* Categories by Module */}
      {Object.entries(categoriesByModule).map(([module, cats]) => (
        <Box key={module} sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderOpenIcon color="action" />
            {module}
            <Chip label={cats.length} size="small" />
          </Typography>

          <Grid container spacing={2}>
            {cats.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FolderIcon color="primary" />
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {category.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {category.code}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, category)}>
                        <MoreIcon />
                      </IconButton>
                    </Box>

                    {category.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {category.description}
                      </Typography>
                    )}

                    <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={category.module} 
                        size="small" 
                        color={moduleColors[category.module]}
                      />
                      {category.requires_expiry && (
                        <Chip label="Requiere vencimiento" size="small" variant="outlined" />
                      )}
                      {category.is_mandatory && (
                        <Chip label="Obligatorio" size="small" color="error" variant="outlined" />
                      )}
                      {!category.is_active && (
                        <Chip label="Inactivo" size="small" color="default" />
                      )}
                    </Box>

                    {category.children && category.children.length > 0 && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                        {category.children.length} subcategorías
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/documents?categoryId=${category.id}`)}
                    >
                      Ver Documentos
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/documents/categories/${category.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {categories.length === 0 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <FolderIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography color="text.secondary" gutterBottom>
            No hay categorías registradas
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/documents/categories/new')}
            sx={{ mt: 2 }}
          >
            Crear Primera Categoría
          </Button>
        </Paper>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { navigate(`/documents/categories/${selectedCategory?.id}/edit`); handleMenuClose(); }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
        </MenuItem>
        <MenuItem onClick={() => { setDeleteDialogOpen(true); }} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Eliminar
        </MenuItem>
      </Menu>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Categoría"
        message={`¿Está seguro de eliminar la categoría "${selectedCategory?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
        onCancel={() => { setDeleteDialogOpen(false); handleMenuClose(); }}
        confirmText="Eliminar"
        confirmColor="error"
      />
    </Box>
  );
};

export default CategoryList;
