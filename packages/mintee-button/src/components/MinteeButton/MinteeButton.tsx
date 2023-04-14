import React, { useEffect, useState } from "react";
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
    <div className="minteeble-button-wrapper">
      {isLoading && (
        <div className="minteeble-button-loading">
          {/* <Spinners /> */}
          <span>Loading...</span>
        </div>
      )}
      <button
        onClick={() => {
          triggerMint();
        }}
        className="minteeble-button mint-button"
      >
        MINT
      </button>
    </div>
  );
};

export default MinteeButton;
