---
name: scenes
desc: Scene Management commands
category: Roleplay Commands
---

# Scene System

The scene system is used to create managed spaces to RP. Think of a scene as a snapshot of a place, but encapilated. All poses will be saved in a scene for processing of logs later, as well as asynchonious play.

## General Commands

- `+scene` List the current scene you're posing in.`

- `+scene/last [<number>]` Retrieve the last several poses/emotes from the scene.

## Admin Commands

- `+scene/set <option> = <value> (admin)` Change a scene setting.
- `+scene/add <character>` Add a character to recieve notifications about the scene.
- `+scene/remove <character>` Remove a character from a scene.

- **Scene/set Options**

  - `admins = <name list>` give list of names or dbrefs or alias to give those players rights to 'admin' commands.
  - `join = <flag expression>` Set the flags of who can view/join this scene.

## Owner Commands

Owner commands can only be used by game staff, and the owner of a scene,

- `+scene/addstaff <character>`
- `+secene/remstaff <character>`
