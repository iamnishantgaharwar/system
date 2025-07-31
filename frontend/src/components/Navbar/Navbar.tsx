import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logoutUser } from "../../store/thunk/authService";
import { Button } from "../ui/button";

const Navbar = () => {
  const userName = useAppSelector(state => state.user.user?.fullname)
  const userLoading = useAppSelector(state => state.user.loading)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser()).then(() => navigate("/"))
    toast.success("Logout Successfully")
  }

  return (
    <div className="py-4 px-8 mb-8 border-b flex justify-between items-center">
      <span className="font-bold text-2xl ">Your Logo</span>
      <div className="flex items-center gap-4">
        <span className="font-semibold">{userLoading ? "Loading..." : userName}</span>
        {userName && <Button onClick={handleLogout}>Logout</Button>}
      </div>
    </div>
  );
};

export default Navbar;
