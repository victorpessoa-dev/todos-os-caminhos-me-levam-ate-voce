import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";
import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AdminLayout({ children }) {
    return (
        <ProtectedRoute>
            <AdminHeader />
            <main className="pt-16">{children}</main>
            <AdminFooter />
        </ProtectedRoute>
    );
}