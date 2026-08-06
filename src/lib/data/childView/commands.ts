import type { ChildView } from "$lib/bindings";
import { stateManager } from "$lib/logic/stateManager/StateManager.svelte";

export function attachView(view: ChildView) { stateManager.applyCommand(()=>stateManager.tree.branch.ui_components[view.id] = view) }
