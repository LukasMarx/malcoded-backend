import { Edge } from './edge.interface';

export interface Connection<T> {
  edges: Edge<T>[];
  totalCount: number;
}
