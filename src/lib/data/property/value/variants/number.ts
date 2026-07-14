import type { TypedPropertySchemaData } from "../../schema/types";
import type { TypedPropertyValue } from "../types";


export function checkNumberValue(schema: TypedPropertySchemaData<"Number">, value: unknown): TypedPropertyValue<"Number"> {
  if (typeof value != "string" && typeof value != "number") throw Error(`${value} has type ${typeof value}, not number.`);
  const num = Number(value)
  if (isNaN(num) || !isFinite(num)) throw Error(`value: ${num} is not allowed.`);
  if (schema.min != null && num < schema.min) throw Error(`${num} exceeds the specified minimum of: ${schema.min}`);
  if (schema.max != null && num > schema.max) throw Error(`${num} exceeds the specified maximum of: ${schema.max}`);
  return num;
}
