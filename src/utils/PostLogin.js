// Remembers what a visitor was trying to do, so we can finish it after they sign up.
const NEXT = "kartly:next";
const PENDING_FAV = "kartly:pendingFav";
const FAVS = "kartly:favorites"; // same key as hooks/useFavorites.js

export function rememberIntent({ next, fav } = {}) {
  try {
    if (next) sessionStorage.setItem(NEXT, next);
    if (fav) sessionStorage.setItem(PENDING_FAV, String(fav));
  } catch { /* ignore */ }
}

// Call once after login succeeds. Saves the pending heart and returns where to go (always home).
export function consumeIntent() {
  let next = "/";
  try {
    const fav = sessionStorage.getItem(PENDING_FAV);
    if (fav) {
      const list = JSON.parse(localStorage.getItem(FAVS)) || [];
      if (!list.includes(fav)) list.push(fav);
      localStorage.setItem(FAVS, JSON.stringify(list));
      sessionStorage.removeItem(PENDING_FAV);
    }
    // after login everyone lands on the home page (the buyer dashboard)
    sessionStorage.removeItem(NEXT);
  } catch { /* ignore */ }
  return next;
}