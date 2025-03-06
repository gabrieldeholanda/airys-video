import Providers from "@/context/providers";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Wrapper from "@/components/Wrapper";
import Sidebar from "@/components/navigation/Sidebar";
import { isDesktop, isMobile } from "react-device-detect";
import Statusbar from "./components/Statusbar";
import Bottombar from "./components/navigation/Bottombar";
import { Suspense, lazy } from "react";
import { Redirect } from "./components/navigation/Redirect";
import { cn } from "./lib/utils";
import { isPWA } from "./utils/isPWA";
import { useAuth } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/auth/ForgotPassword';
import Profile from './pages/Profile';

const Live = lazy(() => import("@/pages/Live"));
const Events = lazy(() => import("@/pages/Events"));
const Explore = lazy(() => import("@/pages/Explore"));
const Exports = lazy(() => import("@/pages/Exports"));
const ConfigEditor = lazy(() => import("@/pages/ConfigEditor"));
const System = lazy(() => import("@/pages/System"));
const Settings = lazy(() => import("@/pages/Settings"));
const UIPlayground = lazy(() => import("@/pages/UIPlayground"));
const FaceLibrary = lazy(() => import("@/pages/FaceLibrary"));
const Logs = lazy(() => import("@/pages/Logs"));

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

function App() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <Providers>
      <Wrapper>
        <div className={cn(
          "size-full",
          !isAuthPage && "overflow-hidden"
        )}>
          {isDesktop && user && !isAuthPage && <Sidebar />}
          {isDesktop && user && !isAuthPage && <Statusbar />}
          {isMobile && user && !isAuthPage && <Bottombar />}
          <div
            id="pageRoot"
            className={cn(
              "absolute right-0 top-0",
              !isAuthPage && "overflow-hidden",
              isAuthPage ? "w-full left-0" : (
                isMobile
                  ? `bottom-${isPWA ? 16 : 12} left-0 md:bottom-16 landscape:bottom-14 landscape:md:bottom-16`
                  : "bottom-8 left-[52px]"
              )
            )}
          >
            <Suspense>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* User Account Routes */}
                <Route
                  path="/account"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/account/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />

                {/* Main Frigate Routes - Protected */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Live />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events"
                  element={
                    <PrivateRoute>
                      <Redirect to="/review" />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/review"
                  element={
                    <PrivateRoute>
                      <Events />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/explore"
                  element={
                    <PrivateRoute>
                      <Explore />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/export"
                  element={
                    <PrivateRoute>
                      <Exports />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/system"
                  element={
                    <PrivateRoute>
                      <System />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/config"
                  element={
                    <PrivateRoute>
                      <ConfigEditor />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/logs"
                  element={
                    <PrivateRoute>
                      <Logs />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/playground"
                  element={
                    <PrivateRoute>
                      <UIPlayground />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/faces"
                  element={
                    <PrivateRoute>
                      <FaceLibrary />
                    </PrivateRoute>
                  }
                />
                <Route path="*" element={<Redirect to="/" />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </Wrapper>
    </Providers>
  );
}

export default App;
