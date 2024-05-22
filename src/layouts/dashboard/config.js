import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import NewspaperIcon from '@heroicons/react/24/solid/NewspaperIcon';
import Square3Stack3DIcon from '@heroicons/react/24/solid/Square3Stack3DIcon';
import IdentificationIcon from '@heroicons/react/24/solid/IdentificationIcon';
import ShieldCheckIcon from '@heroicons/react/24/solid/ShieldCheckIcon';
import ArrowPathRoundedSquareIcon from '@heroicons/react/24/solid/ArrowPathRoundedSquareIcon';
import { SvgIcon } from '@mui/material';

const adminPages = ['/administration', '/doctors', '/companies', '/diseases']; // shular bo'ladi
const managerPage = ['/doctorsPage', '/navbat', '/account']; // shular bo'lmaydi
const doctorsPage = ['/doctorsPage']; // shu bo'ladi
const navbatPage = ['/navbat']; // shu bo'ladi

export const items = [
  {
    title: 'Umumiy',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Administratsiya',
    path: '/administration',
    icon: (
      <SvgIcon fontSize="small">
        <NewspaperIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Doktorlar',
    path: '/doctors',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: "Bo'limlar",
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <Square3Stack3DIcon />
      </SvgIcon>
    )
  },
  {
    title: "Kasalliklar",
    path: '/diseases',
    icon: (
      <SvgIcon fontSize="small">
        <IdentificationIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Doktor oynasi',
    path: '/doctorsPage',
    icon: (
      <SvgIcon fontSize="small">
        <ShieldCheckIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Navbatlar',
    path: '/navbat',
    icon: (
      <SvgIcon fontSize="small">
        <ArrowPathRoundedSquareIcon />
      </SvgIcon>
    )
  },

  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Xisobot',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Login',
    path: '/auth/login',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  {
    title: 'Error',
    path: '/404',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  }
];

export const adminAllowedPages = items.filter((pg) => adminPages.includes(pg.path));
export const managerAllowedPages = items.filter((pg) => !managerPage.includes(pg.path));
export const doctorAllowedPages = items.filter((pg) => doctorsPage.includes(pg.path));
export const navbatAllowedPages = items.filter((pg) => navbatPage.includes(pg.path));
