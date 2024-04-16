import { BarLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-white">
      {/* <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div> */}
      <BarLoader height={15} width={200} speedMultiplier={0.7} color="#2241F2" />
    </div>
  );
};

export default Loader;
