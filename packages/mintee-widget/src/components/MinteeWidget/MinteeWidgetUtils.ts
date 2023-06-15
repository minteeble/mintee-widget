/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

/**
 * MinteeWidget utils class
 */
export class MinteeWidgetUtils {
  /**
   * Minifies a wallet address. Example:
   * 0xE53A10BeF39f00f11042c6E06ED1e4D79CEC352F -> 0xE53A...352F
   *
   * @param walletAddress Wallet address to be minified
   */
  public static minifyAddress = (walletAddress: string) => {
    return walletAddress.length === 42
      ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(38)}`
      : "-";
  };
}
