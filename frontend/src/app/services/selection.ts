
export enum SelectionType {
    Including,
    Excluding
}

export class SelectionMap<K> {
    type: SelectionType;
    items: Set<K>;

    constructor() {
        this.type = SelectionType.Including;
        this.items = new Set<K>();
    }

    get size() {
        switch (this.type) {
            case SelectionType.Including: return this.items.size;
            case SelectionType.Excluding: return Infinity;
        }
    }

    get allSelected() {
        switch (this.type) {
            case SelectionType.Including: return false;
            case SelectionType.Excluding: return this.items.size === 0;
        }
    }

    get partialSelection() {
        switch (this.type) {
            case SelectionType.Including: return this.items.size > 0;
            case SelectionType.Excluding: return true;
        }
    }

    toggleMaster() {
        switch (this.type) {
            case SelectionType.Including:
                this.type = SelectionType.Excluding;
                this.items.clear();
                break;

            case SelectionType.Excluding:
                if (this.items.size === 0) {
                    this.type = SelectionType.Including;
                }
                else {
                    this.items.clear();
                }
                break;
        }
    }

    clear() {
        this.type = SelectionType.Including;
        this.items.clear();
    }

    select(key: K) {
        switch (this.type) {
            case SelectionType.Including: this.items.add(key); break;
            case SelectionType.Excluding: this.items.delete(key); break;
        }
    }

    selectSingle(key: K) {
        this.type = SelectionType.Including;
        this.items.clear();
        this.items.add(key);
    }

    deselect(key: K) {
        switch (this.type) {
            case SelectionType.Including: this.items.delete(key); break;
            case SelectionType.Excluding: this.items.add(key); break;
        }
    }

    toggle(key: K) {
        if (this.isSelected(key)) {
            return this.deselect(key);
        }
        else {
            return this.select(key);
        }
    }

    isSelected(key: K) {
        const inItems = this.items.has(key);
        switch (this.type) {
            case SelectionType.Including: return inItems;
            case SelectionType.Excluding: return !inItems;
        }
    }
}
