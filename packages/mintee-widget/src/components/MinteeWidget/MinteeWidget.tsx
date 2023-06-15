/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
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
import { EnvironmentType, EnvManager, useWalletService } from "@minteeble/sdk";
import {
  faCircleExclamation,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMinteeWidget from "./useMinteeWidget";
import { MinteeWidgetUtils } from "./MinteeWidgetUtils";

/**
 * Minteeble Mint Widget
 *
 * @param props Widget props
 * @returns Mint Widget JSX Element
 */
const MinteeWidget = (props: MintWidgetProps): JSX.Element => {
  // Hooks
  const { web3, userIsSigning, walletAddress } = useWalletService();

  // Mint logic object
  const mintLogic = useMinteeWidget(props);

  return (
    <div className="mint-widget-wrapper">
      <div className="mint-card">
        <div className="mint-card-header">
          <h2 className="mint-card-title">
            Minting {mintLogic.mintAmount} Item
            {mintLogic.mintAmount > 1 ? "s" : ""}
          </h2>
          {walletAddress && (
            <span className="label">
              Wallet: {MinteeWidgetUtils.minifyAddress(walletAddress)}{" "}
              <a
                href="#"
                className="disconnect-wallet"
                onClick={() => {
                  mintLogic.signOutUser();
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
            {mintLogic.nftCollection?.collectionName || "-"}
          </h3>
        </div>

        <div className="mint-card-section purchase-details">
          <div className="bottom-section">
            {web3 && (
              <div className="purchase-items">
                <div className="item">
                  <div className="key bold">Total</div>
                  <div className="value bold">
                    {web3
                      ? `≈ ${web3.utils.fromWei(mintLogic.totalPrice)} ETH`
                      : "- ETH"}
                  </div>
                </div>
              </div>
            )}

            {mintLogic.isSigningIn ? (
              <LoadingSpinner />
            ) : walletAddress ? (
              <Button
                text="MINT"
                onClick={() => {
                  mintLogic.mint();
                }}
              />
            ) : (
              <Button
                text="CONNECT WALLET"
                onClick={() => {
                  mintLogic.signInUser();
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
                  {mintLogic.fees && (
                    <div className="item">
                      <div className="key">Fees</div>
                      <div className="value">
                        ≈ {web3.utils.fromWei(mintLogic.fees)} ETH
                      </div>
                    </div>
                  )}
                  <div className="item">
                    <div className="key bold">NFTs</div>
                    <div className="value bold">
                      {mintLogic.mintPrice ? (
                        web3.utils.fromWei(
                          mintLogic.mintPrice.muln(mintLogic.mintAmount)
                        )
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
                          mintLogic.decrementMintAmount();
                        }}
                      />
                      {mintLogic.mintAmount}
                      <IconButton
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        onClick={() => {
                          mintLogic.incrementMintAmount();
                        }}
                      />
                    </div>
                    {!web3 && <div>Test</div>}
                    <div className="value">
                      {mintLogic.mintAmount} x{" "}
                      {mintLogic.mintPrice
                        ? web3.utils.fromWei(mintLogic.mintPrice)
                        : "-"}{" "}
                      ETH
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
