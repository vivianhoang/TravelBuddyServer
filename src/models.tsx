export type City = 'SF' | 'NY' | 'LA';

export interface PendingMatch {
  city: City,
  username: string,
}

export interface PendingMatches {
  [pendingId: string]: PendingMatch,
}