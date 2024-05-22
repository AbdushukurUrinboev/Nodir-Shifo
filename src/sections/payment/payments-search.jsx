import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const PaymentsSearch = ({searchQuery, setSearchQuery}) => (
  <Card sx={{ p: 0 }}>
    <OutlinedInput
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      fullWidth
      placeholder="Qidirish..."
      startAdornment={(
        <InputAdornment position="start">
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      sx={{ maxWidth: "100%" }}
    />
  </Card>
);
