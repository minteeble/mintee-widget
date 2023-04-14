import { EnvironmentType, EnvManager } from "@minteeble/sdk";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MinteeButtonProps,
  UseMinteeButtonProps,
  UseMinteeButtonReturnedValue,
} from "./MinteeButton.types";

const useMinteeButton = (
  props: UseMinteeButtonProps
): UseMinteeButtonReturnedValue => {
  const [popup, setPopup] = useState<Window>();
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout>();
  const [searchParams, setSearchParams] = useSearchParams();

  let host =
    EnvManager.environment === EnvironmentType.Prod
      ? "https://app.minteeble.com"
      : "https://app-dev.minteeble.com";

  let customHost = searchParams.get("minteeble-url");

  if (customHost) {
    host = customHost;
  }

  const buildMintUrl = (): string => {
    let url = `${host}/mint/chain/${props.chainName}/id/${props.collectionId}${
      props.erc1155Id ? `/${props.erc1155Id}` : ""
    }`;
    let params: Array<string> = [];

    if (props.closeAfterMint) {
      params.push("redirect=close");
    } else if (props.redirectUrl) {
      params.push(`redirect=${props.redirectUrl}`);
    }

    if (props.customMintOptions) {
      params.push(
        `customMintMethodOptions=${encodeURIComponent(
          JSON.stringify(props.customMintOptions)
        )}`
      );
    }

    if (props.discountPercentage) {
      params.push(`discount=${encodeURIComponent(props.discountPercentage)}`);
    }

    if (props.customPrice) {
      params.push(`price=${encodeURIComponent(props.customPrice)}`);
    }

    if (props.amount) {
      params.push(`amount=${encodeURIComponent(props.amount)}`);
    }

    let queryString = params.join("&");

    url += queryString.length > 0 ? `/?${queryString}` : "";

    return url;
  };

  const triggerMint = async () => {
    var popup = window.open(buildMintUrl(), "popup", "height=640,width=430");

    if (popup) {
      setPopup(popup);
    }
  };

  useEffect(() => {
    if (popup) {
      let intervalId = setInterval(function () {
        if (popup.closed) {
          if (props.onPopupClose) {
            props.onPopupClose();
          }
          console.log("window closed!");

          setPopup(undefined);
        }
      }, 500);

      if (intervalId) {
        setCloseTimeout(intervalId);
      }
    } else {
      if (closeTimeout) {
        clearInterval(closeTimeout);
        setCloseTimeout(undefined);
        setPopup(undefined);
      }
    }
  }, [popup]);

  return { popup, triggerMint };
};

export default useMinteeButton;
