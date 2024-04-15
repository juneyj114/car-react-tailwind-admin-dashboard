import axios from 'axios';
import { useEffect, useMemo, useRef, useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import { useCookies } from 'react-cookie';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable
} from 'react-table';
import { useRecoilState, useRecoilValue } from 'recoil';
import * as XLSX from 'xlsx-js-style';
import Loader from '../../common/Loader';
import DropdownSearch from '../../components/Dropdowns/DropdownSearch';
import SortIcon from '../../components/Sort/SortIcon';
import ExcelLogo from '../../images/icon/excel_logo.png';
import { formatYMD } from '../../js/dateFormat';
import { endDateState } from '../../state/atoms/endDSateState';
import { pageUnitState } from '../../state/atoms/pageUnitState';
import { startDateState } from '../../state/atoms/startDateState';
import { CarLogDetails } from '../../types/carLog';

const CarLogTable = ({
  column,
  tableData,
  onSearch
}) => {

  const columns = useMemo(() => column, []);
  const data = useMemo(() => tableData, [tableData]);
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  const [loading, setLoading] = useState<boolean>(false);
  const [carLogDetails, setCarLogDetails] = useState<CarLogDetails>();
  const [searchOption, setSearchOption] = useState({ key: 'number', value: '' });
  // const [startDate, setStartDate] = useRecoilState(startDateState);
  const [endDate, setEndDate] = useRecoilState(endDateState);
  const [dateType, setDateType] = useState('in');
  const [carType, setCarType] = useState({ key: 'type', value: 'ALL' });
  const pageUnit = useRecoilValue(pageUnitState);
  const [pages, setPages] = useState<number[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  // const [currentPage, setCurrentPage] = useState<number>(1);

  // 리액트 캘린더 대신 사용한 상태관리 및 함수
  const [startDate, setStartDate] = useRecoilState(dateType === 'in' ? startDateState : endDateState);

  const [selectedDate, setSelectedDate] = useState(startDate); // 선택한 날짜를 관리하기 위한 상태 추가

  const handleChange = (event) => {
    const selectedValue = event.target.value;
    setStartDate(selectedValue);
    setSelectedDate(selectedValue); // 선택한 날짜 업데이트
  };

  // 현재 날짜를 yyyy-mm-dd 형식으로 가져오는 함수
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줌
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 여기까지

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [
          {
            id: 'in.inOutTime',
            desc: true,
          },
        ],
      },
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    setPageSize,
    gotoPage,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  state.pageSize = 10;


  const carLogUrl = import.meta.env.VITE_BASE_URL + import.meta.env.VITE_CAR_LOG_ENDPOINT;

  const getCarLogDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${carLogUrl}/${id}`, {
        headers: {
          Authorization: cookies.accessToken
        }
      });
      setCarLogDetails(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const excelDownload = () => {
    // console.log(data);
    const wb = XLSX.utils.book_new();
    let rows = [
      // ['차량구분', '차량번호', '입차일시', '출차일시']
      [
        { v: '차량구분', t: 's', s: { alignment: { horizontal: 'center' } } },
        { v: '차량번호', t: 's', s: { alignment: { horizontal: 'center' } } },
        { v: '입차일시', t: 's', s: { alignment: { horizontal: 'center' } } },
        { v: '출차일시', t: 's', s: { alignment: { horizontal: 'center' } } }
      ]
    ];
    data.forEach((e) => {
      rows.push([
        e.typeText, e.in.vehicleNumber, e.in.inOutTime, e.out ? e.out.inOutTime : ''
      ]);
    });
    // console.log(rows);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      {},
      {},
      { wpx: 150 },
      { wpx: 150 },
    ];
    XLSX.utils.book_append_sheet(wb, ws, "입출차 내역");

    XLSX.writeFile(wb, "입출차 내역.xlsx");
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const searchParams = [];
    if (dateType === 'in') {
      searchParams.push({ key: 'inStartDate', value: startDate });
      searchParams.push({ key: 'inEndDate', value: endDate });
      searchParams.push({ key: 'outStartDate', value: '' });
      searchParams.push({ key: 'outEndDate', value: '' });
    } else if (dateType === 'out') {
      searchParams.push({ key: 'outStartDate', value: startDate });
      searchParams.push({ key: 'outEndDate', value: endDate });
      searchParams.push({ key: 'inStartDate', value: '' });
      searchParams.push({ key: 'inEndDate', value: '' });
    }
    searchParams.push({ key: carType.key, value: carType.value });
    searchParams.push({ key: searchOption.key, value: searchOption.value });
    // console.log(searchParams);
    onSearch(searchParams);
  };

  const searchOptions = [
    {
      label: '차량번호',
      value: 'number'
    }
  ];

  const dateOptions = [
    {
      label: '입차일시',
      value: 'in'
    },
    {
      label: '출차일시',
      value: 'out'
    }
  ];

  const carTypeOption = [
    {
      label: '전체',
      value: 'ALL'
    },
    {
      label: '세대',
      value: 'MEMBER'
    },
    {
      label: '방문',
      value: 'VISIT'
    },
    {
      label: '미등록',
      value: 'UNKNOWN'
    },
  ];


  const calculateStartPage = () => {
    return (Math.floor(pageIndex / pageUnit) * pageUnit) + 1;
  };

  const handlStartDateChange = (date) => {
    setStartDate(formatYMD(date));
    setShowCalendar(false);
  };

  const handlEndDateChange = (date) => {
    setEndDate(formatYMD(date));
    setShowCalendar(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [calendarRef]);

  // const goToPageHandle = (page) => {
  //   // setCurrentPage(page);
  //   gotoPage(page);

  // };

  // useEffect(() => {
  //   console.log(`현재 페이지 : ${pageIndex + 1}`);
  //   const startPage = calculateStartPage();
  //   if (pages[0]) {

  //   }
  //   const maxPage = startPage + pageUnit - 1 > pageOptions.length + 1 ? pageOptions.length : startPage + pageUnit - 1;
  //   console.log(`${startPage + pageUnit - 1} / ${ pageOptions.length}`);
  //   for (let i = startPage; i <= maxPage; i++) {
  //     pages.push(i);
  //   }
  // }, [pageIndex]);

  return (
    <div className='flex gap-7'>
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10 basis-3/4">
        <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white py-4 shadow-default text-xs dark:border-strokedark  dark:bg-boxdark">
          <div className='flex flex-col gap-3 px-8'>
            <div>
              <div className='flex gap-4'>
                <div>
                  <DropdownSearch
                    options={dateOptions}
                    onSelect={({ label, value }) => { setDateType(value) }}
                  />
                </div>
                <div className='flex gap-2 items-center'>
                  <div className="relative w-30 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                    {/* <input
                      type="text"
                      value={startDate}
                      onClick={() => { setShowCalendar(!showCalendar) }}
                      // onChange={(e) => setStartDate(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder=""
                    /> */}
                    <input
                      type="date"
                      value={selectedDate} // startDate 대신에 selectedDate를 사용
                      onChange={handleChange}
                      className="w-full focus:outline-none"
                      placeholder="yyyy-mm-dd"
                      max={getCurrentDate()}
                    />
                    {/* {showCalendar && (
                      <div className='absolute z-50 top-full left-0 mt-1' ref={calendarRef}>
                        <Calendar onChange={handlStartDateChange} value={startDate} formatDay={(locale, date) => date.getDate().toString()} />
                      </div>
                    )} */}
                  </div>
                  <div>~</div>
                  <div className="w-30 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                    {/* <input
                      type="text"
                      value={endDate}
                      onClick={() => { setShowCalendar(!showCalendar) }}
                      // onChange={(e) => setEndDate(e.target.value)}
                      className="w-full focus:outline-none"
                      placeholder=""
                    />
                    <input
                      type="date"
                      value={selectedDate} // startDate 대신에 selectedDate를 사용
                      onChange={handleChange}
                      className="w-full focus:outline-none"
                      placeholder="yyyy-mm-dd"
                      max={getCurrentDate()}
                    />
                    {showCalendar && (
                      <div className='absolute z-50 top-full left-0 mt-1' ref={calendarRef}>
                        <Calendar onChange={handlEndDateChange} value={endDate} formatDay={(locale, date) => date.getDate().toString()} />
                      </div>
                    )} */}
                  </div>
                </div>
                <div className='my-auto'>
                  차량구분
                </div>
                <div className='mr-4'>
                  <DropdownSearch
                    options={carTypeOption}
                    onSelect={({ label, value }) => { setCarType({ ...carType, value: value }) }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between border-b border-stroke pb-4 dark:border-strokedark">
              <div className='flex'>
                <div className='mr-4'>
                  <DropdownSearch
                    options={searchOptions}
                    onSelect={({ label, value }) => { setSearchOption({ ...searchOption, key: value }) }}
                  />
                </div>
                <div className="w-60 flex rounded-md border border-stroke px-5 py-2.5 outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:focus:border-primary">
                  <input
                    type="text"
                    value={searchOption.value}
                    onChange={(e) => setSearchOption({ ...searchOption, value: e.target.value })}
                    className="w-full focus:outline-none"
                    placeholder="Search..."
                    onKeyDown={handleKeyPress}
                  />
                  <svg
                    className="fill-[#637381] hover:fill-primary cursor-pointer"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={handleSearch}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.25 3C5.3505 3 3 5.3505 3 8.25C3 11.1495 5.3505 13.5 8.25 13.5C11.1495 13.5 13.5 11.1495 13.5 8.25C13.5 5.3505 11.1495 3 8.25 3ZM1.5 8.25C1.5 4.52208 4.52208 1.5 8.25 1.5C11.9779 1.5 15 4.52208 15 8.25C15 11.9779 11.9779 15 8.25 15C4.52208 15 1.5 11.9779 1.5 8.25Z"
                      fill=""
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.9572 11.9572C12.2501 11.6643 12.7249 11.6643 13.0178 11.9572L16.2803 15.2197C16.5732 15.5126 16.5732 15.9874 16.2803 16.2803C15.9874 16.5732 15.5126 16.5732 15.2197 16.2803L11.9572 13.0178C11.6643 12.7249 11.6643 12.2501 11.9572 11.9572Z"
                      fill=""
                    />
                  </svg>
                </div>
              </div>

              <div className="flex items-center font-medium">
                <div
                  className='cursor-pointer mr-2'
                  onClick={excelDownload}
                >
                  <img src={ExcelLogo} />
                </div>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent pl-2"
                >
                  {[5, 10, 20, 50].map((page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <table
            {...getTableProps()}
            className="text-center datatable-table w-full table-auto border-collapse overflow-hidden break-words px-4 /*md:table-fixed*/ md:overflow-auto md:px-8"
          >
            <thead>
              {headerGroups.map((headerGroup, key) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={key}>
                  {headerGroup.headers.map((column, key) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={key}
                    >
                      <div className="flex items-center justify-center">
                        <span className='mr-2'> {column.render('Header')}</span>
                        <SortIcon />
                      </div>
                    </th>
                  ))}
                  <th >
                    <div className="flex items-center justify-center">
                      사진
                    </div>
                  </th>
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, key) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} key={key}>
                    {row.cells.map((cell, key) => {
                      return (
                        <td {...cell.getCellProps()} key={key}>
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                    <td className='flex gap-3'>
                      {row.original['in'] ? (
                        // <CarLogDetailsModal buttonText={'입차'} id={row.original['in'].id} />
                        <button
                          className='text-primary'
                          onClick={() => { getCarLogDetails(row.original['in'].id) }}
                        >
                          입차
                        </button>
                      ) : null}
                      {row.original['out'] ? (
                        // <CarLogDetailsModal buttonText={'출차'} id={row.original['out'].id}/>
                        <button
                          className='text-primary'
                          onClick={() => { getCarLogDetails(row.original['out'].id) }}
                        >
                          출차
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex justify-between items-center border-t border-stroke px-8 pt-5 dark:border-strokedark">
            <p className="font-medium">
              총 {data.length}건
            </p>
            <div className='flex items-center'>
              <p className="font-medium mr-2">
                {pageIndex + 1} / {pageOptions.length} 페이지
              </p>
              <div className="flex">
                <button
                  className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white"
                  onClick={() => previousPage()}
                  disabled={!canPreviousPage}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.1777 16.1156C12.009 16.1156 11.8402 16.0593 11.7277 15.9187L5.37148 9.44995C5.11836 9.19683 5.11836 8.80308 5.37148 8.54995L11.7277 2.0812C11.9809 1.82808 12.3746 1.82808 12.6277 2.0812C12.8809 2.33433 12.8809 2.72808 12.6277 2.9812L6.72148 8.99995L12.6559 15.0187C12.909 15.2718 12.909 15.6656 12.6559 15.9187C12.4871 16.0312 12.3465 16.1156 12.1777 16.1156Z"
                      fill=""
                    />
                  </svg>
                </button>

                {/* {pageOptions.map((_page, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      gotoPage(index);
                    }}
                    className={`${
                      pageIndex === index && 'bg-primary text-white'
                    } mx-1 flex cursor-pointer items-center justify-center rounded-md p-1 px-3 hover:bg-primary hover:text-white`}
                  >
                    {index + 1}
                  </button>
                ))} */}

                <button
                  className="flex cursor-pointer items-center justify-center rounded-md p-1 px-2 hover:bg-primary hover:text-white"
                  onClick={() => nextPage()}
                  disabled={!canNextPage}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.82148 16.1156C5.65273 16.1156 5.51211 16.0593 5.37148 15.9468C5.11836 15.6937 5.11836 15.3 5.37148 15.0468L11.2777 8.99995L5.37148 2.9812C5.11836 2.72808 5.11836 2.33433 5.37148 2.0812C5.62461 1.82808 6.01836 1.82808 6.27148 2.0812L12.6277 8.54995C12.8809 8.80308 12.8809 9.19683 12.6277 9.44995L6.27148 15.9187C6.15898 16.0312 5.99023 16.1156 5.82148 16.1156Z"
                      fill=""
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className='basis-1/4'>
        {loading ? <Loader /> :
          carLogDetails && carLogDetails.files ? carLogDetails.files.map((file, index) => {
            return (
              <span
                className="pl-3"
                key={index}
              >
                <img src={`data:image/jpg;base64,${file.content}`}></img>
              </span>
            );
          }) : (
            null
          )
        }
      </div>
    </div>
  );
};

export default CarLogTable;
