import AuthForm from '../components/AuthForm';

export const AdminLogin   = () => <AuthForm role="admin"  mode="login"  />;
export const AdminSignup  = () => <AuthForm role="admin"  mode="signup" />;
export const MemberLogin  = () => <AuthForm role="member" mode="login"  />;
export const MemberSignup = () => <AuthForm role="member" mode="signup" />;
