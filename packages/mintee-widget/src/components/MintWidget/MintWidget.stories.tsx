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

import MintWidget from "./MintWidget";
import { MintWidgetProps } from "./MintWidget.types";

export default {
  title: "MintWidget",
  component: MintWidget,
  argTypes: {},
} as Meta<typeof MintWidget>;

const Template: Story<MintWidgetProps> = (args) => <MintWidget {...args} />;

export const SimplePoweredByMinteeble = Template.bind({});
SimplePoweredByMinteeble.args = {
  chainName: "sepolia",
  collectionId: "087b8459-544a-46e0-bb10-c13d8d67727a",
};
