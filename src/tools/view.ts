/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP View Tools
 * 
 * This module defines view-related tools including creating, updating,
 * retrieving, and deleting views. Views can be created at workspace, 
 * space, folder, or list levels.
 */

import { 
  CreateViewData, 
  UpdateViewData,
  ClickUpView,
  ViewType
} from '../services/clickup/types.js';
import { viewService, workspaceService } from '../services/shared.js';
import config from '../config.js';
import { sponsorService } from '../utils/sponsor-service.js';

/**
 * Tool definition for creating a view
 */
export const createViewTool = {
  name: "create_view",
  description: `Creates a new view in ClickUp at workspace, space, folder, or list level. Requires name, type, and parent info. Supports filters, grouping, sorting, and custom settings for different view types.`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the view"
      },
      type: {
        type: "string",
        enum: ["list", "board", "calendar", "table", "timeline", "workload", "activity", "map", "chat", "gantt"],
        description: "Type of view to create"
      },
      parentType: {
        type: "string",
        enum: ["team", "space", "folder", "list"],
        description: "Type of parent container for the view"
      },
      parentId: {
        type: "string",
        description: "ID of the parent (workspace/space/folder/list). For workspace level, this can be omitted."
      },
      parentName: {
        type: "string",
        description: "Name of the parent. Alternative to parentId for space/folder/list."
      },
      groupBy: {
        type: "string",
        description: "Field to group tasks by (e.g., 'status', 'assignee', 'priority')"
      },
      groupDirection: {
        type: "number",
        enum: [1, -1],
        description: "Sort direction for groups: 1 for ascending, -1 for descending"
      },
      filters: {
        type: "object",
        description: "Filter configuration for the view",
        properties: {
          operator: {
            type: "string",
            enum: ["AND", "OR"],
            description: "Logical operator for combining filters"
          },
          conditions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: {
                  type: "string",
                  description: "Field to filter by"
                },
                operator: {
                  type: "string",
                  description: "Comparison operator (e.g., 'equals', 'contains', 'greater_than')"
                },
                value: {
                  description: "Value to compare against"
                }
              }
            }
          }
        }
      },
      columns: {
        type: "array",
        description: "Columns to display (for table/board views)",
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              description: "Field name for the column"
            },
            type: {
              type: "string",
              description: "Column type"
            }
          }
        }
      },
      settings: {
        type: "object",
        description: "View-specific settings",
        properties: {
          showTaskLocations: {
            type: "boolean",
            description: "Show task locations in the view"
          },
          showSubtasks: {
            type: "number",
            description: "Number of subtask levels to show"
          },
          showAssignees: {
            type: "boolean",
            description: "Show assignees in the view"
          },
          showImages: {
            type: "boolean",
            description: "Show images in the view"
          },
          meMode: {
            type: "boolean",
            description: "Show only tasks assigned to current user"
          }
        }
      }
    },
    required: ["name", "type", "parentType"]
  }
};

/**
 * Tool definition for getting views
 */
export const getViewsTool = {
  name: "get_views",
  description: `Gets all views from a workspace, space, folder, or list. Use parentType and parentId/parentName to specify location.`,
  inputSchema: {
    type: "object",
    properties: {
      parentType: {
        type: "string",
        enum: ["team", "space", "folder", "list"],
        description: "Type of parent container"
      },
      parentId: {
        type: "string",
        description: "ID of the parent. For workspace level, this can be omitted."
      },
      parentName: {
        type: "string",
        description: "Name of the parent. Alternative to parentId for space/folder/list."
      }
    },
    required: ["parentType"]
  }
};

/**
 * Tool definition for getting a single view
 */
export const getViewTool = {
  name: "get_view",
  description: `Gets details of a specific view by ID or name. Use viewId (preferred) or viewName with parent info.`,
  inputSchema: {
    type: "object",
    properties: {
      viewId: {
        type: "string",
        description: "ID of the view to retrieve"
      },
      viewName: {
        type: "string",
        description: "Name of the view. Requires parent info to locate."
      },
      parentType: {
        type: "string",
        enum: ["team", "space", "folder", "list"],
        description: "Type of parent (required when using viewName)"
      },
      parentId: {
        type: "string",
        description: "ID of parent (required when using viewName)"
      },
      parentName: {
        type: "string",
        description: "Name of parent (alternative to parentId when using viewName)"
      }
    },
    required: []
  }
};

/**
 * Tool definition for updating a view
 */
export const updateViewTool = {
  name: "update_view",
  description: `Updates an existing view. Can modify name, filters, grouping, sorting, columns, and settings.`,
  inputSchema: {
    type: "object",
    properties: {
      viewId: {
        type: "string",
        description: "ID of the view to update"
      },
      viewName: {
        type: "string",
        description: "Name of the view. Requires parent info to locate."
      },
      parentType: {
        type: "string",
        enum: ["team", "space", "folder", "list"],
        description: "Type of parent (required when using viewName)"
      },
      parentId: {
        type: "string",
        description: "ID of parent (required when using viewName)"
      },
      parentName: {
        type: "string",
        description: "Name of parent (alternative to parentId when using viewName)"
      },
      name: {
        type: "string",
        description: "New name for the view"
      },
      groupBy: {
        type: "string",
        description: "Field to group tasks by"
      },
      groupDirection: {
        type: "number",
        enum: [1, -1],
        description: "Sort direction for groups"
      },
      filters: {
        type: "object",
        description: "New filter configuration"
      },
      columns: {
        type: "array",
        description: "New column configuration"
      },
      settings: {
        type: "object",
        description: "New view settings"
      }
    },
    required: []
  }
};

/**
 * Tool definition for deleting a view
 */
export const deleteViewTool = {
  name: "delete_view",
  description: `PERMANENTLY deletes a view. Use viewId (preferred) or viewName with parent info. WARNING: Cannot be undone.`,
  inputSchema: {
    type: "object",
    properties: {
      viewId: {
        type: "string",
        description: "ID of the view to delete"
      },
      viewName: {
        type: "string",
        description: "Name of the view. Requires parent info to locate."
      },
      parentType: {
        type: "string",
        enum: ["team", "space", "folder", "list"],
        description: "Type of parent (required when using viewName)"
      },
      parentId: {
        type: "string",
        description: "ID of parent (required when using viewName)"
      },
      parentName: {
        type: "string",
        description: "Name of parent (alternative to parentId when using viewName)"
      }
    },
    required: []
  }
};

/**
 * Tool definition for getting tasks from a view
 */
export const getViewTasksTool = {
  name: "get_view_tasks",
  description: `Gets all tasks displayed in a specific view with the view's filters and sorting applied.`,
  inputSchema: {
    type: "object",
    properties: {
      viewId: {
        type: "string",
        description: "ID of the view"
      },
      viewName: {
        type: "string",
        description: "Name of the view. Requires parent info to locate."
      },
      parentType: {
        type: "string",
        enum: ["team", "space", "folder", "list"],
        description: "Type of parent (required when using viewName)"
      },
      parentId: {
        type: "string",
        description: "ID of parent (required when using viewName)"
      },
      parentName: {
        type: "string",
        description: "Name of parent (alternative to parentId when using viewName)"
      },
      page: {
        type: "number",
        description: "Page number (0-based) for pagination"
      }
    },
    required: []
  }
};

/**
 * Helper function to resolve parent ID
 */
async function resolveParentId(parentType: string, parentId?: string, parentName?: string): Promise<string> {
  if (parentType === 'team') {
    return config.clickupTeamId;
  }

  if (parentId) {
    return parentId;
  }

  if (!parentName) {
    throw new Error(`Either parentId or parentName must be provided for ${parentType}`);
  }

  // Resolve name to ID based on type
  switch (parentType) {
    case 'space': {
      const spaceId = await workspaceService.findSpaceIDByName(parentName);
      if (!spaceId) {
        throw new Error(`Space "${parentName}" not found`);
      }
      return spaceId;
    }
    case 'folder': {
      const hierarchy = await workspaceService.getWorkspaceHierarchy();
      const folderInfo = workspaceService.findIDByNameInHierarchy(hierarchy, parentName, 'folder');
      if (!folderInfo) {
        throw new Error(`Folder "${parentName}" not found`);
      }
      return folderInfo.id;
    }
    case 'list': {
      const hierarchy = await workspaceService.getWorkspaceHierarchy();
      const listInfo = workspaceService.findIDByNameInHierarchy(hierarchy, parentName, 'list');
      if (!listInfo) {
        throw new Error(`List "${parentName}" not found`);
      }
      return listInfo.id;
    }
    default:
      throw new Error(`Invalid parent type: ${parentType}`);
  }
}

/**
 * Helper function to find view by name
 */
async function findViewByName(parentType: string, parentId: string, viewName: string): Promise<ClickUpView | null> {
  return await viewService.findViewByName(parentId, parentType as any, viewName);
}

/**
 * Handler for create_view tool
 */
export async function handleCreateView(parameters: any) {
  const { 
    name, type, parentType, parentId, parentName,
    groupBy, groupDirection, filters, columns, settings 
  } = parameters;

  // Validate required fields
  if (!name || !type || !parentType) {
    throw new Error("name, type, and parentType are required");
  }

  // Resolve parent ID
  const resolvedParentId = await resolveParentId(parentType, parentId, parentName);

  // Build view data
  const viewData: CreateViewData = {
    name,
    type: type as ViewType,
    parent: {
      id: resolvedParentId,
      type: parentType as any
    }
  };

  // Add optional grouping
  if (groupBy) {
    viewData.grouping = {
      field: groupBy,
      dir: groupDirection || 1
    };
  }

  // Add optional filters
  if (filters) {
    viewData.filters = {
      op: filters.operator || 'AND',
      filters: filters.conditions?.map((c: any) => ({
        field: c.field,
        op: c.operator,
        value: c.value
      })) || []
    };
  }

  // Add optional columns
  if (columns) {
    viewData.columns = columns;
  }

  // Add optional settings
  if (settings) {
    viewData.settings = {
      show_task_locations: settings.showTaskLocations,
      show_subtasks: settings.showSubtasks,
      show_assignees: settings.showAssignees,
      show_images: settings.showImages,
      me_mode: settings.meMode
    };
  }

  try {
    const newView = await viewService.createView(viewData);
    
    return sponsorService.createResponse({
      id: newView.id,
      name: newView.name,
      type: newView.type,
      parent: newView.parent,
      message: `View "${name}" created successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to create view: ${error.message}`);
  }
}

/**
 * Handler for get_views tool
 */
export async function handleGetViews(parameters: any) {
  const { parentType, parentId, parentName } = parameters;

  if (!parentType) {
    throw new Error("parentType is required");
  }

  try {
    // Resolve parent ID
    const resolvedParentId = await resolveParentId(parentType, parentId, parentName);

    // Get views based on parent type
    let views: ClickUpView[];
    switch (parentType) {
      case 'team':
        views = await viewService.getWorkspaceViews();
        break;
      case 'space':
        views = await viewService.getSpaceViews(resolvedParentId);
        break;
      case 'folder':
        views = await viewService.getFolderViews(resolvedParentId);
        break;
      case 'list':
        views = await viewService.getListViews(resolvedParentId);
        break;
      default:
        throw new Error(`Invalid parent type: ${parentType}`);
    }

    return sponsorService.createResponse({
      views: views.map(v => ({
        id: v.id,
        name: v.name,
        type: v.type,
        creator: v.creator?.username,
        protected: v.protected
      })),
      count: views.length,
      message: `Found ${views.length} views`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to get views: ${error.message}`);
  }
}

/**
 * Handler for get_view tool
 */
export async function handleGetView(parameters: any) {
  const { viewId, viewName, parentType, parentId, parentName } = parameters;

  try {
    let view: ClickUpView;

    if (viewId) {
      view = await viewService.getView(viewId);
    } else if (viewName && parentType) {
      const resolvedParentId = await resolveParentId(parentType, parentId, parentName);
      const foundView = await findViewByName(parentType, resolvedParentId, viewName);
      if (!foundView) {
        throw new Error(`View "${viewName}" not found`);
      }
      view = foundView;
    } else {
      throw new Error("Either viewId or (viewName with parent info) must be provided");
    }

    return sponsorService.createResponse({
      id: view.id,
      name: view.name,
      type: view.type,
      parent: view.parent,
      grouping: view.grouping,
      filters: view.filters,
      columns: view.columns,
      settings: view.settings,
      creator: view.creator,
      protected: view.protected,
      message: `Retrieved view "${view.name}"`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to get view: ${error.message}`);
  }
}

/**
 * Handler for update_view tool
 */
export async function handleUpdateView(parameters: any) {
  const { 
    viewId, viewName, parentType, parentId, parentName,
    name, groupBy, groupDirection, filters, columns, settings 
  } = parameters;

  try {
    // Resolve view ID
    let targetViewId = viewId;
    if (!targetViewId && viewName && parentType) {
      const resolvedParentId = await resolveParentId(parentType, parentId, parentName);
      const foundView = await findViewByName(parentType, resolvedParentId, viewName);
      if (!foundView) {
        throw new Error(`View "${viewName}" not found`);
      }
      targetViewId = foundView.id;
    }

    if (!targetViewId) {
      throw new Error("Either viewId or (viewName with parent info) must be provided");
    }

    // Build update data
    const updateData: UpdateViewData = {};

    if (name) updateData.name = name;

    if (groupBy) {
      updateData.grouping = {
        field: groupBy,
        dir: groupDirection || 1
      };
    }

    if (filters) {
      updateData.filters = {
        op: filters.operator || 'AND',
        filters: filters.conditions?.map((c: any) => ({
          field: c.field,
          op: c.operator,
          value: c.value
        })) || []
      };
    }

    if (columns) {
      updateData.columns = columns;
    }

    if (settings) {
      updateData.settings = {
        show_task_locations: settings.showTaskLocations,
        show_subtasks: settings.showSubtasks,
        show_assignees: settings.showAssignees,
        show_images: settings.showImages,
        me_mode: settings.meMode
      };
    }

    const updatedView = await viewService.updateView(targetViewId, updateData);

    return sponsorService.createResponse({
      id: updatedView.id,
      name: updatedView.name,
      type: updatedView.type,
      message: `View "${updatedView.name}" updated successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to update view: ${error.message}`);
  }
}

/**
 * Handler for delete_view tool
 */
export async function handleDeleteView(parameters: any) {
  const { viewId, viewName, parentType, parentId, parentName } = parameters;

  try {
    // Resolve view ID
    let targetViewId = viewId;
    if (!targetViewId && viewName && parentType) {
      const resolvedParentId = await resolveParentId(parentType, parentId, parentName);
      const foundView = await findViewByName(parentType, resolvedParentId, viewName);
      if (!foundView) {
        throw new Error(`View "${viewName}" not found`);
      }
      targetViewId = foundView.id;
    }

    if (!targetViewId) {
      throw new Error("Either viewId or (viewName with parent info) must be provided");
    }

    await viewService.deleteView(targetViewId);

    return sponsorService.createResponse({
      message: `View deleted successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to delete view: ${error.message}`);
  }
}

/**
 * Handler for get_view_tasks tool
 */
export async function handleGetViewTasks(parameters: any) {
  const { viewId, viewName, parentType, parentId, parentName, page = 0 } = parameters;

  try {
    // Resolve view ID
    let targetViewId = viewId;
    if (!targetViewId && viewName && parentType) {
      const resolvedParentId = await resolveParentId(parentType, parentId, parentName);
      const foundView = await findViewByName(parentType, resolvedParentId, viewName);
      if (!foundView) {
        throw new Error(`View "${viewName}" not found`);
      }
      targetViewId = foundView.id;
    }

    if (!targetViewId) {
      throw new Error("Either viewId or (viewName with parent info) must be provided");
    }

    const result = await viewService.getViewTasks(targetViewId, page);

    return sponsorService.createResponse({
      tasks: result.tasks.map(t => ({
        id: t.id,
        name: t.name,
        status: t.status.status,
        assignees: t.assignees.map(a => a.username),
        list: t.list,
        url: t.url
      })),
      count: result.tasks.length,
      hasMore: !result.last_page,
      page: page,
      message: `Retrieved ${result.tasks.length} tasks from view`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to get view tasks: ${error.message}`);
  }
}