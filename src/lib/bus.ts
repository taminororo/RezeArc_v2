// src/lib/bus.ts
import { EventEmitter } from "events";

type Payload =
  | { type: "eventUpdated"; eventId: number }
  | { type: "bulkInvalidate" };

type Bus = EventEmitter & { emitUpdate: (p: Payload) => void };

const g = globalThis as unknown as { __rezeArcBus?: Bus };

export const bus: Bus =
  g.__rezeArcBus ??
  (g.__rezeArcBus = Object.assign(new EventEmitter(), {
    // this を明示的に Bus として注釈することで this.emit が使えるようにする
    emitUpdate(this: Bus, p: Payload) {
      this.emit("update", p);
    },
  }));

export type EventPayload = Payload;