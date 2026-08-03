<script lang="ts">
  import type { NumberSchema } from "$lib/bindings";
  import { onCommit } from "$lib/logic/actions";
  import { stateManager } from "$lib/logic/state.svelte";
  import type { Mutable } from "$lib/types/utils";
  import type { TypedPropertySchema } from "../../types";

  const { schema }: { schema: TypedPropertySchema<"Number"> } = $props()
</script>

<span>Minimum: </span><input 
  type="number"
  use:onCommit={(e, el)=>stateManager.applyOperationRecipe((draft)=>{
    const s = draft.branch.properties[schema.id] as Mutable<NumberSchema>;
    const val = el.valueAsNumber;
    s.min = Number.isFinite(val) ? undefined : val;
  })}
>
<span>Maximum: </span><input 
  type="number"
  use:onCommit={(e, el)=>stateManager.applyOperationRecipe((draft)=>{
    const s = draft.branch.properties[schema.id] as Mutable<NumberSchema>;
    const val = el.valueAsNumber;
    s.max = Number.isFinite(val) ? undefined : val;
  })}
>