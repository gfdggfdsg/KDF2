import type { MapData, UnitDef, UnitState, Hex, Terrain } from "../types";

export default class GameState {
  width: number;
  height: number;
  hexSize: number;
  terrain: Terrain[];
  units: UnitState[] = [];
  unitDefs: Record<string, UnitDef>;

  constructor(map: MapData, unitDefs: Record<string, UnitDef>) {
    this.width = map.width;
    this.height = map.height;
    this.hexSize = map.hexSize;
    const total = this.width * this.height;
    this.terrain = Array(total).fill("plain") as Terrain[];

    if (map.terrainPatches) {
      for (const t of map.terrainPatches) {
        const idx = this.index(t.q, t.r);
        if (idx >= 0 && idx < total) this.terrain[idx] = t.type;
      }
    }

    this.unitDefs = unitDefs;

    for (const u of map.units) {
      const def = unitDefs[u.type];
      this.units.push({
        id: u.id,
        type: u.type,
        owner: u.owner,
        pos: { q: u.q, r: u.r },
        hp: def ? def.hp : 10,
      });
    }
  }

  index(q: number, r: number) { return r * this.width + q; }

  terrainAt(q: number, r: number) {
    return this.terrain[this.index(q, r)];
  }

  moveUnit(id: string, to: Hex) {
    const u = this.units.find(x => x.id == id);
    if (u) u.pos = to;
  }
}
