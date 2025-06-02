# ClickUp Space Management

This document describes the space management functionality available in the ClickUp MCP Server.

## Overview

Spaces are the primary organizational containers in ClickUp workspaces. With the MCP server, you can now create, update, retrieve, and delete spaces programmatically.

## Space Tools

### 1. Create Space (`create_space`)

Creates a new space in your ClickUp workspace with customizable features.

**Parameters:**
- `name` (required): Name of the space
- `color`: Space color (hex code or natural language like "dark blue")
- `private`: Whether the space should be private
- `multipleAssignees`: Allow multiple assignees on tasks
- `features`: Feature configuration object
  - `dueDates`: Due date settings
  - `timeTracking`: Time tracking settings
  - `tags`: Tag settings
  - `timeEstimates`: Time estimate settings
  - `checklists`: Checklist settings
  - `customFields`: Custom field settings
  - `remapDependencies`: Dependency remapping settings
  - `dependencyWarning`: Dependency warning settings
  - `portfolios`: Portfolio settings

**Example:**
```json
{
  "name": "Product Development",
  "color": "dark blue",
  "private": false,
  "multipleAssignees": true,
  "features": {
    "dueDates": {
      "enabled": true,
      "startDate": true,
      "remapDueDates": true,
      "remapClosedDueDate": false
    },
    "timeTracking": {
      "enabled": true
    },
    "tags": {
      "enabled": true
    },
    "customFields": {
      "enabled": true
    }
  }
}
```

### 2. Get Space (`get_space`)

Retrieves details of a specific space.

**Parameters:**
- `spaceId`: ID of the space
- `spaceName`: Name of the space (alternative to spaceId)

**Example:**
```json
{
  "spaceName": "Product Development"
}
```

### 3. Update Space (`update_space`)

Updates an existing space's properties and features.

**Parameters:**
- `spaceId`: ID of the space to update
- `spaceName`: Name of the space (alternative to spaceId)
- `name`: New name for the space
- `color`: New color (hex or natural language)
- `private`: Update privacy setting
- `adminCanManage`: Whether admins can manage the space
- `multipleAssignees`: Update multiple assignee setting
- `features`: Update feature configuration

**Example:**
```json
{
  "spaceName": "Product Development",
  "name": "Product & Engineering",
  "color": "purple",
  "features": {
    "timeEstimates": {
      "enabled": true
    }
  }
}
```

### 4. Delete Space (`delete_space`)

Permanently deletes a space and all its contents.

**⚠️ WARNING**: This action cannot be undone. All folders, lists, and tasks within the space will be permanently deleted.

**Parameters:**
- `spaceId`: ID of the space to delete
- `spaceName`: Name of the space (alternative to spaceId)

**Example:**
```json
{
  "spaceName": "Old Project Space"
}
```

## Feature Configuration

When creating or updating spaces, you can configure various features:

### Due Dates
```json
{
  "dueDates": {
    "enabled": true,
    "startDate": true,
    "remapDueDates": true,
    "remapClosedDueDate": false
  }
}
```

### Time Tracking
```json
{
  "timeTracking": {
    "enabled": true
  }
}
```

### Tags
```json
{
  "tags": {
    "enabled": true
  }
}
```

### Custom Fields
```json
{
  "customFields": {
    "enabled": true
  }
}
```

## Color Support

The space tools support both hex color codes and natural language color names:

- Hex codes: `#FF0000`, `#00FF00`, `#0000FF`
- Natural language: `red`, `dark blue`, `light green`, `purple`

The color processor automatically converts natural language colors to appropriate hex values.

## Use Cases

### 1. Setting Up a New Project

```json
{
  "tool": "create_space",
  "arguments": {
    "name": "Q1 2025 Projects",
    "color": "green",
    "multipleAssignees": true,
    "features": {
      "dueDates": {
        "enabled": true,
        "startDate": true
      },
      "timeTracking": {
        "enabled": true
      },
      "tags": {
        "enabled": true
      }
    }
  }
}
```

### 2. Converting a Public Space to Private

```json
{
  "tool": "update_space",
  "arguments": {
    "spaceName": "HR Documents",
    "private": true
  }
}
```

### 3. Enabling Additional Features

```json
{
  "tool": "update_space",
  "arguments": {
    "spaceName": "Development",
    "features": {
      "timeEstimates": {
        "enabled": true
      },
      "customFields": {
        "enabled": true
      }
    }
  }
}
```

## Best Practices

1. **Space Naming**: Use clear, descriptive names that indicate the space's purpose
2. **Feature Planning**: Enable only the features your team needs to avoid complexity
3. **Privacy Settings**: Use private spaces for sensitive information
4. **Color Coding**: Use consistent colors across similar types of spaces
5. **Backup Before Deletion**: Always ensure you have backups before deleting spaces

## Notes

- Space creation requires appropriate permissions in your ClickUp workspace
- Some features may be limited based on your ClickUp plan
- Deleted spaces cannot be recovered - deletion is permanent
- The workspace hierarchy cache is automatically cleared when spaces are created, updated, or deleted