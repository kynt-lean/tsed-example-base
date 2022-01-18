import { deepClone, Type } from "@tsed/core";
import fs from "fs"
import path from "path";
import { rootDir } from "../../config";
import { randomStringGenerator } from "./random-string-generator.util";

export interface MemoryCollectionID {
  id: string;
}

function match(obj: any, predicate: any) {
  for (const [k, v] of Object.entries(predicate)) {
    if (v !== undefined && obj[k] !== v) {
      return false;
    }
  }

  return true;
}

function createInstance(model: any, obj: any = {}) {
  return Object.assign(new model(), deepClone(obj));
}

export class MemoryCollection<T extends MemoryCollectionID> {
  protected collection: T[] = [];
  protected resources: any[] = [];

  constructor(protected model: Type<T>, protected resourcesPath: string) {
    fs.readFile(path.resolve(rootDir, resourcesPath), (err, data) => {
      if (err) {
        if (err.message.includes("no such file or directory")) {
          fs.writeFile(path.resolve(rootDir, resourcesPath), "", (err) => { throw err; });
        } else {
          throw err;
        }
      }
      if (data?.toString()) {
        this.resources = JSON.parse(data.toString());
        this.mapCollection();
      }
    });
  }

  private mapCollection() {
    this.resources.forEach(item => this.collection.push(createInstance(this.model, item)));
  }

  private writeResources() {
    fs.writeFile(path.resolve(rootDir, this.resourcesPath), JSON.stringify(this.collection), (err) => {
      if (err) throw err;
    });
  }

  public create(value: Partial<T>) {
    value.id = randomStringGenerator();
    const instance = createInstance(this.model, value);

    this.collection.push(instance);
    this.writeResources();

    return instance;
  }

  public update(value: Partial<T>): T | undefined {
    const index = this.collection.findIndex((obj) => {
      return obj.id === value.id;
    });

    if (index === -1) {
      return;
    }

    this.collection[index] = Object.assign(
      createInstance(this.model, this.collection[index]),
      value
    );

    this.writeResources();

    return this.collection[index];
  }

  public findOne(predicate: Partial<T>): T | undefined {
    const item = this.collection.find((obj) => match(obj, predicate));

    return item ? createInstance(this.model, item) : undefined;
  }

  public findAll(predicate: Partial<T> = {}): T[] {
    return this
      .collection
      .filter((obj) => match(obj, predicate))
      .map((obj) => createInstance(this.model, obj));
  }

  public removeOne(predicate: Partial<T>): T | undefined {
    let removedItem: T | undefined;

    this.collection = this.collection
      .filter((obj) => {
        if (match(obj, predicate) && !removedItem) {
          removedItem = obj;
          return false;
        }

        return true;
      });

    this.writeResources();

    return removedItem;
  }

  public removeAll(predicate: Partial<T>): T[] {
    let removedItems: T[] = [];
    this.collection = this.collection.filter((obj) => {
      if (match(obj, predicate)) {
        removedItems.push(obj);
        return false;
      }

      return true;
    });

    this.writeResources();

    return removedItems;
  }
}