import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Dashboard from './pages/Dashboard';
import Apartment from './pages/Apartment/Apartment.tsx';
import ApartmentUnit from './pages/Apartment/Unit/ApartmentUnit.tsx';
import DeviceErrorLog from './pages/Error/DeviceErrorLog.tsx';
import Device from './pages/Device/Device.tsx';
import Car from './pages/Car/Car.tsx';
import ApartmentUnitCar from './pages/Car/ApartmentUnitCar.tsx';
import CarLog from './pages/Log/CarLog.tsx';
import CarEntryInsert from './pages/Log/CarEntryInsert.tsx';
import ApartmentSetting from './pages/Setting/ApartmentSetting.tsx';
import Profile from './pages/Profile.tsx';
import { RecoilRoot } from 'recoil';

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
    <RecoilRoot>
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

        <Route
          path="/l/error"
          element={
            <>
              <PageTitle title="로그 | Admin - Car Admin Device Error Log" />
              <DeviceErrorLog />
            </>
          }
        />

        <Route
          path="/device"
          element={
            <>
              <PageTitle title="장치 | Admin - Car Admin Device" />
              <Device />
            </>
          }
        />

        <Route
          path="/car"
          element={
            <>
              <PageTitle title="차량 | Admin - Car Admin Car" />
              <Car />
            </>
          }
        />

        <Route
          path="/car-unit"
          element={
            <>
              <PageTitle title="세대별 차량 | Admin - Car Admin Apartment Unit Car" />
              <ApartmentUnitCar />
            </>
          }
        />


        <Route
          path="/c/log"
          element={
            <>
              <PageTitle title="입출차 내역 | Admin - Car Admin Car Log" />
              <CarLog />
            </>
          }
        />

        <Route
          path="/c/insert"
          element={
            <>
              <PageTitle title="입출차 신청 | Admin - Car Admin Car Entry Insert" />
              <CarEntryInsert />
            </>
          }
        />

        <Route
          path="/setting"
          element={
            <>
              <PageTitle title="설정 | Admin - Car Admin Setting" />
              <ApartmentSetting />
            </>
          }
        />

        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="내정보 | Admin - Car Admin Profile" />
              <Profile />
            </>
          }
        />

      </Routes>
    </RecoilRoot>
  );
}

export default App;
