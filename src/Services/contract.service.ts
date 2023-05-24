import Web3 from "web3";
import tokenABI from "../ABI/TokenABI.json";
import { CHAIN_ID, RPC_URL, TOKEN_ADDRESS } from "../Constant";
import toaster from "./Toaster";

let web3Instance: any, tokenInstance: any;

// Creates a web3 instance and returns
const callWeb3 = () => {
  return new Promise(async (resolve, reject) => {
    const { ethereum } = window;
    const chainId = await ethereum.networkVersion;

    if (CHAIN_ID === chainId) web3Instance = new Web3(ethereum);
    else web3Instance = new Web3(RPC_URL);

    resolve(web3Instance);
  });
};

// Creates a web3 instance
export const createInstance = async () => {
  let web3: any = await callWeb3();

  tokenInstance = new web3.eth.Contract(tokenABI, TOKEN_ADDRESS);
  return true;
};

createInstance();

// Used to get instance of any contract
const getContractInstance = async () => {
  return new Promise(async (resolve, reject) => {
    let dynamicInstance = tokenInstance
      ? tokenInstance
      : await createInstance()
          .then(async () => {
            resolve(tokenInstance);
          })
          .catch(reject);

    resolve(dynamicInstance);
  });
};

// Used for call methods
export const callGetMethod = async (method: string, data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      /**GET SELECTED CONTRACT INSTANCE */
      let contract: any = await getContractInstance();

      if (contract.methods) {
        /**CALL GET METHOD */
        contract.methods[method]
          .apply(null, Array.prototype.slice.call(data))
          .call()
          .then((result: object) => {
            resolve(result);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error) {
      // toaster.error(error);
      reject(error);
    }
  });
};

// Used for send methods
export const callSendMethod = async (
  method: string,
  data: any,
  walletAddress: string,
  value: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      /**CHECK WALLET IS CONNECTED */
      if (walletAddress === "") {
        reject(new Error("Please connect wallet"));
      }

      /**CREATE DATA FOR CALL SEND METHOD */
      let dataForSend: any = { from: walletAddress };

      /**CHECK IF WE NEED TO SEND VALUE IN SEND METHOD */
      if (value) {
        dataForSend.value = value.toString();
      }

      /**GET SELECTED CONTRACT INSTANCE */
      let contract: any = await getContractInstance();

      if (contract.methods) {
        /**ESTIMATE GAS FOR TRANSACTION */
        const gasLimit = await contract.methods[method]
          .apply(null, Array.prototype.slice.call(data))
          .estimateGas(dataForSend);

        dataForSend.gasLimit = gasLimit;

        /**CALL SEND METHOD */
        contract.methods[method]
          .apply(null, Array.prototype.slice.call(data))
          .send(dataForSend)
          .then((result: object) => {
            resolve(result);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error("Contract not found."));
      }
    } catch (error: any) {
      reject(error);
    }
  });
};

/**FUNCTION FOR GIVE ALLOWANCE TO CONTRACT FOR TOKEN SPEND */
export const giveTokenAllowance = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      /**GET SELECTED CONTRACT INSTANCE */
      let allowance: any = await callGetMethod("allowance", [
        data.sender,
        data.receiver,
      ]);

      /**CHECK ALLOWANCE IS ALREADY GIVEN OR NOT */
      if (parseFloat(allowance) < parseFloat(data.amount)) {
        /**SET ALLOWANCE VALUE AS 10**40 */
        // let maxlimit = BigNumber(10).power(40);
        let maxlimit: any = Web3.utils
          .toBN(10)
          .pow(Web3.utils.toBN(40))
          .toString();

        console.log("heere");

        /**CALL SEND METHOD */
        let allowanceRes: any = await callSendMethod(
          "approve",
          [data.receiver, maxlimit],
          data.sender,
          null
        );

        if (!(allowanceRes && allowanceRes.status)) {
          return false;
        }
      }
      resolve(allowance);
    } catch (error: any) {
      reject(error);
      // toaster.error(error.message);
    }
  });
};
