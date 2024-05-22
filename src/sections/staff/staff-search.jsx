import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const StaffSearch = ({searchQuery, setSearchQuery}) => (
  <Card sx={{ p: 2 }}>
    <OutlinedInput
      value={searchQuery}
      onChange={e => setSearchQuery(e.target.value)}
      fullWidth
      placeholder="Qidirish"
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
      sx={{ maxWidth: 500 }}
    />
  </Card>
);
