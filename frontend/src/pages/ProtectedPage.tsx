import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { LockKeyhole } from "lucide-react";

interface ProtectedPageProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedPage = ({ children, allowedRoles }: ProtectedPageProps) => {
  const userRole = useAppSelector((state) => state.user.user?.role);
  const userName = useAppSelector((state) => state.user.user?.fullname);
  const isLoading = useAppSelector((state) => state.user.loading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  if (!userName) {
    return <Navigate to="/" />;
  }
  const normalizedUserRole = Array.isArray(userRole) && userRole.map(role => role.toLowerCase())
    
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  const hasAccess = Array.isArray(normalizedUserRole)
    ? normalizedUserRole.some((role) => normalizedAllowedRoles.includes(role))
    : normalizedAllowedRoles.includes(normalizedUserRole || '');
  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-full ">
        <LockKeyhole className="h-24 w-24 text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-4">403 - Unauthorized</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
