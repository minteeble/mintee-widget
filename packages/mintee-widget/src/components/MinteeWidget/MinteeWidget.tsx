/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Node module: @minteeble/ui-components
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import React, { useEffect, useState } from "react";
import {
  AppVersionLabel,
  Button,
  IconButton,
  LoadingSpinner,
  PoweredByMinteeble,
} from "@minteeble/ui-components";
import { MintWidgetProps, ParamMappingItem } from "./MinteeWidget.types";
import {
  EnvironmentType,
  EnvManager,
  useAuthService,
  useNftCollectionService,
  useWalletService,
} from "@minteeble/sdk";
import {
  faCircleExclamation,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BN } from "ethereumjs-util";
import {
  MinteebleERC721CollectionInstance,
  MinteebleERC1155CollectionInstance,
} from "@minteeble/sdk/lib/esm/services/Nft/NftCollection/NftCollectionInstance";
import { SmartContractType } from "@minteeble/utils";
// import { NotificationHandler } from "../../../../Utils/NotificationHandler";

/**
 * Minteeble Mint Widget
 *
 * @param props Widget props
 * @returns Mint Widget JSX Element
 */
const MinteeWidget = (props: MintWidgetProps): JSX.Element => {
  // Services
  // const { signIn, user, signOut } = useAuthService();
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
    // setMintPrice(new BN.BN("1000000000000000"));
    // setFees(new BN.BN("0"));
  }, []);

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

  const singInUser = async () => {
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

  /**
   * Minifies a wallet address. Example:
   * 0xE53A10BeF39f00f11042c6E06ED1e4D79CEC352F -> 0xE53A...352F
   *
   * @param walletAddress Wallet address to be minified
   */
  const minifyAddress = (walletAddress: string) => {
    return walletAddress.length === 42
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(38)}`
      : "-";
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

  return (
    <div className="mint-widget-wrapper">
      <div className="mint-card">
        <div className="mint-card-header">
          <h2 className="mint-card-title">
            Minting {mintAmount} Item{mintAmount > 1 ? "s" : ""}
          </h2>
          {walletAddress && (
            <span className="label">
              Wallet: {minifyAddress(walletAddress)}{" "}
              <a
                href="#"
                className="disconnect-wallet"
                onClick={() => {
                  signOutUser();
                }}
              >
                (disconnect)
              </a>
            </span>
          )}
        </div>
        <div className="mint-card-section collection-info">
          {/* <img
            src="https://picsum.photos/200/200"
            className="collection-image"
          /> */}
          <h3 className="collection-title">
            {nftCollection?.collectionName || "-"}
          </h3>
        </div>

        <div className="mint-card-section purchase-details">
          <div className="bottom-section">
            {web3 && (
              <div className="purchase-items">
                <div className="item">
                  <div className="key bold">Total</div>
                  <div className="value bold">
                    {web3 ? `≈ ${web3.utils.fromWei(totalPrice)} ETH` : "- ETH"}
                  </div>
                </div>
              </div>
            )}

            {isSigningIn ? (
              <LoadingSpinner />
            ) : walletAddress ? (
              <Button
                text="MINT"
                onClick={() => {
                  mint();
                }}
              />
            ) : (
              <Button
                text="CONNECT WALLET"
                onClick={() => {
                  singInUser();
                }}
              />
            )}
          </div>
          {!web3 && (
            <div className="connect-wallet-info">
              <p>Connect the wallet to view more information about the mint</p>
              <FontAwesomeIcon icon={faCircleExclamation} />
            </div>
          )}
          {web3 && (
            <>
              <div className="up-section">
                <span className="label">Purchase details</span>
                <div className="purchase-items">
                  {fees && (
                    <div className="item">
                      <div className="key">Fees</div>
                      <div className="value">
                        ≈ {web3.utils.fromWei(fees)} ETH
                      </div>
                    </div>
                  )}
                  <div className="item">
                    <div className="key bold">NFTs</div>
                    <div className="value bold">
                      {mintPrice ? (
                        web3.utils.fromWei(mintPrice.muln(mintAmount))
                      ) : (
                        <LoadingSpinner />
                      )}{" "}
                      ETH
                    </div>
                  </div>
                  <div className="sub-item">
                    <div className="key amount-controls">
                      <IconButton
                        icon={<FontAwesomeIcon icon={faMinus} />}
                        onClick={() => {
                          setMintAmount((currentAmount) => {
                            return currentAmount > 1
                              ? currentAmount - 1
                              : currentAmount;
                          });
                        }}
                      />
                      {mintAmount}
                      <IconButton
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => {
                          setMintAmount((currentAmount) => {
                            return currentAmount + 1;
                          });
                        }}
                      />
                    </div>
                    {!web3 && <div>Test</div>}
                    <div className="value">
                      {mintAmount} x{" "}
                      {mintPrice ? web3.utils.fromWei(mintPrice) : "-"} ETH
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="powered-by">
        <PoweredByMinteeble link={true} />
      </div>
      <AppVersionLabel
        version={process.env.APP_VERSION || "-"}
        environmentName={EnvManager.environment ? "Prod" : "Dev"}
        customPattern={EnvManager.environment ? "v$V" : "v$V - $ENV"}
      />
    </div>
  );
};

export default MinteeWidget;
