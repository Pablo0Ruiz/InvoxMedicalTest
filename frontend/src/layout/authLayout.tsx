import { Outlet } from "react-router-dom";




const AuthLayout = () => {
  return (
    <>
      <main className="min-h-screen bg-blue-500">
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
