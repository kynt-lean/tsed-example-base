import { Injectable } from "@tsed/common";
import { useDecorators } from "@tsed/core";
import { PROVIDER_SERVER_MICROSERVICE } from "../constants";

export function Microservice(): ClassDecorator {
  return useDecorators(
    Injectable({
      type: PROVIDER_SERVER_MICROSERVICE
    })
  );
}