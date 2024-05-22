import PropTypes from 'prop-types';
import PencilSquareIcon from '@heroicons/react/24/solid/PencilSquareIcon';
import TrashIcon from '@heroicons/react/24/solid/TrashIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';

export const CompanyCard = (props) => {
  const { company } = props;
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      
      <CardContent>
        
        <Typography
          align="center"
          gutterBottom
          variant="h5"
        >
          {company.categoryName}
        </Typography>
        
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      {/* <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <PencilSquareIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
            style={{fontWeight: '500'}}
          >
            O'zgartirish
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <TrashIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
            style={{fontWeight: '500'}}
          >
            O'chirish
          </Typography>
        </Stack>
      </Stack> */}
    </Card>
  );
};

CompanyCard.propTypes = {
  company: PropTypes.object.isRequired
};
