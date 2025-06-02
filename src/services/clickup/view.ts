/**
 * SPDX-FileCopyrightText: © 2025 Talib Kareem <taazkareem@icloud.com>
 * SPDX-License-Identifier: MIT
 *
 * ClickUp View Service
 * 
 * Handles all operations related to views in ClickUp, including:
 * - Creating views (list, board, calendar, etc.)
 * - Retrieving views
 * - Updating views
 * - Deleting views
 * - Getting tasks from views
 */

import { BaseClickUpService, ErrorCode, ClickUpServiceError, ServiceResponse } from './base.js';
import { 
  ClickUpView,
  CreateViewData,
  UpdateViewData,
  ViewsResponse,
  ViewTasksResponse
} from './types.js';

export class ViewService extends BaseClickUpService {
  constructor(apiKey: string, teamId: string, baseUrl?: string) {
    super(apiKey, teamId, baseUrl);
  }

  /**
   * Helper method to handle errors consistently
   * @param error The error that occurred
   * @param message Optional custom error message
   * @returns A ClickUpServiceError
   */
  private handleError(error: any, message?: string): ClickUpServiceError {
    if (error instanceof ClickUpServiceError) {
      return error;
    }
    
    return new ClickUpServiceError(
      message || `View service error: ${error.message}`,
      ErrorCode.UNKNOWN,
      error
    );
  }

  /**
   * Create a new view
   * @param viewData The data for the new view
   * @returns The created view
   */
  async createView(viewData: CreateViewData): Promise<ClickUpView> {
    this.logOperation('createView', viewData);
    
    try {
      return await this.makeRequest(async () => {
        // Determine the endpoint based on parent type
        let endpoint: string;
        switch (viewData.parent.type) {
          case 'team':
            endpoint = `/team/${this.teamId}/view`;
            break;
          case 'space':
            endpoint = `/space/${viewData.parent.id}/view`;
            break;
          case 'folder':
            endpoint = `/folder/${viewData.parent.id}/view`;
            break;
          case 'list':
            endpoint = `/list/${viewData.parent.id}/view`;
            break;
          default:
            throw new ClickUpServiceError(
              `Invalid parent type: ${viewData.parent.type}`,
              ErrorCode.INVALID_PARAMETER
            );
        }

        const response = await this.client.post<ClickUpView>(endpoint, viewData);
        return response.data;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to create view`);
    }
  }

  /**
   * Get a view by ID
   * @param viewId The ID of the view to retrieve
   * @returns The requested view
   */
  async getView(viewId: string): Promise<ClickUpView> {
    this.logOperation('getView', { viewId });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.get<ClickUpView>(`/view/${viewId}`);
        return response.data;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to get view ${viewId}`);
    }
  }

  /**
   * Get views for a workspace
   * @returns The views in the workspace
   */
  async getWorkspaceViews(): Promise<ClickUpView[]> {
    this.logOperation('getWorkspaceViews', { teamId: this.teamId });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.get<ViewsResponse>(`/team/${this.teamId}/view`);
        return response.data.views;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to get workspace views`);
    }
  }

  /**
   * Get views for a space
   * @param spaceId The ID of the space
   * @returns The views in the space
   */
  async getSpaceViews(spaceId: string): Promise<ClickUpView[]> {
    this.logOperation('getSpaceViews', { spaceId });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.get<ViewsResponse>(`/space/${spaceId}/view`);
        return response.data.views;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to get space views`);
    }
  }

  /**
   * Get views for a folder
   * @param folderId The ID of the folder
   * @returns The views in the folder
   */
  async getFolderViews(folderId: string): Promise<ClickUpView[]> {
    this.logOperation('getFolderViews', { folderId });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.get<ViewsResponse>(`/folder/${folderId}/view`);
        return response.data.views;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to get folder views`);
    }
  }

  /**
   * Get views for a list
   * @param listId The ID of the list
   * @returns The views in the list
   */
  async getListViews(listId: string): Promise<ClickUpView[]> {
    this.logOperation('getListViews', { listId });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.get<ViewsResponse>(`/list/${listId}/view`);
        return response.data.views;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to get list views`);
    }
  }

  /**
   * Update an existing view
   * @param viewId The ID of the view to update
   * @param updateData The data to update on the view
   * @returns The updated view
   */
  async updateView(viewId: string, updateData: UpdateViewData): Promise<ClickUpView> {
    this.logOperation('updateView', { viewId, ...updateData });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.put<ClickUpView>(
          `/view/${viewId}`,
          updateData
        );
        return response.data;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to update view ${viewId}`);
    }
  }

  /**
   * Delete a view
   * @param viewId The ID of the view to delete
   * @returns Success indicator
   */
  async deleteView(viewId: string): Promise<ServiceResponse<void>> {
    this.logOperation('deleteView', { viewId });
    
    try {
      await this.makeRequest(async () => {
        await this.client.delete(`/view/${viewId}`);
      });
      
      return {
        success: true
      };
    } catch (error) {
      throw this.handleError(error, `Failed to delete view ${viewId}`);
    }
  }

  /**
   * Get tasks from a view
   * @param viewId The ID of the view
   * @param page The page number (0-based)
   * @returns The tasks in the view
   */
  async getViewTasks(viewId: string, page: number = 0): Promise<ViewTasksResponse> {
    this.logOperation('getViewTasks', { viewId, page });
    
    try {
      return await this.makeRequest(async () => {
        const response = await this.client.get<ViewTasksResponse>(
          `/view/${viewId}/task`,
          {
            params: { page }
          }
        );
        return response.data;
      });
    } catch (error) {
      throw this.handleError(error, `Failed to get tasks from view ${viewId}`);
    }
  }

  /**
   * Find a view by name within a parent
   * @param parentId The ID of the parent (workspace, space, folder, or list)
   * @param parentType The type of the parent
   * @param viewName The name of the view to find
   * @returns The found view or null
   */
  async findViewByName(
    parentId: string, 
    parentType: 'team' | 'space' | 'folder' | 'list',
    viewName: string
  ): Promise<ClickUpView | null> {
    this.logOperation('findViewByName', { parentId, parentType, viewName });
    
    try {
      let views: ClickUpView[];
      
      switch (parentType) {
        case 'team':
          views = await this.getWorkspaceViews();
          break;
        case 'space':
          views = await this.getSpaceViews(parentId);
          break;
        case 'folder':
          views = await this.getFolderViews(parentId);
          break;
        case 'list':
          views = await this.getListViews(parentId);
          break;
        default:
          throw new ClickUpServiceError(
            `Invalid parent type: ${parentType}`,
            ErrorCode.INVALID_PARAMETER
          );
      }
      
      // Find by exact name match
      return views.find(view => view.name === viewName) || null;
    } catch (error) {
      throw this.handleError(error, `Failed to find view by name: ${viewName}`);
    }
  }
}