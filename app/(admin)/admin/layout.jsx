import AdminHeader from "../../../components/AdminHeader";
import AdminFooter from "../../../components/AdminFooter";

export default function AdminLayout({ children }) {
    return (
        <>
            <AdminHeader />
            <main className="pt-16">{children}</main>
            <AdminFooter />
        </>
    );
}