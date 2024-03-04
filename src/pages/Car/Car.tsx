import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb.tsx';
import DataTable from '../../components/DataTables/DataTable.tsx';
import SampleData from '../../common/sampleData.tsx';

const Car: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="차량 관리" rootPage="차량" />

      <div className="flex flex-col gap-5 md:gap-7 2xl:gap-10">
        <DataTable tableData={SampleData.emplayeeData} column={SampleData.emplayeeColumn} />
      </div>
    </DefaultLayout>
  );
};
export default Car;
