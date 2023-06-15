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
import { BN } from "ethereumjs-util";
import {
  MinteebleERC721CollectionInstance,
  MinteebleERC1155CollectionInstance,
} from "@minteeble/sdk";

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
export interface MinteeWidgetLogic {
  /**
   * NftCollection instance.
   * The collaction can be MinteebleERC1155 or MinteebleERC721.
   * It is null when the collection is not loaded yet, or if it encounters errors.
   */
  nftCollection:
    | MinteebleERC721CollectionInstance
    | MinteebleERC1155CollectionInstance
    | null;

  /**
   * Selected amunt to be minted. Default to 1.
   */
  mintAmount: number;

  /**
   * Single item price.
   * It is null if it hasn't completed loading yet and/or encountered errors
   */
  mintPrice: BN | null;

  /**
   * Network fees estimation for minting transaction.
   * It is null if it hasn't completed loading yet and/or encountered errors
   */
  fees: BN | null;

  /**
   * Total price estimation.
   * Default to 0.
   */
  totalPrice: BN;

  /**
   * Signs in user
   */
  signInUser(): Promise<void>;

  /**
   * Signs out user
   */
  signOutUser(): Promise<void>;

  /**
   * Tries to increase the mint amount.
   */
  incrementMintAmount(): void;

  /**
   * Tries to decrease the mint amount.
   */
  decrementMintAmount(): void;

  /**
   * Specifies if user is signing in (wallet connection).
   */
  isSigningIn: boolean;

  /**
   * Triggers mint transaction, accordigly to all the other settings (mint price, amount, etc.).
   */
  mint(): Promise<void>;
}

/**
 * Props model for Minteeble Mint Widget component
 */
export interface MintWidgetProps extends UseMinteeWidgetProps {}
