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
import LoadingSpinner, {
  LoadingSpinnerSize,
} from "./components/LoadingSpinner";
import { MinteeButtonProps } from "./MinteeButton.types";
import useMinteeButton from "./useMinteeButton";

const MinteeButton = (props: MinteeButtonProps) => {
  const [isLoading, setIsLoading] = useState<Boolean>(false);

  const { popup, triggerMint } = useMinteeButton({
    ...props,
    onPopupClose: () => {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (popup) {
      setIsLoading(true);
    }
  }, [popup]);

  return (
    <div className="mintee-button-wrapper">
      {isLoading && (
        <div className="mintee-button-loading">
          <LoadingSpinner Size={LoadingSpinnerSize.Large} />
        </div>
      )}
      <button
        onClick={() => {
          triggerMint();
        }}
        className="mintee-button"
      >
        MINT
      </button>
    </div>
  );
};

export default MinteeButton;
