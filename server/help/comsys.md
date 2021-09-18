---
name: comsys
desc: Channel system commands
category: communication
---

# UraMU Comnunication System

## Intro

This is the helpfile for the MU Communication system! This system allows players across the game to communicate with each other over various 'channels' of communication. The 'Public' and 'Newbie' channels that every new player enters upon joining the game for instance.

Two of the most accepted uses for the comsystem are to allow OOC communication, and to allow members of groups of players to communicate with each other over the distance of the game.

## Commands

The Folliing commands are available in the comsystem.

### Admin Commands

- `@ccreate <channel>` Create a new channel.
- `@cdestroy <chnnnel>` Destroy a channel.

### Player Commands

#### Listing

- `@addcom <channel>=<alias>` Join a channel.
- `@delcom <alias>` Leave a channel.

#### Communicationg

- `<alias> <message>` Send a channel message.

#### Management

- `<alias> off` Turn a channel off but keep the alias.
- `<alias> on` Turn a channel back on.
- `@clist` List all channels available to you.
- `@comlist` List your added channels/aliases.

for configuration commands and options see [comsys config](/comsysconfig.md).

for examples see [comsys examples](/comsysexamples.md).
