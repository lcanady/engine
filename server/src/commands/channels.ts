import { addCmd, Channel, Context, flags, parser, send } from "@ursamu/core";
import { channels, db } from "..";
import { cmsg } from "../utils/utils";

/**
 * Format the display name channels when listed.
 * @param channel The Channel object to work with
 * @returns
 */
const listName = (channel: Channel) =>
  channel.display
    ? channel.display +
      " ".repeat(25 - parser.stripSubs("telnet", channel.display).length)
    : channel.name.padEnd(25);

/**
 *  Display a channel descrption.
 * @param ctx The context object
 * @param channel The channel object to work with
 * @returns
 */
const listDesc = (ctx: Context, channel: Channel) =>
  channel.description?.padEnd(ctx.data.width - 40) ||
  " ".padEnd(ctx.data.width - 40);

export default () => {
  addCmd({
    name: "@ccreate",
    pattern: /^[@\+]?ccreate\s+(.*)/i,
    flags: "connected wizard+",
    hidden: true,
    render: async (args, ctx) => {
      const regex = new RegExp(args[1], "i");

      const taken = await channels.find({ name: regex });

      if (taken.length > 0) return send(ctx.id, "That channel already exists.");

      const chan = await channels.create({
        name: parser.stripSubs("telnet", args[1].toLocaleLowerCase()),
        modify: "staff+",
        access: "connected",
        header: `%ch[%cn${args[1]}%ch]%cn`,
      });
      if (chan)
        send(
          ctx.id,
          `Done. Channel %ch${chan.name.toUpperCase()}%cn has been created.`
        );
    },
  });

  addCmd({
    name: "@cset",
    pattern: /^[@\+]cset\s+(\w+)(?:\/(\w+))?\s*=\s*(.*)/i,
    flags: "connected wizard+",
    hidden: true,
    render: async (args, ctx) => {
      const channel = (await channels.find({ name: args[1].toLowerCase() }))[0];
      const modifier = args[2] ? args[2].toLowerCase() : "read";

      if (channel) {
        switch (modifier) {
          case "read":
          case "write":
          case "modify":
          case "alias":
            channel[modifier] = args[3];
            await channels.update({ _id: channel._id }, channel);
            send(
              ctx.id,
              `Done. Channel option %ch${modifier.toUpperCase()}%cn updated for channel %ch${args[1].toUpperCase()}%cn.`
            );
            break;
          case "desc":
            channel.description = args[3];
            await channels.update({ _id: channel._id }, channel);
            send(
              ctx.id,
              `Done. Channel option %chDESCRIPTION%cn updated for channel %ch${args[1].toUpperCase()}%cn.`
            );
            break;
          case "mask":
          case "loud":
          case "private":
            channel[modifier] =
              args[3].toLowerCase() === "false" ? false : true;
            await channels.update({ _id: channel._id }, channel);
            send(
              ctx.id,
              `Done. Channel option %ch${modifier.toUpperCase()}%cn updated for channel %ch${
                args[3].toLowerCase() === "false" ? false : true
              }%cn.`
            );
            break;
          case "header":
          case "display":
            const regex = new RegExp(channel.name, "i");
            if (regex.test(parser.stripSubs("telnet", args[3]))) {
              channel[modifier] = args[3];
              await channels.update({ _id: channel._id }, channel);
              send(
                ctx.id,
                `Done. Channel option %ch${modifier.toUpperCase()}%cn updated for channel %ch${args[1].toUpperCase()}%cn.`
              );
            } else {
              send(ctx.id, "Permission denied.");
            }

            break;
          default:
            send(ctx.id, "I don't recognize that switch.");
        }
      } else {
        send(ctx.id, "I can't find that channel.");
      }
    },
  });

  addCmd({
    name: "addcom",
    pattern: /^[@\+]?addcom\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    hidden: true,
    render: async (args, ctx) => {
      const channel = (await channels.find({ name: args[2] }))[0];
      const chan = ctx.player?.data?.channels?.find(
        (chan) => chan.alias === args[1].toLowerCase()
      );

      if (!chan) {
        if (
          ctx.player &&
          channel &&
          flags.check(ctx.player.flags || "", channel.access || "")
        ) {
          ctx.player.data.channels = ctx.player.data.channels
            ? ctx.player?.data.channels
            : [];

          ctx.player.data.channels.push({
            _id: channel._id!,
            name: channel.name,
            alias: args[1].toLowerCase(),
            mask: "",
            title: "",
          });
          await db.update({ _id: ctx.player._id }, ctx.player);
          ctx.socket.join(channel._id!);

          await send(
            channel._id!,
            await cmsg(channel._id!, ctx.player, ":has joined this channel.")
          );
          await send(
            ctx.id,
            `Done. Channel %ch${channel.name.toUpperCase()}%cn added with alias: %ch${args[1].toLowerCase()}%cn.`
          );
        } else {
          send(ctx.id, "I can't find a channel with that name.");
        }
      } else {
        send(ctx.id, "A Channel with that alias already exists.");
      }
    },
  });

  addCmd({
    name: "delcom",
    pattern: /^[@\+]?delcom\s+(.*)/i,
    flags: "connected",
    hidden: true,
    render: async (args, ctx) => {
      const chan = ctx.player?.data.channels?.find(
        (chan) => chan.alias === args[1].toLowerCase()
      );
      if (ctx.player && chan) {
        await send(
          chan._id,
          await cmsg(chan._id, ctx.player, ":has left this channel.")
        );
        ctx.player.data.channels = ctx.player?.data.channels?.filter(
          (ch) => ch.alias !== args[1].toLowerCase()
        );
        await db.update({ _id: ctx.player._id }, ctx.player);
      } else {
        send(ctx.id, "I can't find a channel by that alias.");
      }
    },
  });

  addCmd({
    name: "comlist",
    pattern: /^[@\+]?comlist/i,
    flags: "connected",
    hidden: true,
    render: async (args, ctx) => {
      let output = `%r%ch${"CHANNEL".padEnd(25)}%cn %ch${"ALIAS".padEnd(
        10
      )}%cn %ch${"DESCRIPTION".padEnd(ctx.data.width - 40)}%cn`;

      const comList = [];
      for (const chan of ctx.player?.data.channels || []) {
        const channel = await channels.get(chan._id);
        if (channel) {
          comList.push(
            `${listName(channel)} ${chan.alias.padEnd(10)} ${listDesc(
              ctx,
              channel
            )}`
          );
        }
      }

      output +=
        "%r" +
        comList.join("%r") +
        `%cn%r%rType '%ch<alias> <message>%cn' to talk on a channel.%r`;

      await send(ctx.id, output);
    },
  });

  addCmd({
    name: "@clist",
    pattern: /^[@\+]?clist/i,
    flags: "connected",
    hidden: true,
    render: async (args, ctx) => {
      const list = (await channels.find({})).filter((chan) =>
        flags.check(ctx.player?.flags || "", chan.access || "")
      );

      let output = `%r%ch${"CHANNEL".padEnd(25)}%cn %ch${"DESCRIPTION".padEnd(
        ctx.data.width - 26
      )}%cn%r`;

      output +=
        list
          .map((chan) => `${listName(chan)} ${listDesc(ctx, chan)}`)
          .join("%r") +
        "%r%rType '%chaddcom <channel>=<alias>%cn' to add a channel.";

      send(ctx.id, output);
    },
  });

  addCmd({
    name: "comtitle",
    pattern: /^[@\+]?comtitle (.*)\s*=\s*(.*)/i,
    flags: "connected",
    hidden: true,
    render: async (args, ctx) => {
      const chan = ctx.player?.data.channels?.find(
        (chan) => chan.alias === args[1].toLowerCase()
      );
      if (ctx.player && chan) {
        ctx.player.data.channels = ctx.player.data.channels?.map((c) => {
          if (c.alias === args[1].toLowerCase()) {
            c.title = args[2];
          }
          return c;
        });

        await db.update({ _id: ctx.player._id }, ctx.player);

        await send(
          ctx.id,
          `Done. %chComtitle%cn for channel %ch${chan.name.toUpperCase()}%cn ${
            args[2].trim() ? "set to:" : "cleared"
          } ${args[2]}`
        );
      } else {
        await send(ctx.id, "I can't find that channel.");
      }
    },
  });

  addCmd({
    name: "commask",
    pattern: /^[@\+]?commask (.*)\s*=\s*(.*)/i,
    flags: "connected",
    hidden: true,
    render: async (args, ctx) => {
      const chan = ctx.player?.data.channels?.find(
        (chan) => chan.alias === args[1].toLowerCase()
      );

      if (ctx.player && chan) {
        const channel = await channels.get(chan._id);
        if (channel?.mask) {
          ctx.player.data.channels = ctx.player.data.channels?.map((c) => {
            if (c.alias === args[1].toLowerCase()) {
              c.mask = args[2];
            }
            return c;
          });
        } else {
          return await send(ctx.id, "Permission deined.");
        }

        await db.update({ _id: ctx.player._id }, ctx.player);

        await send(
          ctx.id,
          `Done. %chComtitle%cn for channel %ch${chan.name.toUpperCase()}%cn ${
            args[2].trim() ? "set to:" : "cleared"
          } ${args[2]}`
        );
      } else {
        await send(ctx.id, "I can't find that channel.");
      }
    },
  });
};
