import { addCmd } from "@ursamu/core";

export default () => {
  addCmd({
    name: "say",
    flags: "connected",
    pattern: /^s[ay]*?|"\s+?(.*)/i,
    render: async (args, ctx) => {},
  });
};
