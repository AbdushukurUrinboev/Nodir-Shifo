import { useTheme } from '@mui/material/styles';
import Image from 'next/image'

export const Logo = () => {
  const theme = useTheme();
  const fillColor = theme.palette.primary.main;

  return (
    <Image
      src="/assets/mylogo.png"
      width={160}
      height={120}
      alt="Picture of the author"      
    />
  );
};
