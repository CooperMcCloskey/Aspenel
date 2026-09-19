import type { LoadedPropertySchema } from "../../schema/types";
import type { PropertyValueValidationResult } from "../types";

export function checkNumberValue(schema: LoadedPropertySchema<"Number">, value: unknown): PropertyValueValidationResult<"Number"> {
  console.log(schema)
  console.log(value)
  if (value === "" || value === undefined) return {status: "ok", data: undefined};
  if (typeof value != "string" && typeof value != "number") return {status: "error", error: `${value} is type ${typeof value}, not number.`};
  const num = Number(value)
  if (isNaN(num) || !isFinite(num)) return {status: "error", error: "Not a number."}
  if (schema.min != null && num < schema.min) return {status: "error", error: `Value: ${num} exceeds the property minimum of: ${schema.min}`};
  if (schema.max != null && num > schema.max) return {status: "error", error: `Value: ${num} exceeds the property maximum of: ${schema.max}`};
  return {status: "ok", data: num};
}
