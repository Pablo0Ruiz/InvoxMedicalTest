
const ROOT = "/";
const DASHBOARD = "/dashboard";

export const routes = {
    root: ROOT,
    landing: "/landing",
    auth: {
        root: "/auth",
        login: "/auth/login",
        register: "/auth/register",
        verify: "/auth/verify",
    },

    dashboard: {
        root: DASHBOARD,
    },
} as const;

export default routes;