# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Build the TypeScript project
npm run build

# Start the compiled server
npm start

# Development mode with TypeScript watch
npm run dev

# Install dependencies and build
npm install
```

## High-Level Architecture

### MCP Server Pattern
This is a Model Context Protocol (MCP) server that provides ClickUp integration. The architecture follows these key patterns:

1. **Dual Transport Modes**:
   - Stdio transport (default) - Direct JSON-RPC communication
   - SSE mode (`ENABLE_SSE=true`) - Server-Sent Events for web clients

2. **Service Layer Architecture**:
   - All ClickUp services extend `services/clickup/base.ts` which provides common API handling
   - Services are instantiated as singletons through `services/shared.ts`
   - Each service handles a specific ClickUp entity (tasks, folders, lists, etc.)

3. **Tool-Based Design**:
   - Tools are defined with JSON schemas and handler functions
   - Tools are registered in `server.ts` and organized by functionality
   - Each tool maps to specific ClickUp operations

4. **Name Resolution Pattern**:
   - Most tools accept both IDs and names for entities
   - Resolution logic in `utils/resolver-utils.ts` handles ID/name disambiguation
   - Caches results to minimize API calls

5. **Concurrency Control**:
   - Bulk operations use `p-limit` for controlled concurrent processing
   - Default concurrency limit of 5 for bulk operations

## Key Architectural Decisions

1. **Error Handling**: All errors are caught and returned as proper JSON-RPC error responses with appropriate codes
2. **Logging**: Uses a custom logger that respects JSON-RPC protocol - logs only go to stderr, never stdout
3. **Response Formatting**: Consistent response structure through `sponsor-service.ts`
4. **Configuration**: Supports both environment variables and command-line arguments
5. **Tool Organization**: Tools are grouped by entity type (task/, workspace.ts, etc.) for maintainability

## Required Setup

1. **Environment Variables**:
   - `CLICKUP_API_KEY`: Required for API authentication
   - `CLICKUP_TEAM_ID`: Required workspace identifier

2. **TypeScript Configuration**:
   - Target: ES2020
   - Module: NodeNext with ESM
   - Non-strict mode (be careful with type safety)

## Development Notes

- No automated tests exist - all testing is manual
- The project uses ESM modules (`"type": "module"` in package.json)
- Node.js version must be >= 18.0.0 and < 24.0.0
- When adding new tools, follow the existing pattern: define schema, create handler, register in server.ts

## Available Services

The following services are available:
- **Workspace**: Hierarchy management, entity resolution, and space operations
- **Task**: Task CRUD operations, comments, attachments, bulk operations
- **List**: List management within spaces and folders
- **Folder**: Folder organization
- **Tag**: Tag management across spaces
- **Time Tracking**: Time entry management
- **Document**: Document and page management
- **View**: View creation and management (list, board, calendar, table, etc.)
- **Member**: Member lookup and assignee resolution

## Space Management

The server now supports full space CRUD operations:
- Create new spaces with customizable features
- Update space settings, privacy, and colors
- Configure space features (due dates, time tracking, tags, etc.)
- Delete spaces (with caution - permanent deletion)
- Natural language color support

See `docs/space-management.md` for detailed space usage examples.

## View Management

The server supports full view management capabilities:
- Create views at workspace, space, folder, or list levels
- Support for all ClickUp view types (list, board, calendar, table, timeline, etc.)
- Configure grouping, filtering, sorting, and display settings
- Retrieve tasks with view-specific filters applied
- Update and delete existing views

See `docs/view-management.md` for detailed view usage examples.