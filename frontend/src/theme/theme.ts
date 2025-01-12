import { PaletteMode, createTheme } from '@mui/material';
import { TypographyOptions } from '@mui/material/styles/createTypography';

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: {
            main: '#000000',
          },
          background: {
            default: '#f5f5f5',
            paper: '#ffffff',
          },
          text: {
            primary: '#000000',
          },
        }
      : {
          primary: {
            main: '#ffffff',
          },
          background: {
            default: '#101010',
            paper: '#18181B',
          },
          text: {
            primary: '#ffffff',
          },
        }),
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  } as TypographyOptions,
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
  },
});

export const theme = createTheme(getDesignTokens('light'));