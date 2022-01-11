import { BodyParams, PathParams, QueryParams, Req } from "@tsed/common";
import { Delete, Get, getJsonSchema, Groups, Patch, Post, Returns, Schema } from "@tsed/schema";
import { Type } from "@tsed/core";
import { DeleteResultDto, InsertResultDto, UpdateResultDto } from "../dtos/CrudResultDto";
import { ICrudService } from "../services/CrudService";
import { RouteDecorator } from "../../../core/decorators/RouteDecorator";

export declare type Constructor<T> = {
  new (...args: any[]): T;
};

export interface ICrudController<I extends ICrudService<T>, T> {
  service: I;
  create(entity: T): Promise<any>;
  find(criteria: T): Promise<any>;
  findOne(id: string, req: any): Promise<any>;
  update(id: string, entity: T): Promise<any>;
  delete(id: string): Promise<any>;
}

export function CrudController<I extends ICrudService<T>, T>
(
  entityClass: Constructor<T>
): Type<ICrudController<I, T>>
{
  const createSchema = getJsonSchema(entityClass, { groups: ["create"] });
  const updateSchema = getJsonSchema(entityClass, { groups: ["update"] });
  const readSchema = getJsonSchema(entityClass, { groups: ["read"] });
  const criteriaSchema = getJsonSchema(entityClass, { groups: ["criteria"] });
  const entitySchema = getJsonSchema(entityClass);
  
  @RouteDecorator({ authenticate: { protocol: "jwt" } , security: { name: "bearer" } })
  class CrudControllerHost<I extends ICrudService<T>, T> implements ICrudController<I, T> {
    constructor(_service: I) {
      this.service = _service;
    }
    /**
     * Interface service
     */
    public readonly service: I;
    /**
     * Inserts a given entity into the database.
     * Does not check if entity exist in the database, so query will fail if duplicate entity is being inserted.
     */
    @Post('')
    @Returns(201, InsertResultDto)
    public async create(@BodyParams() @Groups("create")  @Schema(createSchema ? createSchema : entitySchema) entity: T) {
      return await this.service.repository.insert(entity);
    }
    /**
     * Finds entities that match given criteria.
     */
    @Get('')
    @Returns(200, Array).Of(entityClass).Schema(readSchema ? readSchema : entitySchema)
    public async find(@QueryParams({ expression: "criteria", useType: entityClass, useConverter: false }) @Groups("criteria") @Schema(criteriaSchema ? criteriaSchema : entitySchema) criteria: T) {
      return await this.service.repository.find(criteria);
    }
    /**
     * Finds first entity that matches given conditions.
     */
    @Get('/:id')
    @Returns(200).Schema(readSchema ? readSchema : entitySchema)
    public async findOne(@PathParams('id') id: string, @Req() req: any) {
      return await this.service.repository.findOne(id);
    }
    /**
     * Updates entity partially. Entity can be found by a given conditions.
     * Does not check if entity exist in the database.
     */
    @Patch('/:id')
    @Returns(201, UpdateResultDto)
    public async update(@PathParams('id') id: string, @BodyParams() @Groups("update") @Schema(updateSchema ? updateSchema : entitySchema) entity: T) {
      return await this.service.repository.update(id, entity);
    }
    /**
      * Deletes entities by a given criteria.
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