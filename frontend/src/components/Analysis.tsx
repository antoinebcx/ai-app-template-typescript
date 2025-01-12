import { Paper, Stack } from '@mui/material';

interface AnalysisProps {
  data: unknown;
}

export const Analysis: React.FC<AnalysisProps> = ({ data }) => {
  return (
    <Paper sx={{ p: 3, width: '100%' }} elevation={0}>
      <Stack 
        component="pre" 
        sx={{ 
          m: 0,
          fontSize: '0.875rem',
          fontFamily: 'monospace',
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: 2,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          lineHeight: 1.5
        }}
      >
        {JSON.stringify(data, null, 2)}
      </Stack>
    </Paper>
  );
};
