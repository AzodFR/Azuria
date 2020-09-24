# Azuria

Azuria is an Economical Discord's Bot.

## Configuration

First you have to rename the `config-example.json` into `config.json`

After that you have to add your token in the file. `"token": "yourtoken"` (edit yourtoken)

You can change the prefix for preventing any conflict `"prefix": "$"`

You can set `"dev": "on"` for having the solution of BankAttack game

## Commands

`$money` → Send how much money you have on this server

`$bankatk` → Launch the BankAttack game (you can only start a game at once)

## BankAttack Game

BankAttack Game is a mini-game where you have multiple line of hidden case which can hide a moneybag or a skullhead.

https://imgur.com/grGeUJl

You first have to react with which line you want to select (A, B, C, D, E)

https://imgur.com/54I5ijP

Once done you can select which case on the selected line you want to reveal

https://imgur.com/M9yirnE

It can be a money bag so you win coins... (`"amount_batk': 10` ← amount editable in config)

https://imgur.com/pwnDJyh

...or a skullhead and you lose the game

https://imgur.com/zGQ2kgZ

If you reveal all the moneybags without find a skullhead, you win the game and win 100 coins

https://imgur.com/g7D2DB9

In dev mode, the number at the right is the case where are the skullhead
