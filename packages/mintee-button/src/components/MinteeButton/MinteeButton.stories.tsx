/**
 * Copyright Minteeble 2023. All Rights Reserved.
 * Node module: @minteeble/ui-components
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
  title: "ui-components/common/MinteeButton",
  component: MinteeButton,
  argTypes: {},
} as Meta<typeof MinteeButton>;

const Template: Story<MinteeButtonProps> = (args) => <MinteeButton {...args} />;

export const SimplePoweredByMinteeble = Template.bind({});
SimplePoweredByMinteeble.args = {
  chainName: "sepolia",
  collectionId: "test",
};
