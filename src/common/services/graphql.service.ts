import { Injectable } from '@nestjs/common';
import { Connection } from '../interfaces/connection.interface';
import { Edge } from '../interfaces/edge.interface';

@Injectable()
export class GraphqlService {
  convertArrayToConnection<T>(array: T[], totalCount: number): Connection<T> {
    const edges: Edge<T>[] = array.map(x => {
      return { node: x };
    });
    return { edges, totalCount };
  }
}
