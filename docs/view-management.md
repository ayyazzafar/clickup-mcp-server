# ClickUp View Management

This document describes the view management functionality available in the ClickUp MCP Server.

## Overview

Views in ClickUp allow you to organize and visualize tasks in different formats. The MCP server now supports creating, updating, retrieving, and deleting views at various levels of the ClickUp hierarchy.

## Supported View Types

- `list` - List view
- `board` - Kanban board view
- `calendar` - Calendar view
- `table` - Table/spreadsheet view
- `timeline` - Timeline/Gantt view
- `workload` - Workload view
- `activity` - Activity view
- `map` - Map view
- `chat` - Chat view
- `gantt` - Gantt chart view

## View Tools

### 1. Create View (`create_view`)

Creates a new view in ClickUp at workspace, space, folder, or list level.

**Parameters:**
- `name` (required): Name of the view
- `type` (required): Type of view (see supported types above)
- `parentType` (required): Where to create the view (`team`, `space`, `folder`, `list`)
- `parentId`: ID of the parent container
- `parentName`: Name of the parent (alternative to parentId)
- `groupBy`: Field to group tasks by (e.g., 'status', 'assignee', 'priority')
- `groupDirection`: Sort direction (1 for ascending, -1 for descending)
- `filters`: Filter configuration
- `columns`: Column configuration for table/board views
- `settings`: View-specific settings

**Example:**
```json
{
  "name": "Sprint Planning Board",
  "type": "board",
  "parentType": "space",
  "parentName": "Development",
  "groupBy": "status",
  "settings": {
    "showAssignees": true,
    "showSubtasks": 1
  }
}
```

### 2. Get Views (`get_views`)

Retrieves all views from a workspace, space, folder, or list.

**Parameters:**
- `parentType` (required): Type of parent container
- `parentId`: ID of the parent
- `parentName`: Name of the parent (alternative to parentId)

**Example:**
```json
{
  "parentType": "space",
  "parentName": "Development"
}
```

### 3. Get View (`get_view`)

Gets details of a specific view.

**Parameters:**
- `viewId`: ID of the view
- `viewName`: Name of the view (requires parent info)
- `parentType`: Type of parent (required with viewName)
- `parentId`: ID of parent (required with viewName)
- `parentName`: Name of parent (alternative to parentId)

### 4. Update View (`update_view`)

Updates an existing view's configuration.

**Parameters:**
- `viewId`: ID of the view to update
- `viewName`: Name of the view (requires parent info)
- `name`: New name for the view
- `groupBy`: New grouping field
- `groupDirection`: New sort direction
- `filters`: New filter configuration
- `columns`: New column configuration
- `settings`: New view settings

### 5. Delete View (`delete_view`)

Permanently deletes a view.

**Parameters:**
- `viewId`: ID of the view to delete
- `viewName`: Name of the view (requires parent info)
- `parentType`: Type of parent (required with viewName)
- `parentId`: ID of parent (required with viewName)
- `parentName`: Name of parent (alternative to parentId)

### 6. Get View Tasks (`get_view_tasks`)

Retrieves all tasks displayed in a specific view with the view's filters and sorting applied.

**Parameters:**
- `viewId`: ID of the view
- `viewName`: Name of the view (requires parent info)
- `page`: Page number for pagination (0-based)

## Filter Configuration

Filters allow you to control which tasks appear in a view:

```json
{
  "filters": {
    "operator": "AND",
    "conditions": [
      {
        "field": "status",
        "operator": "equals",
        "value": "in progress"
      },
      {
        "field": "priority",
        "operator": "greater_than",
        "value": 2
      }
    ]
  }
}
```

## View Settings

Common view settings include:

- `showTaskLocations`: Show task locations in the view
- `showSubtasks`: Number of subtask levels to show
- `showAssignees`: Show assignees in the view
- `showImages`: Show images in the view
- `meMode`: Show only tasks assigned to current user

## Examples

### Create a Sprint Board View

```json
{
  "tool": "create_view",
  "arguments": {
    "name": "Current Sprint",
    "type": "board",
    "parentType": "list",
    "parentName": "Sprint 23",
    "groupBy": "status",
    "filters": {
      "operator": "AND",
      "conditions": [
        {
          "field": "tags",
          "operator": "contains",
          "value": "sprint-23"
        }
      ]
    },
    "settings": {
      "showAssignees": true,
      "showSubtasks": 2
    }
  }
}
```

### Get All Workspace Views

```json
{
  "tool": "get_views",
  "arguments": {
    "parentType": "team"
  }
}
```

### Update View to Group by Priority

```json
{
  "tool": "update_view",
  "arguments": {
    "viewName": "Bug Tracker",
    "parentType": "space",
    "parentName": "QA",
    "groupBy": "priority",
    "groupDirection": -1
  }
}
```

## Notes

- Views created at the workspace level (`parentType: "team"`) are accessible across all spaces
- View names should be unique within their parent container
- Some view types may have specific requirements or limitations
- The `protected` field indicates if a view is system-protected and cannot be modified