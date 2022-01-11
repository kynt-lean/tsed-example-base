import { Type } from "@tsed/core";
import { Repository } from "typeorm";

export interface ICrudService<T> {
  /**
   * Custom repository of T entity
   */
  repository: Repository<T>;  
}

export function CrudService<T>(): Type<ICrudService<T>> {  
  class CrudServiceHost<T> implements ICrudService<T> {
    constructor(_repository: Repository<T>) {
      this.repository = _repository;
    }            
    public readonly repository: Repository<T>;
  }
  return CrudServiceHost;
}