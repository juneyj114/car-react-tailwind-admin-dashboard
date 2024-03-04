import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import SampleData from '../../common/sampleData.tsx';
import DataTable from '../../components/DataTables/DataTable.tsx';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';

const Apartment: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="아파트관리" rootPage="아파트" />
      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTable tableData={SampleData.emplayeeData} column={SampleData.emplayeeColumn} />
      </div>
    </DefaultLayout>
  );
};

export default Apartment;
