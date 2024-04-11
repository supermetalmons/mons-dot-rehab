export type MonsDotRehab = {
  "version": "0.1.0",
  "name": "mons_dot_rehab",
  "instructions": [
    {
      "name": "createGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "host",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "joinGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "guest",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolveGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "hostId",
            "type": "publicKey"
          },
          {
            "name": "guestId",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameNotFound",
      "msg": "The specified game was not found."
    },
    {
      "code": 6001,
      "name": "GameAlreadyJoined",
      "msg": "This game has already been joined."
    },
    {
      "code": 6002,
      "name": "GameAlreadyResolvedOrInsufficientFunds",
      "msg": "The game has already been resolved or has insufficient funds."
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized action."
    },
    {
      "code": 6004,
      "name": "AmountOverflow",
      "msg": "Amount overflow."
    }
  ]
};

export const IDL: MonsDotRehab = {
  "version": "0.1.0",
  "name": "mons_dot_rehab",
  "instructions": [
    {
      "name": "createGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "host",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "joinGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "guest",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "gameId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "resolveGame",
      "accounts": [
        {
          "name": "game",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "caller",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "game",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "gameId",
            "type": "u64"
          },
          {
            "name": "hostId",
            "type": "publicKey"
          },
          {
            "name": "guestId",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "GameNotFound",
      "msg": "The specified game was not found."
    },
    {
      "code": 6001,
      "name": "GameAlreadyJoined",
      "msg": "This game has already been joined."
    },
    {
      "code": 6002,
      "name": "GameAlreadyResolvedOrInsufficientFunds",
      "msg": "The game has already been resolved or has insufficient funds."
    },
    {
      "code": 6003,
      "name": "Unauthorized",
      "msg": "Unauthorized action."
    },
    {
      "code": 6004,
      "name": "AmountOverflow",
      "msg": "Amount overflow."
    }
  ]
};
