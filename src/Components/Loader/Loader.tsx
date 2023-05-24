import { Triangle } from "react-loader-spinner";
import { useSelector } from "react-redux";
import "./Loader.scss";

/**LOADER COMPONENTS */
const Loader = () => {
  /**GET STATES FROM STORE */
  const isLoading = useSelector((state: any) => state?.loader?.loader);


  /**IF isLoading IS TRUE SHOW LOADER*/
  if (isLoading) {
    return (
      <div className="overlayloader">
        <Triangle
          height="80"
          width="80"
          color="#fff"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass="something"
          visible={true}
        />
      </div>
    );
  } else {
    return <></>;
  }
};

export default Loader;
