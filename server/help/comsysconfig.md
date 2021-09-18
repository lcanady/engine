---
category: communication
name: comsys config
---

# Comsys Configuration

This file covers the steps of what's needed ot work with the configuration commands for the **UrsaMU** MUSH system.

## Staff Commands

- `@cset <channel>/<option>=<setting>`
  - **options**
    - `/read = <flag expression>` Set read access tp mesages from this channel.
    - `/write = <flag expression>` Set write access for messages on this channel.
    - `/access = <flag expression>` Set access permissions for a channel.
    - `/modify = <flag expression>` Who can modify settings on a channel.
    - `/desc = <description>` Set a channel description.
    - `/mask = <true | false>` Are channel masks allowed here?
    - `/log = <true | false>` Does the channel show when someone leaves the channel?
