import {
    modifierSeed,
    type ModifierGroup,
    type ModifierOption,
} from "../utils/Modifierdata";

import type { MenuItem } from "./MenuItemdata";

export interface PricedOption extends ModifierOption {
    price: number;
}

export interface ItemModifierGroup {
    group: ModifierGroup;
    options: PricedOption[];
}

// Groups this item offers: a group is shown only if the item has a price
// entry for it (matched by groupId + option id).
export const getItemGroups = (item: MenuItem): ItemModifierGroup[] =>
    modifierSeed
        .filter((g) => g.status === "Active")
        .map((group) => {
            const options: PricedOption[] = [];
            for (const opt of group.options) {
                const mp = item.modifierPrices.find(
                    (p) => p.groupId === group.id && p.optionId === opt.id
                );
                if (mp) options.push({ ...opt, price: mp.price });
            }
            return { group, options };
        })
        .filter((g) => g.options.length > 0);

// Required single-choice groups start with their cheapest option selected
export const getDefaultSelection = (item: MenuItem): Record<string, string[]> => {
    const result: Record<string, string[]> = {};
    for (const { group, options } of getItemGroups(item)) {
        if (group.selection === "single" && group.required) {
            const cheapest = options.reduce((a, b) => (b.price < a.price ? b : a));
            result[group.id] = [cheapest.id];
        }
    }
    return result;
};