import { addCmd, flags, parser, send } from "@ursamu/core";

import { channels, db } from "..";
import { center, cmsg, header, pose, repeat } from "../utils/utils";

export default () => {
  addCmd({
    name: "@ccreate",
    pattern: /^[@\+]?ccreate\s+(.*)/i,
    flags: "connected wizard+",
    render: async (args, ctx) => {
      const regex = new RegExp(args[1], "i");

      const taken = await channels.find({ name: regex });

      if (taken.length > 0) return send(ctx.id, "That channel already exists.");

      const chan = await channels.create({
        name: args[1].toLocaleLowerCase(),
        modify: "wizard+",
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
    render: async (args, ctx) => {
      const channel = (await channels.find({ name: args[1] }))[0];
      const modifier = args[2] ? args[2].toLocaleLowerCase() : "read";
      console.log(modifier);
      if (channel) {
        switch (modifier) {
          case "read":
          case "write":
          case "modify":
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
          case "header":
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
      }
    },
  });

  addCmd({
    name: "addcom",
    pattern: /^[@\+]?addcom\s+(.*)\s*=\s*(.*)/i,
    flags: "connected",
    render: async (args, ctx) => {
      const channel = (await channels.find({ name: args[2] }))[0];
      const chan = ctx.player?.data?.channels?.find(
        (chan) => chan.alias === args[1].toLowerCase()
      );

      if (!chan) {
        if (
          ctx.player &&
          channel &&
          flags.check(ctx.player.flags || "", channel.modify || "")
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

          send(
            ctx.id,
            `Done. Channel %ch${channel.name.toUpperCase()}%cn added with alias: %ch${args[1].toLowerCase()}%cn.`
          );
          send(
            channel._id!,
            await cmsg(channel._id!, ctx.player, ":has joined this channel.")
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
    render: async (args, ctx) => {
      let output = `%r%ch${"CHANNEL".padEnd(40)}%cn %ch${"ALIAS".padEnd(
        10
      )}%cn %ch${"DESCRIPTION".padEnd(ctx.data.width - 55)}%cn`;

      const comList = [];
      for (const chan of ctx.player?.data.channels || []) {
        const channel = await channels.get(chan._id);
        if (channel) {
          comList.push(
            `${
              channel.header
                ? channel.header +
                  " ".repeat(
                    40 - parser.stripSubs("telnet", channel.header).length
                  )
                : channel.name.padEnd(40)
            } ${chan.alias.padEnd(10)} ${
              channel.description?.padEnd(ctx.data.width - 55) ||
              " ".padEnd(ctx.data.width - 55)
            }`
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
};
