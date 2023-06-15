/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import {
  useWalletService,
  useNftCollectionService,
  MinteebleERC721CollectionInstance,
  MinteebleERC1155CollectionInstance,
} from "@minteeble/sdk";
import { SmartContractType } from "@minteeble/utils";
import { BN } from "ethereumjs-util";
import { useState, useEffect } from "react";
import { MinteeWidgetLogic, ParamMappingItem, UseMinteeWidgetProps } from ".";

/**
 * Custom hook for handling minting operations.
 * It can be used for creating custom minting widgets.
 * It is mainly used by MinteeWidget default UI.
 *
 * @param props Hook input props.
 * @returns Mintee logic object, containing all the required states/methods for handing mint
 */
const useMinteeWidget = (props: UseMinteeWidgetProps) => {
  // Hooks
  const {
    web3,
    userIsSigning,
    walletAddress,
    connectWallet,
    disconnectWallet,
  } = useWalletService();
  const { getCollectionInstance } = useNftCollectionService();

  // States
  const [nftCollection, setNftCollection] = useState<
    | MinteebleERC721CollectionInstance
    | MinteebleERC1155CollectionInstance
    | null
  >(null);
  const [mintPrice, setMintPrice] = useState<BN | null>(null);
  const [fees, setFees] = useState<BN | null>(null);
  const [mintAmount, setMintAmount] = useState<number>(props.amount || 1);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [estimationIntervalId, setEstimationIntervalId] =
    useState<NodeJS.Timeout>();

  // ----

  let totalPrice = new BN.BN("0");

  if (mintPrice) {
    totalPrice = totalPrice.add(mintPrice.muln(mintAmount));

    if (fees) {
      totalPrice = totalPrice.add(fees);
    }
  }

  useEffect(() => {
    (async () => {
      if (web3) {
        setIsSigningIn(false);

        let instance = await getCollectionInstance(
          props.chainName,
          props.collectionId,
          true
        );

        console.log("Got nft collection:", instance);

        if (instance) {
          setNftCollection(instance as MinteebleERC721CollectionInstance);
        }
      }
    })();
  }, [web3]);

  useEffect(() => {
    (async () => {
      if (nftCollection) {
        let price: BN = new BN.BN("0");

        if (props.customPrice) {
          price = new BN.BN(props.customPrice);
        } else {
          console.log("Collection type", nftCollection.type);
          if (nftCollection.type === SmartContractType.MINTEEBLE_ERC721) {
            console.log(
              "Price:",
              (
                await (
                  nftCollection as MinteebleERC721CollectionInstance
                ).smartContract.mintPrice()
              ).toString()
            );
            price = new BN.BN(
              (
                await (
                  nftCollection as MinteebleERC721CollectionInstance
                ).smartContract.mintPrice()
              ).toString()
            );
          } else if (
            nftCollection.type === SmartContractType.MINTEEBLE_ERC1155 &&
            props.erc1155Id
          ) {
            price = new BN.BN(
              (
                await (
                  nftCollection as MinteebleERC1155CollectionInstance
                ).smartContract.mintPrice(parseInt(props.erc1155Id))
              ).toString()
            );
          }
        }

        if (props.discountPercentage) {
          price = price.divn(100).muln(100 - props.discountPercentage);
        }

        if (price) {
          setMintPrice(price);
        }

        // startFeesEstimations();
      }
    })();
  }, [nftCollection]);

  useEffect(() => {
    if (mintPrice && !estimationIntervalId) {
      startFeesEstimations();
    }
  }, [mintPrice]);

  const signInUser = async () => {
    setIsSigningIn(true);
    try {
      await connectWallet();
    } catch (err) {
      console.log("Error on signing in:", err);
      setIsSigningIn(false);
    }
  };

  const signOutUser = async () => {
    await disconnectWallet();
  };

  const incrementMintAmount = () => {
    setMintAmount((currentAmount) => {
      return currentAmount + 1;
    });
  };

  const decrementMintAmount = () => {
    setMintAmount((currentAmount) => {
      return currentAmount > 1 ? currentAmount - 1 : currentAmount;
    });
  };

  const evalCustomMethodFees = async () => {
    if (web3 && walletAddress && nftCollection) {
      let options = props.customMintMethodOptions;
      let methodName = options?.methodName;

      if (options && methodName) {
        let method = nftCollection.smartContract.contract?.methods[methodName];

        if (!method)
          throw Error(`Custom method "${methodName}" does not exist.`);

        let mappings = injectMappingValues(options.mappings || []);

        let parameters = mappings.map((mapping) => mapping.value);

        console.log(
          "Method:",
          method,
          parameters,
          new BN.BN(mintPrice || "0").muln(mintAmount).toString()
        );

        let gas = await method.apply(null, parameters).estimateGas({
          from: walletAddress,
          value: new BN.BN(mintPrice || "0").muln(mintAmount).toString(),
        });

        let gasPrice = await web3.eth.getGasPrice();

        if (!gasPrice || !gas) {
          throw new Error("Couldn't estimate transaction costs.");
        }

        return new BN.BN(gas).mul(new BN.BN(gasPrice));
      } else throw new Error("Custom mint config error.");
    } else {
      throw new Error("Couldn't estabilish blockchain connection.");
    }
  };

  const startFeesEstimations = () => {
    const evalEstimations = async () => {
      if (nftCollection) {
        let fees: BN = new BN.BN("0");

        if (props.customMintMethodOptions) {
          fees = await evalCustomMethodFees();
        } else {
          if (
            nftCollection.type === SmartContractType.MINTEEBLE_ERC1155 &&
            props.erc1155Id
          ) {
            fees = new BN.BN(
              await (
                nftCollection as MinteebleERC1155CollectionInstance
              ).smartContract
                .estimatedMintTrxFees(parseInt(props.erc1155Id), mintAmount)
                .toString()
            );
          } else if (
            nftCollection.type === SmartContractType.MINTEEBLE_ERC721
          ) {
            fees = new BN.BN(
              await (
                nftCollection as MinteebleERC721CollectionInstance
              ).smartContract
                .estimatedMintTrxFees(mintAmount)
                .toString()
            );
          }
        }

        console.log("Got new fees:", fees);
        if (fees) {
          setFees(
            new BN.BN(fees.toString())
              .div(new BN.BN("10000000000000"))
              .mul(new BN.BN("10000000000000"))
          );
        }
      }
    };

    evalEstimations();
    let intervalId = setInterval(() => {
      evalEstimations();
    }, 10000);

    if (intervalId) setEstimationIntervalId(intervalId);
  };

  const injectMappingValues = (
    items: Array<ParamMappingItem>
  ): Array<ParamMappingItem> => {
    let mappings = [{ text: "MINT_AMOUNT", value: mintAmount.toString() }];

    return items.map((item) => {
      let newItem = new ParamMappingItem();

      mappings.forEach((mapping) => {
        newItem.value = item.value.replace(mapping.text, mapping.value);
        newItem.parameterName = item.parameterName;

        item.value = item.value.replace(mapping.text, mapping.value);
      });

      return newItem;
    });
  };

  const triggerCustomMint = async () => {
    if (nftCollection && mintPrice) {
      let options = props.customMintMethodOptions;
      let methodName = options?.methodName;

      if (options && methodName) {
        let method = nftCollection.smartContract.contract?.methods[methodName];

        if (!method)
          throw Error(`Custom method "${methodName}" does not exist.`);

        let mappings = injectMappingValues(options.mappings || []);

        let parameters = mappings.map((mapping) => mapping.value);

        console.log("Custom params:", parameters);

        await method.apply(null, parameters).send({
          value: mintPrice.muln(mintAmount).toString(),
          from: walletAddress,
        });
      } else {
        throw new Error("Invalid parameters");
      }
    } else {
      throw new Error("NftCollection error");
    }
  };

  const mint = async () => {
    if (nftCollection && nftCollection.active) {
      if (props.customMintMethodOptions) {
        try {
          await triggerCustomMint();
          // NotificationHandler.instance.success("Successfully Minted");
        } catch (err: any) {
          console.log(err);
          // NotificationHandler.instance.error(err);
        }
      } else {
        if (nftCollection.type === SmartContractType.MINTEEBLE_ERC721) {
          try {
            await (
              nftCollection as MinteebleERC721CollectionInstance
            ).smartContract.mintToken(mintAmount);
            // NotificationHandler.instance.success("Successfully Minted");
          } catch (err: any) {
            console.log(err);
            // NotificationHandler.instance.error(err);
          }
        } else if (
          nftCollection.type === SmartContractType.MINTEEBLE_ERC1155 &&
          props.erc1155Id
        ) {
          try {
            await (
              nftCollection as MinteebleERC1155CollectionInstance
            ).smartContract.mintToken(parseInt(props.erc1155Id), mintAmount);
            // NotificationHandler.instance.success("Successfully Minted");
          } catch (err: any) {
            console.log(err);
            // NotificationHandler.instance.error(err);
          }
        }
      }

      mintCompleted();
    } else {
      throw Error("Invalid NFT collection instance.");
    }
  };

  const mintCompleted = () => {
    if (props.redirectUrl) {
      switch (props.redirectUrl) {
        case "close":
          try {
            close();
          } catch (err) {
            console.error(err);
          }

          // setWindowClosed();
          break;

        default:
          window.location.href = props.redirectUrl;
      }
    }
  };

  // Mint logic object
  const mintLogic: MinteeWidgetLogic = {
    nftCollection,
    mintAmount,
    mintPrice,
    fees,
    totalPrice,
    signInUser,
    signOutUser,
    incrementMintAmount,
    decrementMintAmount,
    isSigningIn,
    mint,
  };

  return mintLogic;
};

export default useMinteeWidget;
