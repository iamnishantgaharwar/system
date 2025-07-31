import { useEffect, useRef } from "react";
import { useAppDispatch } from "../store/hooks";
import { fetchProfile } from "../store/thunk/profileService";

const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const hasFetchedRef = useRef(false);


  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchProfile())
    }
  }, [dispatch]);
};

export default useAuthInit;
