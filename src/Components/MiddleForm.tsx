import { Dispatch } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  callContractGetMethod,
  callContractSendMethod,
} from "../Redux/actions/contract.action";
import { setLoading } from "../Redux/slices/loaderSlice";
import toaster from "../Services/Toaster";
import { convertWithDecimal } from "../Services/common.service";
import Button from "./Button";
import Input from "./Input";
import "./MiddleForm.css";

const MiddleForm = () => {
  
  const dispatch: Dispatch<any> = useDispatch();

  // States
  const [balance, setBalance] = useState(0);
  const [allowance, setAllowance] = useState(0);

  const [tempAddress, setTempAddress] = useState();
  const [receiverAddress, setReceiverAddress] = useState();
  const [inputAmount, setInputAmount] = useState();


  const userAddress: string = useSelector(
    (state: any) => state?.wallet?.walletAddress
  );
  const name: string = useSelector((state: any) => state?.initialValues?.name);
  const symbol: string = useSelector(
    (state: any) => state?.initialValues?.symbol
  );
  const decimals: string = useSelector(
    (state: any) => state?.initialValues?.decimals
  );

  useEffect(() => {
    dispatch(setLoading(false));
  });

  // Handles the balance check
  const handleCheckBalance = async (e: any) => {
    e.preventDefault();

    let bal: any = await dispatch(
      callContractGetMethod("balanceOf", [userAddress])
    );

    setBalance(bal);
  };

  // Handles the transfer
  const handleTransfer = async (e: any) => {
    try {
      e.preventDefault();

      dispatch(setLoading(true));

      let amountToSend = await convertWithDecimal(inputAmount, decimals);


      let result: any = await dispatch(
        callContractSendMethod(
          "transfer",
          [tempAddress, amountToSend],
          userAddress
        )
      );

      dispatch(setLoading(false));

      if (result && result.success) toaster.success("Transfer successfully.");

      return result;
    } catch (err: any) {
      toaster.error(err);
    }
  };

  // Handles the approve
  const handleApprove = async (e: any) => {
    try {
      e.preventDefault();
      dispatch(setLoading(true));

      let amountToApprove = await convertWithDecimal(inputAmount, decimals);

      const result: any = await dispatch(
        callContractSendMethod(
          "approve",
          [tempAddress, amountToApprove],
          userAddress
        )
      );

      dispatch(setLoading(false));

      if (result && result.success) toaster.success("Approved successfully.");
    } catch (error) {
      toaster.error(error);
    }
  };

  // Handles transfer from
  const handleTransferFrom = async (e: any) => {
    e.preventDefault();

    dispatch(setLoading(true));

    let amount = await convertWithDecimal(inputAmount, decimals);

    // Data for approval
    let data = {
      sender: tempAddress,
      receiver: receiverAddress,
      amount: amount,
    };

    console.log("data", data);

    const result: any = await dispatch(
      callContractSendMethod(
        "transferFrom",
        [tempAddress, receiverAddress, amount],
        userAddress
      )
    );

    dispatch(setLoading(false));

    if (result && result.success)
      toaster.success("Tokens transferred successfully.");
  };

  // Handles allowance check
  const handleAllowance = async (e: any) => {
    e.preventDefault();

    const amount: any = await dispatch(
      callContractGetMethod("allowance", [userAddress, tempAddress])
    );

    setAllowance(amount);
  };

  console.log("tempAddress", tempAddress);

  return (
    <>
      <div className="card midForm">
        <h2>TOKEN UI</h2>
        <p>Token Name: {name}</p>
        <p>Token Symbol: {symbol}</p>
        <p>Token Decimals: {decimals}</p>
        <form>
          <div className="input-group mb-3">
            <label className="pads">Check Balance</label>
            <Button handleFunction={handleCheckBalance}>Submit</Button>
            {balance ? `${balance / 10 ** Number(decimals)} ${symbol}` : ""}
          </div>

          <div className="input-group mb-3">
            <label className="pads">Check Allowance</label>
            <Input handleChange={setTempAddress} />
            <Button handleFunction={handleAllowance}>Check</Button>
            {allowance ? `${allowance / 10 ** Number(decimals)} ${symbol}` : ""}
          </div>

          <div className="input-group mb-3">
            <label className="pads">Approve spender</label>
            <Input handleChange={setTempAddress} />
            <Input handleChange={setInputAmount} />
            <Button handleFunction={handleApprove}>Approve</Button>
          </div>

          <div className="input-group mb-3">
            <label className="pads">Transfer Tokens</label>
            <Input handleChange={setTempAddress} />
            <Input handleChange={setInputAmount} />
            <Button handleFunction={handleTransfer}>Transfer</Button>
          </div>

          <div className="input-group mb-3">
            <label className="pads">Transfer using Approval</label>
            <Input handleChange={setTempAddress} />
            <Input handleChange={setReceiverAddress} />
            <Input handleChange={setInputAmount} />
            <Button handleFunction={handleTransferFrom}>Transfer</Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default MiddleForm;
