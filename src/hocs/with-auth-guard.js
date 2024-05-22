import { AuthGuard } from 'src/guards/auth-guard';
import { AllRouterGuard } from 'src/guards/auth-guard';

export const withAuthGuard = (Component) => (props) => (
  <AuthGuard>
    <Component {...props} />
  </AuthGuard>
);
export const withAllRouterGuard = (Component) => (props) => (
  <AllRouterGuard>
    <Component {...props} />
  </AllRouterGuard>
);
