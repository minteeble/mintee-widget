/**
 * Copyright Minteeble 2022. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import { ClassExtensible } from "../../../models";

export enum LoadingSpinnerSize {
  Small = "1.2rem",
  Medium = "2rem",
  Large = "3rem",
}

export interface LoadingSpinnerProps extends ClassExtensible {
  Size?: LoadingSpinnerSize;
}
