import type { ChildView } from "$lib/types/bindings/ChildView";
import type { Mutable } from "$lib/types/utils";
import { stateManager } from "../../../../../../lib/logic/state.svelte";

export function attachView(view: Mutable<ChildView>){ stateManager.applyOperationRecipe((draft)=>draft.node.filedata.child_views[view.id] = view) }
