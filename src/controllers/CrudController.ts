import { BodyParams, Intercept, PathParams, QueryParams } from "@tsed/common";
import { Delete, Get, getJsonSchema, Patch, Post, Returns, Schema } from "@tsed/schema";
import { Type } from "@tsed/core";
import { DeleteResultDto, InsertResultDto, UpdateResultDto } from "../models/dtos/CrudResultDto";
import { ICrudService } from "../services/CrudService";
import { SerializeInterceptor } from "../interceptors/SerializeInterceptor";
import { RouteDecorator } from "../decorators/RouteDecorator";

export declare type Constructor<T> = {
  new (...args: any[]): T;
};

export interface ICrudController<I extends ICrudService<T>, T, D> {
  service: I;
  create(entity: D): Promise<any>;
  find(criteria: T): Promise<any>;
  findOne(id: string): Promise<any>;
  update(id: string, entity: D): Promise<any>;
  delete(id: string): Promise<any>;
}

export function CrudController<I extends ICrudService<T>, T, D>
(
  entityClass: Constructor<T>,
  dtoClass: Constructor<D>
): Type<ICrudController<I, T, D>>
{
  const createSchema = getJsonSchema(dtoClass, { groups: ["create"] });
  const updateSchema = getJsonSchema(dtoClass, { groups: ["update"] });
  
  @RouteDecorator({ authenticate: { protocol: "jwt" } , security: { name: "bearer" } })
  class CrudControllerHost<I extends ICrudService<T>, T> implements ICrudController<I, T, D> {
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
    @Post('')
    @Returns(201, InsertResultDto)
    public async create(@BodyParams() @Schema(createSchema) entity: D) {
      return await this.service.repository.insert(entity);
    }
    /**
     * Finds entities that match given options.
     */
    @Get('')
    @Returns(200, Array).Of(dtoClass).Groups("read")
    @Intercept(SerializeInterceptor, dtoClass)
    public async find(@QueryParams({ expression: "criteria", useType: entityClass, useConverter: false }) criteria: T) {
      return await this.service.repository.find(criteria);
    }
    /**
     * Finds first entity that matches given conditions.
     */
    @Get('/:id')
    @Returns(200, dtoClass).Groups("read")
    @Intercept(SerializeInterceptor, dtoClass)
    public async findOne(@PathParams('id') id: string) {
      return await this.service.repository.findOne(id);
    }
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Unlike save method executes a primitive operation without cascades, relations and other operations included.
     * Executes fast and efficient UPDATE query.
     * Does not check if entity exist in the database.
     */
    @Patch('/:id')
    @Returns(201, UpdateResultDto)
    public async update(@PathParams('id') id: string, @BodyParams() @Schema(updateSchema) entity: D) {
      return await this.service.repository.update(id, entity);
    }
    /**
      * Deletes entities by a given criteria.
      * Unlike save method executes a primitive operation without cascades, relations and other operations included.
      * Executes fast and efficient DELETE query.
      * Does not check if entity exist in the database.
      */
    @Delete('/:id')
    @Returns(200, DeleteResultDto)
    public async delete(@PathParams('id') id: string) {
      return await this.service.repository.delete(id);
    }
  }

  return CrudControllerHost;
}