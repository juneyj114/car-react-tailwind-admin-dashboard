import React, { useState, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import { EditData, editDataState } from '../../state/atoms/editDataState';
import { ValueType } from '../../common/Enum/valueType';
import SelectGroup from '../Forms/SelectGroup/SelectGroup';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const ModalEdit: React.FC = () => {
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [modalOpen, setModalOpen] = useState(false);
  const initialEditData: EditData[] = useRecoilValue(editDataState);
  const [editableEditData, setEditableEditData] = useState<EditData[]>([]);
  const [isSetInitialEditData, setIsSetInitialEditData] = useState(false);
  const location = useLocation();
  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);
  
  useEffect(() => {
    if (modalOpen && initialEditData.length > 0 && !isSetInitialEditData) {
      setEditableEditData([...initialEditData]);
      setIsSetInitialEditData(true);
    }
  }, [initialEditData]);

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

  const handleChange = (index, value, type) => {
    const tempUpdatedEditData = [...editableEditData];

    let convertedValue;
    if (type === 'number') {
      convertedValue = parseInt(value);
    } else if (type === 'radio') {
      convertedValue = value === 'true' ? true : value === 'false' ? false : value;
    } else {
      convertedValue = value;
    }

    tempUpdatedEditData[index] = {...tempUpdatedEditData[index], value: convertedValue};
    setEditableEditData(tempUpdatedEditData);
  };

  const closeModal = () => {
    setIsSetInitialEditData(false);
    setModalOpen(false);
  };

  const updateHandler = async () => {
    const pathname = location.pathname;
    let updateUrl = import.meta.env.VITE_BASE_URL;
    switch (pathname) {
      case '/admin/apartment':
        updateUrl = updateUrl + import.meta.env.VITE_APARTMENT_ENDPOINT;
        break;
      case '/apartment/unit':
        updateUrl = updateUrl + import.meta.env.VITE_APARTMENT_UNIT_ENDPOINT;
        break;
      case '/device':
        updateUrl = updateUrl + import.meta.env.VITE_DEVICE_ENDPOINT;
        break;
      case '/car':
        updateUrl = updateUrl + import.meta.env.VITE_CAR_ENDPOINT;
        break;
      default:
        break;
    }

    const willUpdateData = {};
    editableEditData.forEach((data) => {
      willUpdateData[data.key] = data.value;
    });
    console.log(willUpdateData);
    const response = await axios.put(`${updateUrl}/${willUpdateData['id']}`, willUpdateData, {
      headers: {
        Authorization: cookies.accessToken
      }
    });

    closeModal();
  };

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="text-primary"
      >
        Edit
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

              {editableEditData.map((data, index) => {
                return data.visable ? (
                  <div className="mb-5" key={index}>
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                      {data.label}
                    </label>
                    {data.editable ? (
                      <>
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
                          <SelectGroup selectGroupValues={data.selectGroupValues} saveData={editableEditData} setSaveData={setEditableEditData} saveKey={data.key}/>
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
                      </>
                    ) : (
                      <span className="pl-3">{data.value}</span>
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
                    onClick={updateHandler}
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

export default ModalEdit;
