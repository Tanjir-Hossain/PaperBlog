import DashboardChrome from "@/components/layout/DashboardChrome";
import Protected from "@/components/route/Protected";

export default function DashboardLayout({ children }) {
    return (
        <Protected>
            <DashboardChrome>{children}</DashboardChrome>
        </Protected>
    );
}
