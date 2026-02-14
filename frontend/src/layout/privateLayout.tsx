import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <div className="min-h-screen bg-blue-500">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PrivateLayout;
