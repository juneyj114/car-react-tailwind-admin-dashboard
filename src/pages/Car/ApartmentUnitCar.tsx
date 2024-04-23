import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Loader from '../../common/Loader/index.tsx';
import LeftArrow from '../../components/Arrow/LeftArrow.tsx';
import RightArrow from '../../components/Arrow/RightArrow.tsx';
import { Pageable } from '../../types/pageable.ts';
import AddButton from '../../components/Button/Add.tsx';
import AddUnitCarModal from './AddUnitCarModal.tsx';
import UnregonizedCarModal from './UnrecognizedCarModal.tsx';

interface CarUnit {
  totalCount: number;
  dongList: CarUnitDongSummary[];
}

interface CarUnitDongSummary {
  dong: string;
  count: number;
}

interface CarUnitDong {
  unitId: number;
  ho: string;
  vehicleNumber: Vehicle[];
  count: number;
}

interface Vehicle {
  id: number;
  vehicleNumber: string;
  addition: string[];
}

interface AddUnitCar {
  unitId: number;
  vehicleNumber: string;
  phone: string;
}

interface AddUnrecognizedCar {
  vehicleId: number;
  vehicleNumber: string;
}

const ApartmentUnitCar: React.FC = () => {
  const [inboxSidebarToggle, setInboxSidebarToggle] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dongLoading, setDongLoading] = useState<boolean>(true);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [carUnitData, setCarUnitData] = useState<CarUnit>();
  const [carUnitDongData, setCarUnitDongData] = useState<Pageable<CarUnitDong[]>>();
  const [currentDong, setCurrentDong] = useState();
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>();
  const [isVehicleSelected, setIsVehicleSelected] = useState(false); // 차량번호가 선택되어 있는지 여부
  const [additionalVehicleNumbers, setAdditionalVehicleNumbers] = useState<string[]>([]);

  const carUnitUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_ENDPOINT;
  const carUnitDongUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_DONG_ENDPOINT;
  const delUnitCarUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_REGISTER_DELETE_ENDPOINT;

  const getCarUnit = async () => {
    try {
      setLoading(true);
      const response = await axios.get(carUnitUrl, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setCarUnitData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getCarUnitDongData = async (dong) => {
    try {
      setDongLoading(true);
      const response = await axios.get(carUnitDongUrl, {
        headers: {
          Authorization: cookies.accessToken
        },
        params: {
          dong: dong
        }
      });
      setCarUnitDongData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setDongLoading(false);
    }
  };

  const addUnitCarHandler = async (unitId, vehicleNumber, phone) => {
    // console.log(unitId);
    const addUnitCar: AddUnitCar = {
      unitId,
      vehicleNumber,
      phone
    };

    // console.log(addUnitCar);

    try{
      const response = await axios.post(carUnitDongUrl , addUnitCar, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      // console.log(response);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      getCarUnitDongData(currentDong);
    }
  };

  const delUnitCarHandler = async ({unitId, ho}) => {
    // console.log(`UnitId:${unitId} / ${currentDong}동 / ${ho}호 / ${selectedVehicle.vehicleNumber}`);

    if (!selectedVehicle) {
      alert('삭제할 차량을 선택헤주세요.');
      return;
    }

    if (confirm(`${currentDong}동 ${ho}호 ${selectedVehicle.vehicleNumber}차량을 삭제하시겠습니까?`)) {
      try{
        await axios.put(delUnitCarUrl, {}, {
          headers: {
            Authorization: cookies.accessToken
          },
          params: {
            unitId,
            vehicleId: selectedVehicle.id
          }
        });
        alert('삭제 완료되었습니다.');
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        getCarUnitDongData(currentDong);
      }
    }

    
  };

  const dongClickHandle = (dong) => {
    setCurrentDong(dong);
    getCarUnitDongData(dong);
  };

  const selectVehicleHandle = (vehicle: Vehicle) => {
    if (selectedVehicle && vehicle.id === selectedVehicle.id) {
      setSelectedVehicle(null);
      setIsVehicleSelected(false);
    } else {
      setSelectedVehicle(vehicle);
      setIsVehicleSelected(true);
      const additionalVehicleNumbers = vehicle.addition ? vehicle.addition.map(addition => addition) : [];
      setAdditionalVehicleNumbers(additionalVehicleNumbers);
    }
  };

  useEffect(() => {
    getCarUnit();
  }, []);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="세대별 차량 목록" rootPage="차량" />
      {loading? (<Loader/>) : (
        <div className="sm:h-[calc(100vh-174px)] h-[calc(100vh-186px)] overflow-hidden">
        <div
          className="h-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark lg:flex">
          <div
            className={`lg:w-1/5 fixed bottom-0 top-22.5 z-999 flex w-[230px] -translate-x-[120%] flex-col rounded-md border border-stroke bg-white dark:border-strokedark dark:bg-boxdark lg:static lg:translate-x-0 lg:border-none ${
              inboxSidebarToggle && '!translate-x-0 duration-300 ease-linear'
            }`}
          >
            <div className="no-scrollbar max-h-full overflow-auto py-6">
              <ul className="flex flex-col gap-2">
                {carUnitData.dongList.map((dong, index) => {
                  return (
                    <li key={index} >
                      <div
                        onClick={() => {dongClickHandle(dong.dong)}}
                        className="relative flex items-center gap-2.5 py-2.5 px-5 font-medium duration-300 ease-linear cursor-pointer before:absolute before:left-0 before:h-0 before:w-1 before:bg-primary before:duration-300 before:ease-linear hover:bg-primary/5 hover:text-primary hover:before:h-full"
                      >
                        <div className='flex justify-between w-full gap-1.5'>
                          <div>{dong.dong}동</div>
                          <div className='text-sm'>{`${dong.count}대`}</div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              {/* <InboxMenuList /> */}
            </div>
            <div className='p-5 absolute bottom-0 flex justify-between w-full'>
              <div>전체 차량 대수</div>
              <div className='text-sm'>{`${carUnitData.totalCount}대`}</div>
            </div>
          </div>
          <div className="lg:w-4/5 flex h-full flex-col border-l border-stroke dark:border-strokedark">
            {/* <!-- ====== Inbox List Start --> */}
            <div className="h-full">
              <table className="h-full w-full table-auto">
                <thead>
                  <tr className="flex border-y border-stroke dark:border-strokedark">
                    <th className="w-[15%] py-6 pl-4 pr-4 lg:pl-10">
                      <p className="text-left font-medium">호수</p>
                    </th>
                    <th className="w-[85%] hidden py-6 px-4 xl:block">
                      <p className="text-left font-medium">차량번호</p>
                    </th>
                  </tr>
                </thead>
                <tbody className="block h-full max-h-full overflow-auto py-4">
                  {dongLoading ? null : carUnitDongData.content.map((vehicles, index) => {
                    return (
                      <tr className="flex cursor-pointer items-center hover:bg-whiten dark:hover:bg-boxdark-2" key={index}>
                        <td className="w-[15%] py-4 pl-4 pr-4 lg:pl-10">
                          <div className="flex items-center">
                            {vehicles.ho}
                          </div>
                        </td>
                        <td className="flex flex-row justify-between items-center w-[85%] hidden p-4 xl:flex">
                          <div className='flex gap-2'>
                            {vehicles.vehicleNumber ? vehicles.vehicleNumber.map((s, index) => {
                            return (
                              <button 
                                className={`inline-flex rounded-lg border border-[#d5d5d5] py-1 px-3 text-sm font-medium hover:opacity-80 dark:text-white
                                  ${selectedVehicle && selectedVehicle.id === s.id && `bg-primary text-white`}
                                `}
                                onClick={() => {selectVehicleHandle(s)}}
                                key={index}
                              >
                                {s.vehicleNumber}
                              </button>);
                            }) : null}
                            {isVehicleSelected ?
                                <UnregonizedCarModal
                                  // vehicleNumbers={vehicles.vehicleNumber}
                                  additionalVehicleNumbers={additionalVehicleNumbers}
                                />
                                : <AddUnitCarModal
                                  dong={currentDong}
                                  ho={vehicles.ho}
                                  addHandler={(vehicleNumber, phone) => { addUnitCarHandler(vehicles.unitId, vehicleNumber, phone) }}
                                />
                              }
                            {/* <AddUnitCarModal dong={currentDong} ho={vehicles.ho} addHandler={(vehicleNumber, phone) => {addUnitCarHandler(vehicles.unitId, vehicleNumber, phone)}}/> */}
                          </div>
                          <div className='mr-10'>
                            <button
                              className='inline-flex rounded-lg border border-[#d5d5d5] py-1 px-6 text-sm font-medium hover:opacity-80 dark:text-white'
                              onClick={() => {delUnitCarHandler(vehicles)}}
                            >
                              <span className='text-[#aaaaaa] font-bold'>삭제</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {/* <div
              className="flex items-center justify-between border-t border-stroke p-4 dark:border-strokedark sm:px-6">
              <p className="text-base font-medium text-black dark:text-white md:text-lg">
                1-5 of 29
              </p>
              <div className="flex items-center justify-end space-x-3">
                <LeftArrow/>
                <RightArrow/>
              </div>
            </div> */}
            {/* // <!-- ====== Inbox List End --> */}
          </div>
        </div>
      </div>
      )}

    </DefaultLayout>
  );
};
export default ApartmentUnitCar;
