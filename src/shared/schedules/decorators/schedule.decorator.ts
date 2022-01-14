import {useDecorators} from "@tsed/core";
import {Injectable} from "@tsed/common";
import { PROVIDER_TYPE_SCHEDULE } from "../constants";

export function Schedule(): ClassDecorator {
  return useDecorators(
    Injectable({
      type: PROVIDER_TYPE_SCHEDULE
    })
  );
}
