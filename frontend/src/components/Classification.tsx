import { Paper, Stack, Typography, Box, useTheme } from '@mui/material';
import { ClassificationResult } from '../types/analysis';

interface ClassificationProps {
  data: ClassificationResult;
}

export const Classification: React.FC<ClassificationProps> = ({ data }) => {
  const theme = useTheme();

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return theme.palette.success.main;
    if (confidence >= 0.5) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        width: '100%',
      }} 
      elevation={0}
    >
      <Stack direction="row" spacing={4} justifyContent="center">
        <Box textAlign="center">
          <Typography color="text.secondary">
            Category
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            {data.category}
          </Typography>
        </Box>
        <Box textAlign="center">
          <Typography color="text.secondary">
            Confidence
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 1,
              color: getConfidenceColor(data.confidence)
            }}
          >
            {(data.confidence * 100).toFixed(1)}%
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
