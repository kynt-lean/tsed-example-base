import { BodyParams, PathParams } from "@tsed/common";
import { Type } from "@tsed/core";
import { Delete, Get, Patch, Post, Returns } from "@tsed/schema";
import { CrudDecorators } from "../decorators/CrudDecorator";
import { ICrudService } from "../services/CrudService";

export declare type Constructor<T> = {
  new (...args: any[]): T;
};

export interface ICrudController<I extends ICrudService<T>, T, C, U, D> {
  service: I;
  create(entity: C): Promise<any>;
  update(id: string, entity: U): Promise<any>;
  delete(id: string): Promise<any>;
  findOne(id: string): Promise<any>;
  find(criteria: T): Promise<any>;
  findAndCount(criteria: T): Promise<any>;
}

export function CrudController<I extends ICrudService<T>, T, C, U, D>(dtoClass: Constructor<D>): Type<ICrudController<I, T, C, U, D>> {
  @CrudDecorators()
  class CrudControllerHost<I extends ICrudService<T>, T> implements ICrudController<I, T, C, U, D> {
    constructor(_service: I) {
      this.service = _service;
    }
    /**
     * Interface service
     */
    public readonly service: I;
    /**
     * Inserts a given entity into the database.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient INSERT query.
     * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
     */
    @Post('/create')
    @Returns(201)
    public async create(@BodyParams() entity: C) {
      return await this.service.repository.insert(entity);
    }
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     */
    @Patch('/update/:id')
    @Returns(201)
    public async update(@PathParams('id') id: string, @BodyParams() entity: U) {
      return await this.service.repository.update(id, entity);
    }
    /**
      * Deletes entities by a given criteria.
      * Unlike save method executes a primitive operation without cascades, relations and other operations included.
      * Executes fast and efficient DELETE query.
      * Does not check if entity exist in the database.
      */
    @Delete('/delete/:id')
    @Returns(200)
    public async delete(@PathParams('id') id: string) {
      return await this.service.repository.delete(id);
    }
    /**
     * Finds first entity that matches given conditions.
     */
    @Get('/findOne/:id')
    @Returns(200, dtoClass)
    public async findOne(@PathParams('id') id: string) {
      return await this.service.repository.findOne(id);
    }
    /**
      * Finds entities that match given options.
      */
    @Post('/find')
    @Returns(200, dtoClass)
    public async find(@BodyParams() criteria: T) {
      return await this.service.repository.find(criteria);
    }
    /**
      * Finds entities that match given find options.
      * Also counts all entities that match given conditions,
      * but ignores pagination settings (from and take options).
      */
    @Get('/findAndCount')
    @Returns(200, dtoClass)
    public async findAndCount(@BodyParams() criteria: T) {
      return await this.service.repository.findAndCount(criteria);
    }
  }

  return CrudControllerHost;
}