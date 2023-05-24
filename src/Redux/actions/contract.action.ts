import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  callGetMethod,
  callSendMethod,
  createInstance,
} from "../../Services/contract.service";
import toaster from "../../Services/Toaster";
import { getError } from "../../Services/common.service";
import { setLoading } from "../slices/loaderSlice";

// For call methods
export const callContractGetMethod = (method: string, data: any = []) => {
  return async (dispatch: Dispatch<any> = useDispatch()) => {
    try {
      const result = await callGetMethod(method, data);
      return result;
    } catch (error: any) {
      toaster.error(error.message);
      return error;
    }
  };
};

// For send methods
export function callContractSendMethod(
  method: string,
  data: any = [],
  walletAddress: string,
  value: string = ""
) {
  return async (dispatch: Dispatch<any> = useDispatch(), getState: any) => {
    try {
      /**CREATE INSTANCE WITH WALLET */
      const contractInstance = await createInstance();
      if (contractInstance) {
        /**CALL SEND METHOD */
        const result = await callSendMethod(method, data, walletAddress, value);

        return result;
      }
    } catch (error: any) {
      console.log("herwedhjd", getError(error));
      toaster.error(getError(error));
      dispatch(setLoading(false));
      return error;
    }
  };
}
