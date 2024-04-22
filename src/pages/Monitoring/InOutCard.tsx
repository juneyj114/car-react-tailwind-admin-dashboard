const InOutCard = ({
  monitoringList,
  onClickHandle
}) => {
  return monitoringList ? monitoringList.map((m, i) => (
    <div 
      key={i}
      className={`flex gap-2 items-center text-lg w-full cursor-pointer rounded-[10px] border-r-[5px] border-l-[5px] bg-white p-4 shadow-13 ${m.inOutType === 'IN' ? 'border-l-meta-3 border-r-white' : 'border-r-red border-l-white'} hover:bg-gray hover:border-r-gray`}
      onClick={() => {onClickHandle(m.id)}}
    >
      <div className='text-green-600 w-2/12'>{m.inOutType}</div>
      <div className='w-4/12'>{m.vehicleNumber}</div>
      <div className='text-stone-400 w-6/12'>{m.inOutTime}</div>
    </div>
  )) : null;
}

export default InOutCard;