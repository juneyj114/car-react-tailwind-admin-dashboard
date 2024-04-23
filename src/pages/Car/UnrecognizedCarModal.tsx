import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { useCookies } from 'react-cookie';

interface UnrecognizedCarProps {
    // vehicleNumbers: Vehicle[]; // Define the prop for vehicle numbers
    additionalVehicleNumbers: string[];
}

// interface AddUnrecognizedCar {
//     vehicleId: number;
//     vehicleNumber: string;
// }


// const UnrecognizedCarModal: React.FC<DropdownCarUnitDetailProps> = ({ vehicleNumbers, /*additionalVehicleNumbers*/ }) => {
const UnrecognizedCarModal: React.FC<UnrecognizedCarProps> = ({ additionalVehicleNumbers }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [vehicleNumber, setVehicleNumber] = useState<string>('');
    const [cookies] = useCookies(['accessToken', 'refreshToken']);

    const trigger = useRef<any>(null);
    const modal = useRef<any>(null);

    const carUnrecognizedCarUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_UNIT_UNRECOGNIZED_CAR_ENDPOINT;

    // console.log(vehicleNumbers, "리스트");sssssssss
    console.log(additionalVehicleNumbers, "리스트2");

    const addUnrecognizedCarHandler = async () => {
        // console.log(unitId);
        // const AddUnrecognizedCar: AddUnrecognizedCar = {
        //     vehicleId,
        //     vehicleNumber
        // };

        // // console.log(addUnitCar);

        // try {
        //     const response = await axios.post(carUnrecognizedCarUrl, AddUnrecognizedCar, {
        //         headers: {
        //             Authorization: cookies.accessToken
        //         }
        //     });
        //     console.log(response);
        // } catch (error) {
        //     console.error('Error fetching data:', error);
        // } finally {
        //     // getCarUnitDongData(currentDong);
        // }
    };
    // 

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

    const addUnrecognizedCar = () => {
        if (checkValid()) {
            // if (confirm(`${dong}동 ${ho}호에 ${vehicleNumber}을 등록하시겠습니까?`)) {
            //     addHandler(vehicleNumber, phone);
            // }
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
        // setPhone('');
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
                    <div className="pb-2 text-xl font-bold text-black dark:text-white sm:text-2xl">
                        미인식 번호 관리
                    </div>
                    <span className="mx-auto mb-6 inline-block h-1 w-22.5 rounded bg-primary"></span>
                    <div className="mb-10 text-left">
                        <div className="mb-5">
                            <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                미인식 차량번호 <span className="text-meta-1">*</span>
                            </label>
                            <div className="grid grid-cols-10 gap-4">
                                <input
                                    type="text"
                                    placeholder=""
                                    value={vehicleNumber}
                                    onChange={(e) => { setVehicleNumber(e.target.value.replace(/(\s*)/g, "")) }}
                                    className="col-span-7 w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-normal text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                />
                                <button
                                    type="button"
                                    onClick={addUnrecognizedCarHandler}
                                    className="col-span-3 inline-flex items-center justify-center rounded-md bg-primary px-9 text-center font-medium text-white hover:bg-opacity-90 lg:px flex-row">
                                    등록
                                </button>
                            </div>
                        </div>
                        <div className="mb-5">
                            <table className="text-center datatable-table w-full table-auto border-collapse overflow-hidden break-words px-4 /*md:table-fixed*/ md:overflow-auto md:px-8">
                                <thead className='bg-indigo-50 cursor-default'>
                                    <tr>
                                        <th>
                                            <div className="flex items-center justify-center">등록된 미인식 차량번호</div>
                                        </th>
                                        <th>
                                            <div className="flex items-center justify-center">삭제</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="cursor-default">
                                    {additionalVehicleNumbers ? additionalVehicleNumbers.map((vehicleNumber, index) => {
                                        return (
                                            <tr className="border-b border-zinc-200" key={index}>
                                                <td>{vehicleNumber}</td>
                                                <td>
                                                    <div className="flex justify-center items-center">
                                                        <svg
                                                            clipRule="evenodd"
                                                            fillRule="evenodd"
                                                            strokeLinejoin="round"
                                                            strokeMiterlimit="2"
                                                            viewBox="0 0 24 24"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            style={{ width: '20px', height: '20px' }}
                                                            fill="rgb(148 163 184)"
                                                        >
                                                            <path d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z" fillRule="nonzero" />
                                                        </svg>
                                                    </div>
                                                </td>
                                            </tr>)
                                    }) : null}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <button
                            onClick={() => closeModal()}
                            className="w-1/2 rounded border border-stroke bg-gray p-3 text-center font-medium text-black transition hover:border-meta-1 hover:bg-meta-1 hover:text-white dark:border-strokedark dark:bg-meta-4 dark:text-white dark:hover:border-meta-1 dark:hover:bg-meta-1"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnrecognizedCarModal;
