/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import { EnvironmentType, EnvManager } from "@minteeble/sdk";

/**
 * Single method mapping interface model
 */
export interface IButtonParamMappingItem {
  /**
   * Method name, to be found inside ABI object
   */
  parameterName: string;

  /**
   * Specifies method value. Can be placeholder (eg. "MINT_AMOUNT"), or immediate value
   */
  value: string;
}

/**
 * Interface model representing the custom method options
 */
export interface IButtonCustomMintMethodOptions {
  /**
   * Custom method name to be used for mint
   */
  methodName: string;

  /**
   * Parameters mappings for custom method
   */
  mappings?: Array<IButtonParamMappingItem>;
}

/**
 * Config model for Minteeble button config
 */
export interface MinteeButtonConfig {
  /**
   * Chain name
   */
  chainName: string;

  /**
   * Collection Minteeble props
   */
  collectionId: string;

  /**
   * optional ERC1155 token id
   */
  erc1155Id?: string;

  /**
   * Specifies if tab has to be closed after mint. Default is false.
   */
  closeAfterMint?: boolean;

  /**
   * If provided, specifies the URL to be redirected to, after mint is completed.
   */
  redirectUrl?: string;

  /**
   * Custom mint config
   */
  customMintOptions?: IButtonCustomMintMethodOptions;

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
   * Current stage. Overwrites the global envirnoment type
   */
  stage?: EnvironmentType;
}

/**
 * Props model for useMinteeButton Hook
 */
export interface UseMinteeButtonProps extends MinteeButtonConfig {
  onPopupClose?: () => void;
}

export interface UseMinteeButtonReturnedValue {
  popup: any;

  triggerMint: () => Promise<void>;
}

/**
 * Minteeble Button props
 */
export interface MinteeButtonProps extends MinteeButtonConfig {}
