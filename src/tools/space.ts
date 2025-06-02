/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp MCP Space Tools
 * 
 * This module defines space-related tools including creating, updating,
 * and deleting spaces in the workspace.
 */

import { 
  CreateSpaceData, 
  UpdateSpaceData,
  ClickUpSpace
} from '../services/clickup/types.js';
import { workspaceService } from '../services/shared.js';
import config from '../config.js';
import { sponsorService } from '../utils/sponsor-service.js';
import { processColorCommand } from '../utils/color-processor.js';

/**
 * Tool definition for creating a space
 */
export const createSpaceTool = {
  name: "create_space",
  description: `Creates a new space in your ClickUp workspace. Configure features like due dates, time tracking, tags, etc. Supports natural language colors (e.g., "dark blue", "light green").`,
  inputSchema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the space"
      },
      color: {
        type: "string",
        description: "Space color (hex code or natural language like 'dark blue')"
      },
      private: {
        type: "boolean",
        description: "Whether the space should be private"
      },
      multipleAssignees: {
        type: "boolean",
        description: "Allow multiple assignees on tasks"
      },
      features: {
        type: "object",
        description: "Feature configuration for the space",
        properties: {
          dueDates: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable due dates"
              },
              startDate: {
                type: "boolean",
                description: "Enable start dates"
              },
              remapDueDates: {
                type: "boolean",
                description: "Remap due dates on status change"
              },
              remapClosedDueDate: {
                type: "boolean",
                description: "Remap due dates when closing tasks"
              }
            }
          },
          timeTracking: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable time tracking"
              }
            }
          },
          tags: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable tags"
              }
            }
          },
          timeEstimates: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable time estimates"
              }
            }
          },
          checklists: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable checklists"
              }
            }
          },
          customFields: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable custom fields"
              }
            }
          },
          remapDependencies: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable dependency remapping"
              }
            }
          },
          dependencyWarning: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable dependency warnings"
              }
            }
          },
          portfolios: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean",
                description: "Enable portfolios"
              }
            }
          }
        }
      }
    },
    required: ["name"]
  }
};

/**
 * Tool definition for getting a single space
 */
export const getSpaceTool = {
  name: "get_space",
  description: `Gets details of a specific space by ID or name.`,
  inputSchema: {
    type: "object",
    properties: {
      spaceId: {
        type: "string",
        description: "ID of the space to retrieve"
      },
      spaceName: {
        type: "string",
        description: "Name of the space (alternative to spaceId)"
      }
    },
    required: []
  }
};

/**
 * Tool definition for updating a space
 */
export const updateSpaceTool = {
  name: "update_space",
  description: `Updates an existing space. Can modify name, color, privacy, and feature settings. Supports natural language colors.`,
  inputSchema: {
    type: "object",
    properties: {
      spaceId: {
        type: "string",
        description: "ID of the space to update"
      },
      spaceName: {
        type: "string",
        description: "Name of the space (alternative to spaceId)"
      },
      name: {
        type: "string",
        description: "New name for the space"
      },
      color: {
        type: "string",
        description: "New color (hex code or natural language)"
      },
      private: {
        type: "boolean",
        description: "Whether the space should be private"
      },
      adminCanManage: {
        type: "boolean",
        description: "Whether admins can manage the space"
      },
      multipleAssignees: {
        type: "boolean",
        description: "Allow multiple assignees on tasks"
      },
      features: {
        type: "object",
        description: "Feature configuration updates",
        properties: {
          dueDates: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              },
              startDate: {
                type: "boolean"
              },
              remapDueDates: {
                type: "boolean"
              },
              remapClosedDueDate: {
                type: "boolean"
              }
            }
          },
          timeTracking: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          tags: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          timeEstimates: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          checklists: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          customFields: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          remapDependencies: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          dependencyWarning: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          },
          portfolios: {
            type: "object",
            properties: {
              enabled: {
                type: "boolean"
              }
            }
          }
        }
      }
    },
    required: []
  }
};

/**
 * Tool definition for deleting a space
 */
export const deleteSpaceTool = {
  name: "delete_space",
  description: `PERMANENTLY deletes a space and all its contents. Use with extreme caution. This action cannot be undone.`,
  inputSchema: {
    type: "object",
    properties: {
      spaceId: {
        type: "string",
        description: "ID of the space to delete"
      },
      spaceName: {
        type: "string",
        description: "Name of the space (alternative to spaceId)"
      }
    },
    required: []
  }
};

/**
 * Helper function to convert tool features format to API format
 */
function convertFeaturesToAPI(features: any): any {
  if (!features) return undefined;
  
  const apiFeatures: any = {};
  
  if (features.dueDates) {
    apiFeatures.due_dates = {
      enabled: features.dueDates.enabled,
      start_date: features.dueDates.startDate,
      remap_due_dates: features.dueDates.remapDueDates,
      remap_closed_due_date: features.dueDates.remapClosedDueDate
    };
  }
  
  if (features.timeTracking) {
    apiFeatures.time_tracking = features.timeTracking;
  }
  
  if (features.tags) {
    apiFeatures.tags = features.tags;
  }
  
  if (features.timeEstimates) {
    apiFeatures.time_estimates = features.timeEstimates;
  }
  
  if (features.checklists) {
    apiFeatures.checklists = features.checklists;
  }
  
  if (features.customFields) {
    apiFeatures.custom_fields = features.customFields;
  }
  
  if (features.remapDependencies) {
    apiFeatures.remap_dependencies = features.remapDependencies;
  }
  
  if (features.dependencyWarning) {
    apiFeatures.dependency_warning = features.dependencyWarning;
  }
  
  if (features.portfolios) {
    apiFeatures.portfolios = features.portfolios;
  }
  
  return Object.keys(apiFeatures).length > 0 ? apiFeatures : undefined;
}

/**
 * Handler for create_space tool
 */
export async function handleCreateSpace(parameters: any) {
  const { name, color, private: isPrivate, multipleAssignees, features } = parameters;
  
  // Validate required fields
  if (!name) {
    throw new Error("Space name is required");
  }
  
  // Build space data
  const spaceData: CreateSpaceData = {
    name,
    multiple_assignees: multipleAssignees
  };
  
  // Add features if provided
  const apiFeatures = convertFeaturesToAPI(features);
  if (apiFeatures) {
    spaceData.features = apiFeatures;
  }
  
  try {
    const newSpace = await workspaceService.createSpace(spaceData);
    
    // Get the created space to check its actual state
    let finalSpace = newSpace;
    
    // Update the space with additional properties
    const updateData: UpdateSpaceData = {};
    
    // Check if name was properly set, if not, update it
    if (!newSpace.name || newSpace.name !== name) {
      updateData.name = name;
    }
    
    // Add color if specified
    if (color) {
      const colorResult = processColorCommand(color);
      const colorHex = colorResult ? colorResult.background : color;
      updateData.color = colorHex;
    }
    
    // Add privacy setting if specified
    if (isPrivate !== undefined) {
      updateData.private = isPrivate;
    }
    
    // Perform the update if we have any data to update
    if (Object.keys(updateData).length > 0) {
      finalSpace = await workspaceService.updateSpace(newSpace.id, updateData);
    }
    
    // Get the final space details to ensure we have the correct name
    if (!finalSpace.name || finalSpace.name !== name) {
      finalSpace = await workspaceService.getSpace(finalSpace.id);
    }
    
    return sponsorService.createResponse({
      id: finalSpace.id,
      name: finalSpace.name || name,
      private: finalSpace.private,
      features: finalSpace.features,
      url: `https://app.clickup.com/${config.clickupTeamId}/v/s/${finalSpace.id}`,
      message: `Space "${finalSpace.name || name}" created successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to create space: ${error.message}`);
  }
}

/**
 * Handler for get_space tool
 */
export async function handleGetSpace(parameters: any) {
  const { spaceId, spaceName } = parameters;
  
  try {
    let space: ClickUpSpace;
    
    if (spaceId) {
      space = await workspaceService.getSpace(spaceId);
    } else if (spaceName) {
      const foundSpace = await workspaceService.findSpaceByName(spaceName);
      if (!foundSpace) {
        throw new Error(`Space "${spaceName}" not found`);
      }
      space = foundSpace;
    } else {
      throw new Error("Either spaceId or spaceName must be provided");
    }
    
    return sponsorService.createResponse({
      id: space.id,
      name: space.name,
      private: space.private,
      multiple_assignees: space.multiple_assignees,
      features: space.features,
      archived: space.archived,
      statuses: space.statuses,
      url: `https://app.clickup.com/${config.clickupTeamId}/v/s/${space.id}`,
      message: `Retrieved space "${space.name}"`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to get space: ${error.message}`);
  }
}

/**
 * Handler for update_space tool
 */
export async function handleUpdateSpace(parameters: any) {
  const { 
    spaceId, spaceName, name, color, 
    private: isPrivate, adminCanManage, multipleAssignees, features 
  } = parameters;
  
  try {
    // Resolve space ID
    let targetSpaceId = spaceId;
    if (!targetSpaceId && spaceName) {
      const foundSpace = await workspaceService.findSpaceByName(spaceName);
      if (!foundSpace) {
        throw new Error(`Space "${spaceName}" not found`);
      }
      targetSpaceId = foundSpace.id;
    }
    
    if (!targetSpaceId) {
      throw new Error("Either spaceId or spaceName must be provided");
    }
    
    // Build update data
    const updateData: UpdateSpaceData = {};
    
    if (name) updateData.name = name;
    if (color) {
      const colorResult = processColorCommand(color);
      updateData.color = colorResult ? colorResult.background : color;
    }
    if (isPrivate !== undefined) updateData.private = isPrivate;
    if (adminCanManage !== undefined) updateData.admin_can_manage = adminCanManage;
    if (multipleAssignees !== undefined) updateData.multiple_assignees = multipleAssignees;
    
    // Add features if provided
    const apiFeatures = convertFeaturesToAPI(features);
    if (apiFeatures) {
      updateData.features = apiFeatures;
    }
    
    const updatedSpace = await workspaceService.updateSpace(targetSpaceId, updateData);
    
    return sponsorService.createResponse({
      id: updatedSpace.id,
      name: updatedSpace.name,
      private: updatedSpace.private,
      message: `Space "${updatedSpace.name}" updated successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to update space: ${error.message}`);
  }
}

/**
 * Handler for delete_space tool
 */
export async function handleDeleteSpace(parameters: any) {
  const { spaceId, spaceName } = parameters;
  
  try {
    // Resolve space ID
    let targetSpaceId = spaceId;
    let targetSpaceName = spaceName;
    
    if (!targetSpaceId && spaceName) {
      const foundSpace = await workspaceService.findSpaceByName(spaceName);
      if (!foundSpace) {
        throw new Error(`Space "${spaceName}" not found`);
      }
      targetSpaceId = foundSpace.id;
      targetSpaceName = foundSpace.name;
    } else if (targetSpaceId && !targetSpaceName) {
      // Get space name for confirmation message
      const space = await workspaceService.getSpace(targetSpaceId);
      targetSpaceName = space.name;
    }
    
    if (!targetSpaceId) {
      throw new Error("Either spaceId or spaceName must be provided");
    }
    
    await workspaceService.deleteSpace(targetSpaceId);
    
    return sponsorService.createResponse({
      message: `Space "${targetSpaceName}" deleted successfully`
    }, true);
  } catch (error: any) {
    return sponsorService.createErrorResponse(`Failed to delete space: ${error.message}`);
  }
}