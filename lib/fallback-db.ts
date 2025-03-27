// A fallback database module that returns empty data but doesn't crash
export async function getDashboardStats() {
  console.warn("Using fallback dashboard stats")

  return {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    occupancyRate: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalGuests: 0,
    totalBookings: 0,
    revenueThisMonth: 0,
  }
}

export async function getRooms() {
  console.warn("Using fallback rooms data")
  return []
}

export async function getBookings() {
  console.warn("Using fallback bookings data")
  return []
}

export async function getGuests() {
  console.warn("Using fallback guests data")
  return []
}

