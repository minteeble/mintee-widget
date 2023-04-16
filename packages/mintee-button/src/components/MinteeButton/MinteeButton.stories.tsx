/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Package: @minteeble/mintee-widget
 * This file is licensed under the MIT License.
 * License text available at https://opensource.org/licenses/MIT
 *
 * email:     minteeble@gmail.com
 * website:   https://minteeble.com
 */

import React from "react";

import { Story, Meta } from "@storybook/react";

import MinteeButton from "./MinteeButton";
import { MinteeButtonProps } from "./MinteeButton.types";

export default {
  title: "components/MinteeButton",
  component: MinteeButton,
  argTypes: {},
} as Meta<typeof MinteeButton>;

const Template: Story<MinteeButtonProps> = (args) => <MinteeButton {...args} />;

export const DefaultMinteeButton = Template.bind({});
DefaultMinteeButton.args = {
  chainName: "sepolia",
  collectionId: "087b8459-544a-46e0-bb10-c13d8d67727a",
};
