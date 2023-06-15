/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import { INotificationHandler } from "@minteeble/utils";
import { JsonObject, JsonProperty } from "typescript-json-serializer";
import { AbiItem } from "web3-utils";

/**
 * Single method mapping interface model
 */
export interface IParamMappingItem {
  /**
   * Method name, to be found inside ABI object
   */
  parameterName: string;

  /**
   * Specifies method value. Can be placeholder (eg. "MINT_AMOUNT"), or immediate value
   */
  value: string;
}

@JsonObject()
export class ParamMappingItem implements IParamMappingItem {
  @JsonProperty()
  parameterName: string;

  @JsonProperty()
  value: string;

  constructor() {
    this.parameterName = "";
    this.value = "";
  }
}

/**
 * Interface model representing the custom method options
 */
export interface ICustomMintOptions {
  /**
   * Custom method name to be used for mint
   */
  methodName: string;

  /**
   * Parameters mappings for custom method
   */
  mappings?: Array<IParamMappingItem>;
}

@JsonObject()
export class CustomMintOptions implements ICustomMintOptions {
  @JsonProperty()
  methodName: string;

  @JsonProperty({ type: ParamMappingItem })
  mappings?: Array<ParamMappingItem>;

  constructor() {
    this.methodName = "";
  }
}

/**
 * Props model for Minteeble Mint Widget component
 */
export interface UseMinteeWidgetProps {
  /**
   * Specifies if "Powered by Minteeble" label should be shown or not
   */
  showPoweredBy?: boolean;

  /**
   * Network chain name (goerli, mainnet, etc.)
   */
  chainName: string;

  /**
   * Minteeble collection ID
   */
  collectionId: string;

  /**
   * optional ERC1155 token id
   */
  erc1155Id?: string;

  /**
   * Options for hendling custom mint method
   */
  customMintMethodOptions?: CustomMintOptions;

  /**
   * If provided, specifies the url to be redirected to after mint completion
   */
  redirectUrl?: string;

  /**
   * Specifies a custom price in wei to be sent for the mint transactions.
   * By default the mint price is read from collection smart contract
   */
  customPrice?: string;

  /**
   * Discount to be applied to the final price.
   */
  discountPercentage?: number;

  /**
   * NFTs amount to be minted
   */
  amount?: number;

  /**
   * Optional notification handler for handling errors and other kind of messages.
   */
  notificationHandler?: INotificationHandler;
}

/**
 * Object returned by UseMinteeWidget hook, containing all the required states and methods
 * for handling the minting operation.
 */
export interface MinteeWidgetLogic {}

/**
 * Props model for Minteeble Mint Widget component
 */
export interface MintWidgetProps extends UseMinteeWidgetProps {}
