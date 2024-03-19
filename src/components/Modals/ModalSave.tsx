import React, { useState, useEffect, useRef } from 'react';
import { ValueType } from '../../common/Enum/valueType';
import SelectGroup from '../Forms/SelectGroup/SelectGroup';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import AddressInput from '../Address/AddressInput';
import ModalApartment from './ModalApartment';
import { apartmentIdState } from '../../state/atoms/apartmentIdState';
import { useRecoilValue } from 'recoil';


interface SaveData {
  key: string,
  label: string,
  value: any,
  visable: boolean,
  selectGroupValues?: any,
  valueType: ValueType
}

const ModalSave: React.FC = () => {
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [modalOpen, setModalOpen] = useState(false);
  const [saveData, setSaveData] = useState<SaveData[]>([]);
  
  const location = useLocation();
  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // close on click outside
  // useEffect(() => {
  //   const clickHandler = ({ target }: MouseEvent) => {
  //     if (!modal.current) return;
  //     if (
  //       !modalOpen ||
  //       modal.current.contains(target) ||
  //       trigger.current.contains(target)
  //     )
  //       return;
  //     closeModal();
  //   };
  //   document.addEventListener('click', clickHandler);
  //   return () => document.removeEventListener('click', clickHandler);
  // });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      closeModal();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    const pathname = location.pathname;
    const initialData: SaveData[] = [];
    switch (pathname) {
      case '/admin/apartment':
        initialData.push({key: 'name', label: '이름', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'region1DepthName', label: '고객사 지역명 1', value: '', valueType: ValueType.Text, visable: false});
        initialData.push({key: 'region2DepthName', label: '고객사 지역명 2', value: '', valueType: ValueType.Text, visable: false});
        initialData.push({key: 'region3DepthName', label: '고객사 지역명 3', value: '', valueType: ValueType.Text, visable: false});
        initialData.push({key: 'roadName', label: '도로명', value: '', valueType: ValueType.Text, visable: false});
        initialData.push({key: 'address', label: '주소', value: '', valueType: ValueType.Address, visable: true});
        initialData.push({key: 'zoneNo', label: '우편번호', value: '', valueType: ValueType.Text, visable: false});
        initialData.push({key: 'limitType', label: '제한 타입', value: 'COUNT', valueType: ValueType.SelectGroup, visable: true, selectGroupValues: [
          {
            label: "횟수",
            value: "COUNT"
          },
          {
            label: "시간",
            value: "TIME"
          },
          {
            label: "없음",
            value: "NONE"
          }
        ]});
        initialData.push({key: 'limitTime', label: '제한 시간(분 단위)', value: '', valueType: ValueType.Number, visable: true});
        initialData.push({key: 'limitCount', label: '제한 횟수', value: '', valueType: ValueType.Number, visable: true});
        initialData.push({key: 'networkCheckSecond', label: '네트워크 체크 시간(초 단위)', value: '', valueType: ValueType.Number, visable: true});
        initialData.push({key: 'qna', label: 'qna 사용 여부', value: '', valueType: ValueType.Boolean, visable: true});
        initialData.push({key: 'faq', label: 'faq 사용 여부', value: '', valueType: ValueType.Boolean, visable: true});
        break;
      case '/apartment/unit':
        initialData.push({key: 'dong', label: '동', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'ho', label: '호', value: '', valueType: ValueType.Text, visable: true});
        break;
      case '/device':
        initialData.push({key: 'apartmentId', label: '아파트ID', value: '', valueType: ValueType.Number, visable: false});
        initialData.push({key: 'apartmentName', label: '아파트명', value: '', valueType: ValueType.Apartment, visable: true});
        initialData.push({key: 'serialNumber', label: '시리얼 번호', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'macAddress', label: 'MAC 주소', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'modelName', label: '모델명', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'internalIp', label: '내부 IP', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'internalPort', label: '내부 포트', value: '', valueType: ValueType.Number, visable: true});
        initialData.push({key: 'externalIp', label: '외부 IP', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'externalPort', label: '외부 포트', value: '', valueType: ValueType.Number, visable: true});
        initialData.push({key: 'inOutType', label: '카메라 타입', value: '', valueType: ValueType.SelectGroup, visable: true, selectGroupValues: [
          {
            label: "입차",
            value: "IN"
          },
          {
            label: "출차",
            value: "OUT"
          },
          {
            label: "입출차",
            value: "BOTH"
          }
        ]});
        initialData.push({key: 'adminId', label: '어드민 ID', value: '', valueType: ValueType.Text, visable: true});
        initialData.push({key: 'adminPassword', label: '어드민 PW', value: '', valueType: ValueType.Text, visable: true});
        break;
      case '/car':
          initialData.push({key: 'apartmentId', label: '아파트ID', value: '', valueType: ValueType.Number, visable: false});
          initialData.push({key: 'apartmentName', label: '아파트명', value: '', valueType: ValueType.Apartment, visable: true});
          initialData.push({key: 'vehicleNumber', label: '차량번호', value: '', valueType: ValueType.Text, visable: true});
          initialData.push({key: 'phone', label: '전화번호', value: '', valueType: ValueType.Text, visable: true});
          initialData.push({key: 'purpose', label: '목적', value: '', valueType: ValueType.Text, visable: true});
          initialData.push({key: 'startDate', label: '시작일자', value: '', valueType: ValueType.Text, visable: true});
          initialData.push({key: 'endDate', label: '종료일자', value: '', valueType: ValueType.Text, visable: true});
          initialData.push({key: 'type', label: '허용여부', value: '', valueType: ValueType.SelectGroup, visable: true, selectGroupValues: [
            {
              label: "허용",
              value: "ALLOW"
            },
            {
              label: "금지",
              value: "DENY"
            }
          ]});
          break;
      default:
        break;
    }
    setSaveData(initialData);
  }, []);

  const handleChange = (index, value, type) => {
    const tempSaveEditData = [...saveData];
    let convertedValue;
    if (type === 'number') {
      convertedValue = parseInt(value);
    } else if (type === 'radio') {
      convertedValue = value === 'true' ? true : value === 'false' ? false : value;
    } else {
      convertedValue = value;
    }
    
    tempSaveEditData[index] = {...tempSaveEditData[index], value: convertedValue};
    setSaveData(tempSaveEditData);
  };

  const closeModal = () => {
    // setIsSetInitialEditData(false);
    setModalOpen(false);
  };

  const saveHandler = async () => {
    const pathname = location.pathname;
    let saveUrl = import.meta.env.VITE_BASE_URL;
    switch (pathname) {
      case '/admin/apartment':
        saveUrl = saveUrl + import.meta.env.VITE_APARTMENT_ENDPOINT;
        break;
      case '/device':
        saveUrl = saveUrl + import.meta.env.VITE_DEVICE_ENDPOINT;
        break;
      default:
        break;
    }

    const willSaveData = {};
    saveData.forEach((data) => {
      willSaveData[data.key] = data.value;
    });
    console.log(willSaveData);

    const response = await axios.post(saveUrl , willSaveData, {
      headers: {
        Authorization: cookies.accessToken
      }
    });

    closeModal();
  };

  return (
    <div className='text-xs'>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="float-right mt-3 inline-flex items-center justify-center rounded-md bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90"
      >
        추가
      </button>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${
          modalOpen ? 'block' : 'hidden'
        }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="max-h-full overflow-auto w-100 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
        >
          {/* <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black text-lg dark:text-white">
              상세
            </h3>
          </div> */}
          <form action="#">
            <div className="p-6.5">

              {saveData.map((data, index) => {
                return data.visable ? (
                  <div className="mb-5" key={index}>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {data.label}
                    </label>
                    {data.valueType === ValueType.Text && (
                      <input
                        type="text"
                        placeholder=""
                        value={data.value}
                        onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    )}
                    {data.valueType === ValueType.Number && (
                      <input
                        type="number"
                        placeholder=""
                        value={data.value ? data.value : 0}
                        onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                      />
                    )}
                    {data.valueType === ValueType.SelectGroup && (
                      <SelectGroup selectGroupValues={data.selectGroupValues} saveData={saveData} setSaveData={setSaveData} saveKey={data.key}/>
                    )}
                    {data.valueType === ValueType.Boolean && (
                      <div>
                        <label className="inline-block mr-3">
                          <input
                            type="radio"
                            value="true"
                            checked={data.value === true}
                            onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                            className="mr-1"
                          />
                          예
                        </label>
                        <label className="inline-block">
                          <input
                            type="radio"
                            value="false"
                            checked={data.value === false}
                            onChange={(e) => handleChange(index, e.target.value, e.target.type)}
                            className="mr-1"
                          />
                          아니오
                        </label>
                      </div>
                    )}
                    {data.valueType === ValueType.Address && (
                      <AddressInput saveData={saveData} addressData={data.value} setSaveData={setSaveData} />
                    )}
                    {data.valueType === ValueType.Apartment && (
                      <ModalApartment saveData={saveData} setSaveData={setSaveData}/>
                    )}
                  </div>
                ) : null
              })}
              <div className="-mx-3 flex flex-wrap gap-y-4">
                <div className="2xsm:w-1/2 w-full px-3">
                  <button
                    onClick={() => closeModal()}
                    className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                  >
                    취소
                  </button>
                </div>
                <div className="2xsm:w-1/2 w-full px-3">
                  <button
                    onClick={saveHandler}
                    className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalSave;
