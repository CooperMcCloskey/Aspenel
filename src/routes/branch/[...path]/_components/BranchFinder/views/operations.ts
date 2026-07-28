import type { ChildView } from "$lib/bindings";
import type { Mutable } from "$lib/types/utils";
import { stateManager } from "../../../../../../lib/logic/state.svelte";

export function attachView(view: Mutable<ChildView>){ stateManager.applyOperationRecipe((draft)=>draft.branch.ui_components[view.id] = view) }
