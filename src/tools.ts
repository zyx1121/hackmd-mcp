import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { hackmdFetch } from "./api.js";
import { success, error } from "./helpers.js";

export function registerTools(server: McpServer) {
  // ── User ──────────────────────────────────────────────

  server.tool("get_me", "Get current user profile", {}, async () => {
    try {
      return success(await hackmdFetch("/me"));
    } catch (e) {
      return error((e as Error).message);
    }
  });

  // ── Notes ─────────────────────────────────────────────

  server.tool("list_notes", "List all notes of the current user", {}, async () => {
    try {
      return success(await hackmdFetch("/notes"));
    } catch (e) {
      return error((e as Error).message);
    }
  });

  server.tool(
    "get_note",
    "Get a note by ID (returns full content)",
    {
      note_id: z.string().min(1).describe("Note ID"),
    },
    async ({ note_id }) => {
      try {
        return success(await hackmdFetch(`/notes/${note_id}`));
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  server.tool(
    "create_note",
    "Create a new note",
    {
      title: z.string().optional().describe("Note title"),
      content: z.string().optional().describe("Markdown content"),
      read_permission: z
        .enum(["owner", "signed_in", "guest"])
        .default("guest")
        .describe("Read permission (default: guest)"),
      write_permission: z
        .enum(["owner", "signed_in", "guest"])
        .default("owner")
        .describe("Write permission (default: owner)"),
      comment_permission: z
        .enum(["disabled", "forbidden", "owners", "signed_in_users", "everyone"])
        .optional()
        .describe("Comment permission"),
      permalink: z.string().optional().describe("Custom permalink"),
    },
    async ({ title, content, read_permission, write_permission, comment_permission, permalink }) => {
      try {
        const body: Record<string, unknown> = {
          readPermission: read_permission,
          writePermission: write_permission,
        };
        if (title !== undefined) body.title = title;
        if (content !== undefined) body.content = content;
        if (comment_permission !== undefined) body.commentPermission = comment_permission;
        if (permalink !== undefined) body.permalink = permalink;

        return success(await hackmdFetch("/notes", { method: "POST", body }));
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  server.tool(
    "update_note",
    "Update a note's content or permissions",
    {
      note_id: z.string().min(1).describe("Note ID"),
      content: z.string().optional().describe("New markdown content"),
      read_permission: z
        .enum(["owner", "signed_in", "guest"])
        .optional()
        .describe("Read permission"),
      write_permission: z
        .enum(["owner", "signed_in", "guest"])
        .optional()
        .describe("Write permission"),
      permalink: z.string().optional().describe("Custom permalink"),
    },
    async ({ note_id, content, read_permission, write_permission, permalink }) => {
      try {
        const body: Record<string, unknown> = {};
        if (content !== undefined) body.content = content;
        if (read_permission !== undefined) body.readPermission = read_permission;
        if (write_permission !== undefined) body.writePermission = write_permission;
        if (permalink !== undefined) body.permalink = permalink;

        return success(await hackmdFetch(`/notes/${note_id}`, { method: "PATCH", body }));
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  server.tool(
    "delete_note",
    "Delete a note",
    {
      note_id: z.string().min(1).describe("Note ID"),
    },
    async ({ note_id }) => {
      try {
        return success(await hackmdFetch(`/notes/${note_id}`, { method: "DELETE" }));
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  // ── History ───────────────────────────────────────────

  server.tool("get_history", "Get reading history", {}, async () => {
    try {
      return success(await hackmdFetch("/history"));
    } catch (e) {
      return error((e as Error).message);
    }
  });

  // ── Teams ─────────────────────────────────────────────

  server.tool("list_teams", "List teams the user belongs to", {}, async () => {
    try {
      return success(await hackmdFetch("/teams"));
    } catch (e) {
      return error((e as Error).message);
    }
  });

  server.tool(
    "list_team_notes",
    "List notes of a team",
    {
      team_path: z.string().min(1).describe("Team path (e.g. 'my-team')"),
    },
    async ({ team_path }) => {
      try {
        return success(await hackmdFetch(`/teams/${team_path}/notes`));
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  server.tool(
    "create_team_note",
    "Create a note in a team",
    {
      team_path: z.string().min(1).describe("Team path"),
      title: z.string().optional().describe("Note title"),
      content: z.string().optional().describe("Markdown content"),
      read_permission: z
        .enum(["owner", "signed_in", "guest"])
        .default("guest")
        .describe("Read permission"),
      write_permission: z
        .enum(["owner", "signed_in", "guest"])
        .default("owner")
        .describe("Write permission"),
      permalink: z.string().optional().describe("Custom permalink"),
    },
    async ({ team_path, title, content, read_permission, write_permission, permalink }) => {
      try {
        const body: Record<string, unknown> = {
          readPermission: read_permission,
          writePermission: write_permission,
        };
        if (title !== undefined) body.title = title;
        if (content !== undefined) body.content = content;
        if (permalink !== undefined) body.permalink = permalink;

        return success(
          await hackmdFetch(`/teams/${team_path}/notes`, { method: "POST", body })
        );
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  server.tool(
    "update_team_note",
    "Update a team note",
    {
      team_path: z.string().min(1).describe("Team path"),
      note_id: z.string().min(1).describe("Note ID"),
      content: z.string().optional().describe("New markdown content"),
      read_permission: z
        .enum(["owner", "signed_in", "guest"])
        .optional()
        .describe("Read permission"),
      write_permission: z
        .enum(["owner", "signed_in", "guest"])
        .optional()
        .describe("Write permission"),
      permalink: z.string().optional().describe("Custom permalink"),
    },
    async ({ team_path, note_id, content, read_permission, write_permission, permalink }) => {
      try {
        const body: Record<string, unknown> = {};
        if (content !== undefined) body.content = content;
        if (read_permission !== undefined) body.readPermission = read_permission;
        if (write_permission !== undefined) body.writePermission = write_permission;
        if (permalink !== undefined) body.permalink = permalink;

        return success(
          await hackmdFetch(`/teams/${team_path}/notes/${note_id}`, { method: "PATCH", body })
        );
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );

  server.tool(
    "delete_team_note",
    "Delete a team note",
    {
      team_path: z.string().min(1).describe("Team path"),
      note_id: z.string().min(1).describe("Note ID"),
    },
    async ({ team_path, note_id }) => {
      try {
        return success(
          await hackmdFetch(`/teams/${team_path}/notes/${note_id}`, { method: "DELETE" })
        );
      } catch (e) {
        return error((e as Error).message);
      }
    }
  );
}
