export interface WorkflowCreateEvent extends Record<string, unknown> {
  eventId: string;
  buildingId: number;
  name: string;
  occurredAt: string;
}
