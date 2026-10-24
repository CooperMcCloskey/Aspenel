<script lang="ts">
  import { applySchemaCommand, getPropertySchema } from "../../data";
  import type { LoadedPropertySchema } from "../../types";
  import Input from "$lib/components/input/Input.svelte";

  const { schema }: { schema: LoadedPropertySchema<"Number"> } = $props()
</script>

<span>Minimum: </span><Input 
  type="number"
  value={schema.min}
  validate={(draft)=>{
    if (draft.trim() === "") return {status: "ok", data: null};
    const min = Number(draft)
    if(schema.max && min > schema.max) return {status: "error", error: `Value exceeds the maximum of ${schema.max}`}
    return {status: "ok", data: min}
  }}
  format={(v)=>String(v ?? "")}
  submit={(v)=>applySchemaCommand<"Number">(schema.id, (s)=>{s.min = Number.isFinite(v) ? v : null})}
/>
<span>Maximum: </span><Input 
  type="number"
  value={schema.max}
  validate={(draft)=>{
    if (draft.trim() === "") return {status: "ok", data: null};
    const max = Number(draft)
    if(schema.min && max < schema.min) return {status: "error", error: `Value is less than the minimum of ${schema.min}`}
    return {status: "ok", data: max}
  }}
  format={(v)=>String(v ?? "")}
  submit={(v)=>applySchemaCommand<"Number">(schema.id, (s)=>{s.max = Number.isFinite(v) ? v : null})}
/>