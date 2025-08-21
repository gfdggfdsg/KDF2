export type Hex = { q: number; r: number };

export type Terrain = "plain" | "forest" | "hill" | "water";

export interface UnitDef {
  id: string;
  name: string;
  hp: number;
  ap: number;
  vision: number;
  move_cost: Partial<Record<Terrain, number>>;
}

export interface UnitState {
  id: string;
  type: string;
  owner: number;
  pos: Hex;
  hp: number;
}

export interface MapData {
  name: string;
  hexSize: number;
  width: number;
  height: number;
  terrainPatches?: Array<{ q: number; r: number; type: Terrain }>;
  units: Array<{ id: string; type: string; owner: number; q: number; r: number }>;
}
