import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Divider,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  Chip,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Code as CodeIcon,
  Visibility as PreviewIcon,
  ContentCopy as CopyIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  FormatListBulleted as ListIcon,
  Title as HeadingIcon,
  DataObject as VariableIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

// Sample data for preview
const SAMPLE_DATA = {
  appName: 'ERP Atilax',
  userName: 'Juan Pérez',
  userEmail: 'juan.perez@empresa.com',
  verificationCode: '123456',
  verificationUrl: 'https://erp.atilax.io/verify?code=abc123',
  resetUrl: 'https://erp.atilax.io/reset-password?token=xyz789',
  companyName: 'Empresa Demo S.A.',
  currentYear: new Date().getFullYear().toString(),
  supportEmail: 'soporte@atilax.io',
};

// Mustache-like template rendering
const renderTemplate = (template, data) => {
  if (!template) return '';
  let result = template;
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, value);
  });
  return result;
};

// Highlight Mustache variables in code
const highlightVariables = (html) => {
  if (!html) return '';
  return html.replace(
    /(\{\{[^}]+\}\})/g,
    '<span style="background-color: #fff3e0; color: #e65100; padding: 2px 4px; border-radius: 3px; font-weight: 500;">$1</span>'
  );
};

const EmailTemplateEditor = ({
  template,
  value,
  onChange,
  variables = [],
  readOnly = false,
}) => {
  const theme = useTheme();
  const textareaRef = useRef(null);
  const [viewMode, setViewMode] = useState('split'); // 'code', 'preview', 'split'
  const [variablesExpanded, setVariablesExpanded] = useState(true);
  const [copiedVar, setCopiedVar] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  // Merge sample data with any custom variables
  const previewData = useMemo(() => {
    const customData = {};
    variables.forEach(v => {
      if (!SAMPLE_DATA[v.name]) {
        customData[v.name] = v.example || `[${v.name}]`;
      }
    });
    return { ...SAMPLE_DATA, ...customData };
  }, [variables]);

  // Rendered preview HTML
  const previewHtml = useMemo(() => {
    return renderTemplate(value, previewData);
  }, [value, previewData]);

  // Insert text at cursor position
  const insertAtCursor = useCallback((text) => {
    if (readOnly) return;
    
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.substring(0, start) + text + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after inserted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + text.length, start + text.length);
      }, 0);
    } else {
      onChange(value + text);
    }
  }, [value, onChange, readOnly]);

  // Insert variable
  const handleInsertVariable = useCallback((varName) => {
    insertAtCursor(`{{${varName}}}`);
    setCopiedVar(varName);
    setTimeout(() => setCopiedVar(null), 1500);
  }, [insertAtCursor]);

  // Copy variable to clipboard
  const handleCopyVariable = useCallback((varName) => {
    navigator.clipboard.writeText(`{{${varName}}}`);
    setCopiedVar(varName);
    setTimeout(() => setCopiedVar(null), 1500);
  }, []);

  // Insert HTML formatting
  const insertHtmlTag = useCallback((tag, attrs = '') => {
    const textarea = textareaRef.current;
    if (!textarea || readOnly) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText;
    if (tag === 'a') {
      newText = `<a href="URL"${attrs}>${selectedText || 'Texto del enlace'}</a>`;
    } else if (tag === 'img') {
      newText = `<img src="URL" alt="Descripción" style="max-width: 100%;" />`;
    } else if (tag === 'ul') {
      newText = `<ul>\n  <li>${selectedText || 'Elemento'}</li>\n</ul>`;
    } else if (tag === 'h2') {
      newText = `<h2>${selectedText || 'Título'}</h2>`;
    } else {
      newText = `<${tag}>${selectedText}</${tag}>`;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + newText.length, start + newText.length);
    }, 0);
  }, [value, onChange, readOnly]);

  // Track cursor position
  const handleSelect = useCallback((e) => {
    setCursorPosition(e.target.selectionStart);
  }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Toolbar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 1, 
          mb: 2, 
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderRadius: 2,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {/* View Mode Toggle */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, v) => v && setViewMode(v)}
          size="small"
        >
          <ToggleButton value="code">
            <Tooltip title="Solo código">
              <CodeIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="split">
            <Tooltip title="Dividido">
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CodeIcon fontSize="small" />
                <PreviewIcon fontSize="small" />
              </Box>
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="preview">
            <Tooltip title="Solo preview">
              <PreviewIcon fontSize="small" />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Formatting Buttons */}
        {!readOnly && viewMode !== 'preview' && (
          <>
            <Tooltip title="Negrita">
              <IconButton size="small" onClick={() => insertHtmlTag('strong')}>
                <BoldIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cursiva">
              <IconButton size="small" onClick={() => insertHtmlTag('em')}>
                <ItalicIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Subrayado">
              <IconButton size="small" onClick={() => insertHtmlTag('u')}>
                <UnderlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Título">
              <IconButton size="small" onClick={() => insertHtmlTag('h2')}>
                <HeadingIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Enlace">
              <IconButton size="small" onClick={() => insertHtmlTag('a')}>
                <LinkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Imagen">
              <IconButton size="small" onClick={() => insertHtmlTag('img')}>
                <ImageIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Lista">
              <IconButton size="small" onClick={() => insertHtmlTag('ul')}>
                <ListIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* Variables Toggle */}
        <Button
          size="small"
          startIcon={<VariableIcon />}
          endIcon={variablesExpanded ? <CollapseIcon /> : <ExpandIcon />}
          onClick={() => setVariablesExpanded(!variablesExpanded)}
          sx={{ textTransform: 'none' }}
        >
          Variables ({variables.length})
        </Button>
      </Paper>

      {/* Variables Panel */}
      <Collapse in={variablesExpanded}>
        <Paper 
          elevation={0}
          sx={{ 
            p: 2, 
            mb: 2, 
            bgcolor: alpha(theme.palette.info.main, 0.04),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <InfoIcon fontSize="small" color="info" />
            <Typography variant="subtitle2" color="info.main">
              Variables Mustache disponibles
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
              Click para insertar
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {variables.map((v) => (
              <Tooltip 
                key={v.name} 
                title={
                  <Box>
                    <Typography variant="body2">{v.description}</Typography>
                    {v.example && (
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Ejemplo: {v.example}
                      </Typography>
                    )}
                  </Box>
                }
                arrow
              >
                <Chip
                  icon={copiedVar === v.name ? <CheckIcon /> : <VariableIcon />}
                  label={`{{${v.name}}}`}
                  size="small"
                  color={copiedVar === v.name ? 'success' : 'default'}
                  onClick={() => handleInsertVariable(v.name)}
                  onDelete={() => handleCopyVariable(v.name)}
                  deleteIcon={
                    <Tooltip title="Copiar">
                      <CopyIcon fontSize="small" />
                    </Tooltip>
                  }
                  sx={{
                    fontFamily: 'monospace',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                />
              </Tooltip>
            ))}
            {variables.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No hay variables definidas para esta plantilla
              </Typography>
            )}
          </Box>
        </Paper>
      </Collapse>

      {/* Editor Area */}
      <Grid container spacing={2} sx={{ flexGrow: 1, minHeight: 400 }}>
        {/* Code Editor */}
        {(viewMode === 'code' || viewMode === 'split') && (
          <Grid item xs={12} md={viewMode === 'split' ? 6 : 12}>
            <Paper 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: alpha(theme.palette.grey[500], 0.08),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <CodeIcon fontSize="small" color="action" />
                <Typography variant="subtitle2" color="text.secondary">
                  Código HTML
                </Typography>
              </Box>
              <TextField
                inputRef={textareaRef}
                fullWidth
                multiline
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onSelect={handleSelect}
                disabled={readOnly}
                placeholder="Escribe tu plantilla HTML aquí...&#10;&#10;Usa {{variable}} para insertar variables dinámicas."
                InputProps={{
                  sx: {
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    '& textarea': {
                      minHeight: 350,
                    },
                  },
                }}
                sx={{
                  flexGrow: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 0,
                    '& fieldset': { border: 'none' },
                  },
                }}
              />
            </Paper>
          </Grid>
        )}

        {/* Preview */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <Grid item xs={12} md={viewMode === 'split' ? 6 : 12}>
            <Paper 
              elevation={0}
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Box 
                sx={{ 
                  px: 2, 
                  py: 1, 
                  bgcolor: alpha(theme.palette.success.main, 0.08),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <PreviewIcon fontSize="small" color="success" />
                <Typography variant="subtitle2" color="text.secondary">
                  Vista Previa
                </Typography>
                <Chip 
                  label="Datos de ejemplo" 
                  size="small" 
                  variant="outlined"
                  sx={{ ml: 'auto', fontSize: '0.7rem' }}
                />
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  p: 2,
                  overflow: 'auto',
                  bgcolor: '#fff',
                  minHeight: 350,
                }}
              >
                {previewHtml ? (
                  <Box
                    sx={{
                      '& a': { color: theme.palette.primary.main },
                      '& img': { maxWidth: '100%' },
                      '& h1, & h2, & h3': { 
                        color: theme.palette.text.primary,
                        marginTop: 0,
                      },
                      '& p': { margin: '0.5em 0' },
                    }}
                    dangerouslySetInnerHTML={{ __html: previewHtml }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      height: '100%',
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="body2">
                      Escribe HTML para ver la vista previa
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Help Text */}
      <Alert 
        severity="info" 
        icon={<InfoIcon />}
        sx={{ mt: 2 }}
      >
        <Typography variant="body2">
          <strong>Sintaxis Mustache:</strong> Usa <code>{`{{nombreVariable}}`}</code> para insertar valores dinámicos. 
          Las variables se reemplazarán automáticamente al enviar el correo.
        </Typography>
      </Alert>
    </Box>
  );
};

export default EmailTemplateEditor;
