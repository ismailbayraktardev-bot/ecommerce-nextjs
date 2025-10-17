/**
 * API Client
 * Centralized fetch wrapper with error handling
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    field?: string;
  };
}

interface RequestOptions extends RequestInit {
  data?: unknown;
}

/**
 * Generic API request function
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { data, headers, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const json: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new ApiError(
        json.message || 'Bir hata oluştu',
        response.status,
        json.error?.code,
        json.error?.field
      );
    }

    return json.data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Ağ hatası oluştu',
      0
    );
  }
}

/**
 * API Client Methods
 */
export const apiClient = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'POST', data }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'PATCH', data }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
