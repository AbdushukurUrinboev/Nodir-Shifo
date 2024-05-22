"use client"
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { useAuth } from 'src/hooks/use-auth';
import axios from 'axios';
import { base_URL } from 'src/API';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open } = props;
  const router = useRouter();
  const auth = useAuth();

  const [user, setUser] = useState({});

  useEffect(() => {
    const usrID = window.sessionStorage.getItem('userID');
    const isDoc = window.sessionStorage.getItem('isDoctor');
    const fetchURL = isDoc === "true" ? (base_URL + "/doctors/" + usrID) : (base_URL + "/users/" + usrID)
    axios.get(fetchURL, { withCredentials: true })
      .then((resp) => {
        const thisUsr = resp.data
        if (resp.data.firstName) {
          setUser({ fullName: resp.data.firstName + " " + resp.data.lastName });
        } else {
          setUser(thisUsr);
        }
      });
  }, []);

  const handleSignOut = useCallback(
    () => {
      onClose?.();
      auth.signOut();
      router.push('/auth/login');
    },
    [onClose, auth, router]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.fullName}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Chiqish
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
