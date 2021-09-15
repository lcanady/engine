import { addCmd } from "@ursamu/core";

export default () => {
  addCmd({
    name: "@reload",
    pattern: /^@reload/i,
    flags: "connected wizard+",
    render: async (args, ctx) => {},
  });
};
