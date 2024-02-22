import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Dashboard from './pages/Dashboard';
import Apartment from './pages/Apartment/Apartment.tsx';
import ApartmentUnit from './pages/Apartment/Unit/ApartmentUnit.tsx';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>

        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="로그인 | Admin - Car Admin Signin" />
              <SignIn />
            </>
          }
        />

        <Route
          index
          element={
            <>
              <PageTitle title="메인 | Admin - Car Admin Dashboard" />
              <Dashboard />
            </>
          }
        />

        <Route
          path="/admin/apartment"
          element={
            <>
              <PageTitle title="아파트 | Admin - Car Admin Apartment" />
              <Apartment />
            </>
          }
        />

        <Route
          path="/apartment/unit"
          element={
            <>
              <PageTitle title="세대 | Admin - Car Admin Apartment Unit" />
              <ApartmentUnit />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;
