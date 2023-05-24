import { Dispatch, useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Loader from "./Components/Loader/Loader";
import MiddleForm from "./Components/MiddleForm";
import Navbar from "./Components/Navbar";
import { callContractGetMethod } from "./Redux/actions/contract.action";
import { setInitialValues } from "./Redux/slices/initialValueSlice";
import { Toaster } from "react-hot-toast";

function App() {
  const dispatch: Dispatch<any> = useDispatch();

  useEffect(() => {
    const getInitialData = async () => {
      let name: any = await dispatch(callContractGetMethod("name", []));
      let symbol: any = await dispatch(callContractGetMethod("symbol", []));
      let decimals: any = await dispatch(callContractGetMethod("decimals", []));

      dispatch(
        setInitialValues({ name: name, symbol: symbol, decimals: decimals })
      );
    };

    getInitialData();
  }, [dispatch]);

  return (
    <>
      <Toaster />
      <Loader />
      <Navbar />
      <MiddleForm />
    </>
  );
}

export default App;
