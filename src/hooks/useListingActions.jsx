import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useFavorites from "./useFavorites";
import { rememberIntent } from "../utils/PostLogin";

// Heart + open behaviour for listing cards. Visitors who are not signed in are sent to sign up,
// and we remember what they wanted so we can finish it after login.
export default function useListingActions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { isFav, toggle } = useFavorites();

  const requireLogin = (message, intent) => {
    rememberIntent(intent);
    navigate("/login", { state: { message } });
  };

  const onToggleFav = (id) => {
    if (!user) return requireLogin("Sign up to save the items you love.", { fav: id, next: pathname + search });
    toggle(id);
  };

  const onOpen = user
    ? undefined
    : (l) => requireLogin("Sign up to view this item.", { next: `/listing/${l.id}` });

  return { isFav, onToggleFav, onOpen };
}