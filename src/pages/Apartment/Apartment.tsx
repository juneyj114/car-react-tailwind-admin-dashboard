import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import DataTableOne from '../../components/DataTables/DataTableOne.tsx';
import DataTableTwo from '../../components/DataTables/DataTableTwo.tsx';

const Apartment: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Data Tables" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTableOne />
        <DataTableTwo />
      </div>
    </DefaultLayout>
  );
};

export default Apartment;
