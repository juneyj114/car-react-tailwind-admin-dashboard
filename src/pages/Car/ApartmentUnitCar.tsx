import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import DataTable from '../../components/DataTables/DataTable.tsx';
import SampleData from '../../common/sampleData.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';

const ApartmentUnitCar: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="세대별 차량 목록" rootPage="차량" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTable tableData={SampleData.emplayeeData} column={SampleData.emplayeeColumn} />
      </div>
    </DefaultLayout>
  );
};
export default ApartmentUnitCar;
