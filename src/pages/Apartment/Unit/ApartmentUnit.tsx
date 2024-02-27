import React from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import DataTable from '../../../components/DataTables/DataTable.tsx';
import SampleData from '../../../common/sampleData.tsx';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb.tsx';

const ApartmentUnit: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="세대관리" rootPage="아파트" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTable tableData={SampleData.emplayeeData} column={SampleData.emplayeeColumn} />
      </div>
    </DefaultLayout>
  );
};
export default ApartmentUnit;
