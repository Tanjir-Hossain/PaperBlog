import { Lora, Plus_Jakarta_Sans } from "next/font/google";

import { APP_NAME, APP_TAGLINE } from "@/lib/constants";
import { AuthProvider } from "@/providers/AuthProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    display: "swap"
});

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora",
    display: "swap"
});

export const metadata = {
    title: {
        default: `${APP_NAME} — Blog Management`,
        template: `%s · ${APP_NAME}`
    },
    description: APP_TAGLINE
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={`${jakarta.variable} ${lora.variable}`}>
            <body className="min-h-screen antialiased">
                <NotificationProvider>
                    <AuthProvider>{children}</AuthProvider>
                </NotificationProvider>
            </body>
        </html>
    );
}
