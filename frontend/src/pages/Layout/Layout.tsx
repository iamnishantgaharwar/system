import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";


const Layout = () => {
  return (
    <>
    <div className="flex flex-col h-screen z-20">
      <nav className="sticky top-0">
        <Navbar />
      </nav>
      <div className="grow-1">
        <Outlet />
      </div>
      <div className="text-center text-muted-foreground text-xs border">Footer</div>
    </div>
    </>
  );
};

export default Layout;
