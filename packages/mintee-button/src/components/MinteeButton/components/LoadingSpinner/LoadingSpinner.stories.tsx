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

import LoadingSpinner from "./LoadingSpinner";
import {
  LoadingSpinnerProps,
  LoadingSpinnerSize,
} from "./LoadingSpinner.types";

export default {
  title: "components/LoadingSpinner",
  component: LoadingSpinner,
  argTypes: {},
} as Meta<typeof LoadingSpinner>;

const Template: Story<LoadingSpinnerProps> = (args) => (
  <LoadingSpinner {...args} />
);

export const DefaultLoadingSpinner = Template.bind({});
DefaultLoadingSpinner.args = {
  Size: LoadingSpinnerSize.Medium,
};
