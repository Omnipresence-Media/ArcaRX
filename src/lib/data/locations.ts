import type { Location } from "./types";

export const locations: Location[] = [
  {
    id: "loc-atx",
    name: "Austin Flagship",
    city: "Austin",
    state: "TX",
    members: 412,
    mrr: 24180,
    address: "2800 South Lamar Blvd, Suite 200",
    phone: "(512) 555-0100",
  },
  {
    id: "loc-dal",
    name: "Dallas Uptown",
    city: "Dallas",
    state: "TX",
    members: 268,
    mrr: 15890,
    address: "3200 McKinney Ave, Suite 150",
    phone: "(214) 555-0200",
  },
  {
    id: "loc-nsh",
    name: "Nashville Gulch",
    city: "Nashville",
    state: "TN",
    members: 167,
    mrr: 8209,
    address: "1100 Division St, Suite 300",
    phone: "(615) 555-0300",
  },
];

export function getLocation(id: string) {
  return locations.find((l) => l.id === id);
}
