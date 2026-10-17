import DashboardChrome from "@/components/layout/DashboardChrome";
import Protected from "@/components/route/Protected";

export default function AdminLayout({ children }) {
    return (
        <Protected requireAdmin>
            <DashboardChrome>{children}</DashboardChrome>
        </Protected>
    );
}
