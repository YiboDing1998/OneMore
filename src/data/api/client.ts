/**
 * HTTP 客户端 - 数据访问层
 * 所有 API 请求都通过这个统一的客户端
 */

import { config } from '../../core/config/environment';
import { logger } from '../../core/utils/logger';
import { AppError } from '../../core/types';
import { ERROR_CODES, HTTP_STATUS } from '../../core/constants';

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  /**
   * 设置授权令牌
   */
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * 清除授权令牌
   */
  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.request<T>('GET', url);
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }

  /**
   * 执行请求
   */
  private async request<T>(
    method: string,
    endpoint: string,
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      logger.debug(`API Request: ${method} ${url}`);

      const response = await fetch(url, {
        method,
        headers: this.headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(this.timeout),
      });

      const data = await response.json();

      if (!response.ok) {
        throw this.handleError(response.status, data);
      }

      logger.debug(`API Response: ${method} ${url}`, data);
      return data as T;
    } catch (error) {
      logger.error(`API Error: ${method} ${url}`, error);
      throw error;
    }
  }

  /**
   * 处理 API 错误
   */
  private handleError(status: number, data: any): AppError {
    const message = data?.message || 'Unknown error occurred';

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        return new AppError(ERROR_CODES.VALIDATION_ERROR, message, status);

      case HTTP_STATUS.UNAUTHORIZED:
        return new AppError(ERROR_CODES.UNAUTHORIZED, message, status);

      case HTTP_STATUS.NOT_FOUND:
        return new AppError(ERROR_CODES.NOT_FOUND, message, status);

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        return new AppError(ERROR_CODES.SERVER_ERROR, message, status);

      default:
        return new AppError(ERROR_CODES.UNKNOWN_ERROR, message, status);
    }
  }

  /**
   * 构建 URL（包含查询参数）
   */
  private buildUrl(endpoint: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return endpoint;
    }

    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        queryString.append(key, String(value));
      }
    });

    return `${endpoint}?${queryString.toString()}`;
  }
}

// 导出单例
export const apiClient = new ApiClient();
