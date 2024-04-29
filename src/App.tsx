import { Toaster } from "@/components/ui/sonner";
import { PRIVATE_ROUTES, PUBLIC_ROUTES } from "@/constants/routes";
import RequireAuth from "@/guards/private-router.guard";
import NoRequireAuth from "@/guards/public-route.guard";
import { Role } from "@/models/user.model";
import Login from "@/pages/Login/Login";
import Unauthorized from "@/pages/Unauthorized/Unauthorized";
import { validateSession } from "@/services/auth.services";
import { useAuth } from "@/stores/auth.store";
import { createAppUserFromResponseUser } from "@/utils/create-user-from-response.util";
import { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

function App() {
  const token = useAuth((state) => state.token);
  const setUser = useAuth((state) => state.setUser);
  const logout = useAuth((state) => state.logout);

  useEffect(() => {
    const validateUser = async (token: string) => {
      try {
        const userInfo = await validateSession(token);
        setUser(createAppUserFromResponseUser(userInfo));
      } catch (error) {
        logout();
      }
    };

    // Validate user session if token exists
    if (token) validateUser(token);
  }, [token, setUser, logout]);

  return (
    <>
      <Router>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route element={<NoRequireAuth />}>
            <Route path={PUBLIC_ROUTES.LOGIN} element={<Login />} />
            <Route
              path={PUBLIC_ROUTES.UNAUTHORIZED}
              element={<Unauthorized />}
            />
          </Route>

          {/* PRIVATE ROUTES */}
          <Route
            element={
              <RequireAuth allowedRoles={[Role.ADMIN, Role.CONTENT_MANAGER]} />
            }
          >
            <Route path={PRIVATE_ROUTES.HOME} element={<h1>Home</h1>} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </>
  );
}

export default App;
