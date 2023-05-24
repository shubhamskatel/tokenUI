import { useDispatch, useSelector } from "react-redux";
import connectMetamask from "./connectMetamask";
import { Dispatch } from "@reduxjs/toolkit";
import { removeWallet } from "../Redux/slices/dataSlice";

const Navbar = () => {
  const dispatch: Dispatch<any> = useDispatch();
  const walletAddress: any = useSelector(
    (state: any) => state?.wallet?.walletAddress
  );

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <span className="navbar-brand mb-0 h1">Navbar</span>
        {walletAddress ? <h6>Connected Wallet: {walletAddress} </h6> : ""}

        <button
          className="btn btn-outline-success my-2 my-sm-0"
          type="submit"
          onClick={() => {
            walletAddress
              ? dispatch(removeWallet())
              : dispatch(connectMetamask());
          }}
        >
          {walletAddress ? "Disconnect" : "Connect"}
        </button>
      </nav>
    </>
  );
};

export default Navbar;
