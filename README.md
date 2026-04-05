# @zyx1121/hackmd-mcp

MCP server for HackMD — list, read, create, update, and delete notes via Claude Code.

## Setup

### 1. Get API Token

1. 登入 [HackMD](https://hackmd.io)
2. 進入 [Settings → API](https://hackmd.io/settings#api)
3. 點 **Create API token**，取一個名稱
4. 複製 token（關掉視窗後就看不到了）

### 2. Configure MCP

```json
{
  "mcpServers": {
    "hackmd": {
      "command": "npx",
      "args": ["-y", "@zyx1121/hackmd-mcp"],
      "env": {
        "HACKMD_API_TOKEN": "your-token-here"
      }
    }
  }
}
```

## Tools

| Tool | Description |
|:-----|:------------|
| `get_me` | Get current user profile |
| `list_notes` | List all notes |
| `get_note` | Get a note (with content) |
| `create_note` | Create a new note |
| `update_note` | Update content or permissions |
| `delete_note` | Delete a note |
| `get_history` | Get reading history |
| `list_teams` | List teams |
| `list_team_notes` | List notes of a team |
| `create_team_note` | Create a note in a team |
| `update_team_note` | Update a team note |
| `delete_team_note` | Delete a team note |

## License

[MIT](LICENSE.md) — Note to self.
