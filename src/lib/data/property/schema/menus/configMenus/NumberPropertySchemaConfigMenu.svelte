<script lang="ts">
  import type { NumberSchema } from "$lib/bindings";
  import { onCommit } from "$lib/logic/actions";
  import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";
  import type { WritableDeep } from "type-fest";
  import { getPropertySchema } from "../../data";
  import type { TypedPropertySchema } from "../../types";

  const { schema }: { schema: TypedPropertySchema<"Number"> } = $props()
</script>

<span>Minimum: </span><input 
  type="number"
  use:onCommit={(e, el)=>stateManager.applyCommand(()=>{
    const s = getPropertySchema(schema.id, "Number") as WritableDeep<NumberSchema>;
    const val = el.valueAsNumber;
    s.min = Number.isFinite(val) ? undefined : val;
  })}
>
<span>Maximum: </span><input 
  type="number"
  use:onCommit={(e, el)=>stateManager.applyCommand(()=>{
    const s = getPropertySchema(schema.id, "Number") as WritableDeep<NumberSchema>;
    const val = el.valueAsNumber;
    s.max = Number.isFinite(val) ? undefined : val;
  })}
>