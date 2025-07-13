// Re-export types from shared directory
export * from '../../shared/types';

// Additional frontend-specific types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface VaultInfo {
  name: string;
  url: string;
}

export interface VaultDetails {
  name: string;
  notes: Note[];
}

// Import the Note type to use in VaultDetails
import { Note } from '../../shared/types';
