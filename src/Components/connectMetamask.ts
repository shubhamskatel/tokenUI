import store from "../Redux/Store";
import { addWallet } from "../Redux/slices/dataSlice";
import toaster from "../Services/Toaster";

declare global {
  interface Window {
    ethereum?: any;
  }
}

// const { ethereum }: any = window;

// if (ethereum) {
//   ethereum.on("accountsChanged", function (accounts: any) {
//     let walletAddress: any;
//     walletAddress = accounts[0];

//     return store.dispatch(addWallet(walletAddress));
//   });
// }

export const connectMetamask = () => {
  return (dispatch: any, getState: any) =>
    new Promise(async (resolve, reject) => {
      try {
        const { ethereum } = window;
        let walletAddress: any;

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        ethereum.on("accountsChanged", async (accounts: string) => {
          walletAddress = accounts[0];

          resolve(walletAddress);
          return dispatch(addWallet(walletAddress));
        });

        walletAddress = accounts[0];

        resolve(walletAddress);
        return dispatch(addWallet(walletAddress));
      } catch (error: any) {
        reject(false);
        return toaster.error(error.message);
      }
    });
};

export default connectMetamask;
