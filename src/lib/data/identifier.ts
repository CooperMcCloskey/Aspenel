import type { Identifier } from "../types/rustTypes/Identifier";
import { ulid } from "ulid";

export function newIdentifier(name: string): Identifier{
  return{
    name,
    id: ulid()
  }
}