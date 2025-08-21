import Phaser from "phaser";
import GameState from "../engine/state/GameState";
import MapRenderer from "../rendering/MapRenderer";
import UnitRenderer from "../rendering/UnitRenderer";
import InputController from "../controllers/InputController";
import type { MapData, UnitDef } from "../engine/types";

export default class BattleScene extends Phaser.Scene {
  private state!: GameState;
  private mapRenderer!: MapRenderer;
  private unitRenderer!: UnitRenderer;
  private inputCtrl!: InputController;

  constructor() { super("BattleScene"); }

  create(data: { mapKey: string }) {
    const unitDefs = this.cache.json.get("units") as Record<string, UnitDef>;
    const map = this.cache.json.get(data.mapKey) as MapData;

    this.state = new GameState(map, unitDefs);

    this.mapRenderer = new MapRenderer(this, this.state);
    this.mapRenderer.render();

    this.unitRenderer = new UnitRenderer(this, this.state);
    this.unitRenderer.render();

    const selected = this.state.units[0]?.id ?? "";
    this.inputCtrl = new InputController(this, this.state, this.unitRenderer, selected);
  }
}
