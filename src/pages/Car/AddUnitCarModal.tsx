import React, { useState, useEffect, useRef } from 'react';

const AddUnitCarModal = ({
  dong,
  ho,
  addHandler
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const trigger = useRef<any>(null);
  const modal = useRef<any>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!modal.current) return;
      if (
        !modalOpen ||
        modal.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      closeModal();
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!modalOpen || keyCode !== 27) return;
      closeModal();
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const addUnitCar = () => {
    if (checkValid()) {
      if (confirm(`${dong}동 ${ho}호에 ${vehicleNumber}을 등록하시겠습니까?`)) {
        addHandler(vehicleNumber, phone);
      }
    }
  };

  const checkValid = () => {
    // console.log(vehicleNumber);
    if (!vehicleNumber) {
      alert('차량번호를 입력해주세요.');
      return false;
    } else {
      return true;
    }
  };

  const closeModal = () => {
    setVehicleNumber('');
    setPhone('');
    setModalOpen(false);
  };

  return (
    <div>
      <button
        ref={trigger}
        onClick={() => setModalOpen(!modalOpen)}
        className="inline-flex rounded-lg border border-[#d5d5d5] border-dashed py-1 px-6 text-sm font-medium hover:opacity-80 dark:text-white"
      >
        <span className='text-[#aaaaaa] font-bold'>추가</span>
      </button>
      <div
        className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/90 px-4 py-5 ${modalOpen ? 'block' : 'hidden'
          }`}
      >
        <div
          ref={modal}
          onFocus={() => setModalOpen(true)}
          className="md:px-17.5 w-full max-w-142.5 rounded-lg bg-white px-8 py-12 text-center dark:bg-boxdark md:py-15"
        >
          <span className="mx-auto mb-1.5 inline-block h-1 w-22.5 rounded bg-primary"></span>
          <div className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl mb-4">
            <div className="mb-1">차량 등록</div>
            <div className='text-lg mb-1 text-[#818181]'>{dong}동 {ho}호</div>
          </div>
          <div className="mb-10 text-left">
            <div className='mb-5'>
              {/* <div className="text-m font-semibold mb-2">등록된 차량 번호</div>
              <ul className="list-none pl-0 border border-stroke rounded p-4 pb-2">
                <li className="flex items-center mb-2 px-4 text-sm">
                  <input type="checkbox" className="form-checkbox text-primary h-4 w-4 mr-2" />
                  <span>12가1234</span>
                </li>
                <li className="flex items-center mb-2 px-4 text-sm">
                  <input type="checkbox" className="form-checkbox text-primary h-4 w-4 mr-2" />
                  <span>12가1234</span>
                </li>
                <li className="flex items-center mb-2 px-4 text-sm">
                  <input type="checkbox" className="form-checkbox text-primary h-4 w-4 mr-2" />
                  <span>12가1234</span>
                </li>
              </ul> */}
            </div>
            <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
              <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                차량번호 <span className="text-meta-1">*</span>
              </label>
              <input
                type="text"
                placeholder=""
                value={vehicleNumber}
                onChange={(e) => { setVehicleNumber(e.target.value.replace(/(\s*)/g, "")) }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
              />
            </div>
            <div className="w-full mb-5 grid grid-cols-3 flex items-center gap-4">
              <label className="block text-sm font-medium text-black dark:text-white col-span-1">
                전화번호
              </label>
              <input
                type="text"
                placeholder=""
                value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/(\s*)/g, "")) }}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary col-span-2"
              />
            </div>
          </div>
          <div className="-mx-3 flex flex-wrap gap-y-4">
            <div className="2xsm:w-1/2 w-full px-3">
              <button
                className="block w-full rounded border border-primary bg-primary p-3 text-center font-medium text-white transition hover:bg-opacity-90"
                onClick={addUnitCar}
              >
                등록
              </button>
            </div>
            <div className="2xsm:w-1/2 w-full px-3">
              <button
                onClick={() => closeModal()}
                className="block w-full rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUnitCarModal;
