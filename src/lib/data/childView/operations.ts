import type { ChildView } from "$lib/bindings";
import { stateManager } from "$lib/logic/state.svelte";
import type { Mutable } from "$lib/types/utils";


export function attachView(view: Mutable<ChildView>) { stateManager.applyOperationRecipe((draft) => draft.branch.ui_components[view.id] = view); }
