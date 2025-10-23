import { UUIDTypes } from 'uuid';

import { Team } from './team.interface';
import { Municipality } from './municipality.interface';

export interface Agent {
  id: UUIDTypes;
  municipalityId: UUIDTypes;
  teamId: UUIDTypes;
  fullName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AgentPopulated {
  id: UUIDTypes;
  municipality: Partial<Municipality>;
  team: Partial<Team>;
  fullName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
