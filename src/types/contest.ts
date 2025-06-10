export interface Contest {
  id: number;
  event: string;
  host: string;
  start: string;
  end: string;
  duration: number;
  href: string;
  problems?: number;
}

export interface UserAccount {
  id: number;
  handle: string;
  name?: string;
  country?: string;
  rating?: number;
  contests?: number;
  last_activity?: string;
  resource: {
    id: number;
    name: string;
    host: string;
  };
}

export interface ApiResponse<T> {
  meta: {
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total_count: number;
  };
  objects: T[];
}