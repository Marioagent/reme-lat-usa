/**
 * RAGSearch1 SDK - TypeScript/JavaScript Client
 *
 * Official SDK for consuming RAGSearch1 API
 * Supports: Search, Q&A, Remittance Comparison, BCV Venezuela rates
 *
 * @author MGA
 * @version 1.0.0
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// ====================
// TYPES & INTERFACES
// ====================

export interface RAGSearch1Config {
  baseURL: string;
  apiKey?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface SearchOptions {
  query: string;
  limit?: number;
  filters?: {
    country?: string;
    type?: string;
  };
}

export interface SearchResult {
  id: string;
  document: string;
  metadata: {
    name: string;
    type: string;
    country: string;
    api_available: boolean;
    url?: string;
  };
  similarity_score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  query: string;
  filters?: Record<string, string>;
}

export interface AskOptions {
  question: string;
  context_limit?: number;
}

export interface AskResponse {
  question: string;
  answer: string;
  sources: Array<{
    name: string;
    type: string;
    country: string;
    similarity: number;
  }>;
  confidence: number;
}

export interface CompareOptions {
  from_country: string;
  to_country: string;
  amount: number;
  currency?: string;
}

export interface RemittanceOption {
  id: string;
  name: string;
  type: string;
  country: string;
  similarity_score: number;
  metadata: Record<string, any>;
}

export interface CompareResponse {
  from_country: string;
  to_country: string;
  amount: number;
  currency: string;
  options: RemittanceOption[];
  comparison: string;
  sources: Array<Record<string, any>>;
  total_found: number;
}

export interface BCVRates {
  bcv_oficial: number;
  paralelo: number;
  binance_p2p: number;
  sources: {
    bcv: {
      rate: number;
      source: string;
      confidence: string;
    };
    paralelo: {
      rate: number;
      source: string;
      confidence: string;
    };
    binance_p2p: {
      rate: number;
      source: string;
      confidence: string;
    };
  };
  validation: {
    bcvParaleloDiff: number;
    binanceParaleloDiff: number;
    alert: string | null;
  };
  last_updated: string;
  timestamp: number;
}

export interface CollectionStats {
  name: string;
  count: number;
  metadata: Record<string, any>;
}

// ====================
// MAIN SDK CLASS
// ====================

export class RAGSearch1Client {
  private client: AxiosInstance;
  private config: RAGSearch1Config;

  constructor(config: RAGSearch1Config) {
    this.config = {
      timeout: 30000,
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      }
    });
  }

  // ====================
  // SEARCH METHODS
  // ====================

  /**
   * Search for financial institutions
   * @param options Search options
   * @returns Search results
   */
  async search(options: SearchOptions): Promise<SearchResponse> {
    try {
      const response = await this.client.post<SearchResponse>('/api/v1/search', {
        query: options.query,
        limit: options.limit || 10,
        filters: options.filters
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Search failed');
    }
  }

  /**
   * Ask a natural language question
   * @param options Question options
   * @returns Answer with sources
   */
  async ask(options: AskOptions): Promise<AskResponse> {
    try {
      const response = await this.client.post<AskResponse>('/api/v1/ask', {
        question: options.question,
        context_limit: options.context_limit || 5
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Ask failed');
    }
  }

  /**
   * Get entity by ID
   * @param entityId Entity ID
   * @returns Entity details
   */
  async getEntity(entityId: string): Promise<SearchResult> {
    try {
      const response = await this.client.get<SearchResult>(`/api/v1/entity/${entityId}`);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Get entity failed');
    }
  }

  /**
   * Get entities by country
   * @param countryCode Country code (e.g., 'VE', 'US')
   * @param limit Maximum results
   * @returns List of entities
   */
  async getEntitiesByCountry(countryCode: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const response = await this.client.get<{ entities: SearchResult[] }>(
        `/api/v1/entities/country/${countryCode}?limit=${limit}`
      );
      return response.data.entities;
    } catch (error: any) {
      throw this.handleError(error, 'Get entities by country failed');
    }
  }

  /**
   * Get entities by type
   * @param entityType Entity type (bank, exchange, fintech, etc.)
   * @param limit Maximum results
   * @returns List of entities
   */
  async getEntitiesByType(entityType: string, limit: number = 20): Promise<SearchResult[]> {
    try {
      const response = await this.client.get<{ entities: SearchResult[] }>(
        `/api/v1/entities/type/${entityType}?limit=${limit}`
      );
      return response.data.entities;
    } catch (error: any) {
      throw this.handleError(error, 'Get entities by type failed');
    }
  }

  // ====================
  // COMPARISON METHODS
  // ====================

  /**
   * Compare remittance options
   * @param options Comparison options
   * @returns Comparison results with recommendations
   */
  async compareRemittance(options: CompareOptions): Promise<CompareResponse> {
    try {
      const response = await this.client.post<CompareResponse>('/api/v1/compare', {
        from_country: options.from_country,
        to_country: options.to_country,
        amount: options.amount,
        currency: options.currency || 'USD'
      });

      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Comparison failed');
    }
  }

  /**
   * Get list of supported countries
   * @returns List of countries
   */
  async getSupportedCountries(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await this.client.get<{ countries: Array<{ code: string; name: string }> }>(
        '/api/v1/compare/countries'
      );
      return response.data.countries;
    } catch (error: any) {
      throw this.handleError(error, 'Get countries failed');
    }
  }

  // ====================
  // BCV VENEZUELA METHODS
  // ====================

  /**
   * Get real-time Venezuela exchange rates
   * @returns BCV rates
   */
  async getBCVRates(): Promise<BCVRates> {
    try {
      const response = await this.client.get<BCVRates>('/api/v1/bcv/rates');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Get BCV rates failed');
    }
  }

  /**
   * Get Venezuela financial entities
   * @returns List of Venezuelan entities
   */
  async getVenezuelaEntities(): Promise<any> {
    try {
      const response = await this.client.get('/api/v1/bcv/entities');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Get Venezuela entities failed');
    }
  }

  // ====================
  // ADMIN METHODS
  // ====================

  /**
   * Get collection statistics
   * @returns Database stats
   */
  async getStats(): Promise<CollectionStats> {
    try {
      const response = await this.client.get<CollectionStats>('/api/v1/admin/stats');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Get stats failed');
    }
  }

  /**
   * Trigger data collection manually
   * @returns Status
   */
  async triggerCollection(): Promise<{ message: string; status: string }> {
    try {
      const response = await this.client.post('/api/v1/admin/collection/run');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Trigger collection failed');
    }
  }

  /**
   * Check API health
   * @returns Health status
   */
  async healthCheck(): Promise<{ status: string; app: string; version: string }> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error: any) {
      throw this.handleError(error, 'Health check failed');
    }
  }

  // ====================
  // UTILITY METHODS
  // ====================

  private handleError(error: any, message: string): Error {
    if (error.response) {
      // Server responded with error
      return new Error(
        `${message}: ${error.response.data.detail || error.response.data.error || error.response.statusText}`
      );
    } else if (error.request) {
      // No response received
      return new Error(`${message}: No response from server`);
    } else {
      // Request setup error
      return new Error(`${message}: ${error.message}`);
    }
  }

  /**
   * Update client configuration
   * @param config Partial configuration to update
   */
  updateConfig(config: Partial<RAGSearch1Config>): void {
    this.config = { ...this.config, ...config };

    // Recreate client with new config
    this.client = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...(this.config.apiKey && { 'Authorization': `Bearer ${this.config.apiKey}` })
      }
    });
  }
}

// ====================
// CONVENIENCE EXPORT
// ====================

export default RAGSearch1Client;
