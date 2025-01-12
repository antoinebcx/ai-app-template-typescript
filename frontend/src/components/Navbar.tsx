import { AppBar, IconButton, Toolbar, Typography, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';

interface NavbarProps {
  onToggleColorMode: () => void;
}

const Navbar = ({ onToggleColorMode }: NavbarProps) => {
  const theme = useTheme();
  const bgColor = theme.palette.mode === 'dark' ? '#101010' : '#f4f4f4';
  
  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{
        background: `linear-gradient(
          ${bgColor} 65%, 
          ${bgColor}ee 72%,
          ${bgColor}dd 75%,
          ${bgColor}cc 79%,
          ${bgColor}aa 83%,
          ${bgColor}88 87%,
          ${bgColor}66 91%,
          ${bgColor}44 94%,
          ${bgColor}22 97%,
          transparent 100%
        )`,
        height: '64px'
      }}
    >
      <Toolbar sx={{
        justifyContent: 'space-between',
        px: { xs: 2, sm: 4 }
      }}>
        <Link
          href="/"
          underline="none"
          sx={{
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              opacity: 0.9
            }
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontSize: '1.35rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #e0e0e0, #ffffff)'
                : 'linear-gradient(45deg, #303030, #1a1a1a)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: theme.palette.mode === 'dark'
                ? '0px 2px 4px rgba(0,0,0,0.2)'
                : 'none'
            }}
          >
            AI app
          </Typography>
        </Link>

        <IconButton
          onClick={onToggleColorMode}
          sx={{
            color: theme.palette.mode === 'dark' ? '#dddddd' : '#303030',
            ml: 2
          }}
        >
          {theme.palette.mode === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
