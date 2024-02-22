import { ApplyEntry } from '../../types/applyEntry.ts';
import { Link } from 'react-router-dom';

const applyEntries: ApplyEntry[] = [
  {
    dong: '101동',
    ho: '101호',
    vehicleNumber: '12가 1234',
    applyDate: '2021-10-01',
  },
  {
    dong: '101동',
    ho: '101호',
    vehicleNumber: '12가 1234',
    applyDate: '2021-10-01',
  },
  {
    dong: '101동',
    ho: '101호',
    vehicleNumber: '12가 1234',
    applyDate: '2021-10-01',
  },
  {
    dong: '101동',
    ho: '101호',
    vehicleNumber: '12가 1234',
    applyDate: '2021-10-01',
  },
  {
    dong: '101동',
    ho: '101호',
    vehicleNumber: '12가 1234',
    applyDate: '2021-10-01',
  },
];

const TableUserApplyEntry = () => {
  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        사용자 입출차 신청 내역
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-6">
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              동
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              호
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              차량번호
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              신청일자
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">

            </h5>
          </div>
        </div>

        {applyEntries.map((applyEntry, key) => (
          <div
            className={`grid grid-cols-4 sm:grid-cols-6 ${
              key === applyEntries.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={key}
          >
            <div className="flex items-center justify-center p-2.5 xl:p-5">
              {/*<div className="flex-shrink-0">*/}
              {/*  <img src={brand.logo} alt="Brand" />*/}
              {/*</div>*/}
              <p className="text-black dark:text-white">
                {applyEntry.dong}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black dark:text-white">{applyEntry.ho}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-3">{applyEntry.vehicleNumber}</p>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{applyEntry.applyDate}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 ">
              <Link
                to="#"
                className="inline-flex items-center justify-center bg-primary py-2 px-5 text-center font-medium text-white "
              >
                승인
              </Link>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 ">
              <Link
                to="#"
                className="inline-flex items-center justify-center bg-red py-2 px-5 text-center font-medium text-white "
              >
                거절
              </Link>
            </div>

          </div>

        ))}
      </div>
    </div>
  );
};

export default TableUserApplyEntry;
