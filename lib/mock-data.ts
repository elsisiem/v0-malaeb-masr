export type Sport = "football" | "tennis" | "basketball" | "volleyball" | "squash" | "padel" | "swimming" | "gym"

export interface Venue {
  id: string
  name: string
  location: string
  district: string
  distance: number
  rating: number
  reviewCount: number
  price: number
  sports: Sport[]
  amenities: string[]
  images: string[]
  description: string
  facilities: Facility[]
  reviews: Review[]
  availableTimes: string[]
}

export interface Facility {
  id: string
  name: string
  type: Sport
  description: string
  capacity: number
  price: number
  image: string
  available: boolean
  equipmentIncluded: boolean
}

export interface Review {
  id: string
  userName: string
  userImage?: string
  rating: number
  comment: string
  date: string
}

export interface Team {
  id: string
  name: string
  sport: Sport
  memberCount: number
  members: TeamMember[]
  isOwner: boolean
  nextGame?: {
    date: string
    time: string
  }
  image: string
}

export interface TeamMember {
  id: string
  name: string
  role: "captain" | "member"
  initial: string
  image?: string
}

export interface Booking {
  id: string
  venueId: string
  venueName: string
  facilityName: string
  facilityType: Sport
  date: string
  time: string
  duration: number
  price: number
  status: "upcoming" | "past" | "canceled"
  image: string
  location: string
}

// Mock venues data
export const venues: Venue[] = [
  {
    id: "v1",
    name: "Elite Sports Center",
    location: "Nasr City, Cairo",
    district: "Nasr City",
    distance: 2.3,
    rating: 4.8,
    reviewCount: 124,
    price: 250,
    sports: ["football", "tennis", "basketball"],
    amenities: ["Parking", "Showers", "Café", "WiFi"],
    images: ["/images/football-field.png", "/images/tennis-court.png", "/images/basketball-court.png"],
    description:
      "Elite Sports Center offers premium sports facilities in the heart of Nasr City. Our venue features professional-grade football pitches, tennis courts, and more, all maintained to the highest standards.",
    facilities: [
      {
        id: "f1",
        name: "Football Pitch #1",
        type: "football",
        description: "5-a-side, Artificial Turf",
        capacity: 10,
        price: 250,
        image: "/images/football-field.png",
        available: true,
        equipmentIncluded: true,
      },
      {
        id: "f2",
        name: "Football Pitch #2",
        type: "football",
        description: "7-a-side, Natural Grass",
        capacity: 14,
        price: 350,
        image: "/images/football-field2.png",
        available: true,
        equipmentIncluded: true,
      },
      {
        id: "f3",
        name: "Tennis Court #1",
        type: "tennis",
        description: "Hard Court, Competition Standard",
        capacity: 4,
        price: 180,
        image: "/images/tennis-court.png",
        available: true,
        equipmentIncluded: false,
      },
    ],
    reviews: [
      {
        id: "r1",
        userName: "Ahmed M.",
        userImage: "/images/profile-pic1.png",
        rating: 5,
        comment:
          "Great facilities and friendly staff. The football pitch was in excellent condition. Will definitely book again!",
        date: "2 days ago",
      },
      {
        id: "r2",
        userName: "Sara K.",
        userImage: "/images/profile-pic2.png",
        rating: 4,
        comment:
          "The tennis courts are well-maintained. The only downside was the limited parking space. Otherwise, a great experience.",
        date: "1 week ago",
      },
    ],
    availableTimes: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ],
  },
  {
    id: "v2",
    name: "Cairo Tennis Academy",
    location: "Maadi, Cairo",
    district: "Maadi",
    distance: 4.1,
    rating: 4.6,
    reviewCount: 98,
    price: 180,
    sports: ["tennis", "padel"],
    amenities: ["Parking", "Showers", "Pro Shop", "WiFi"],
    images: ["/images/tennis-court.png"],
    description:
      "Cairo Tennis Academy is the premier destination for tennis enthusiasts in Cairo. Our academy features professional-grade tennis courts, experienced coaches, and a vibrant community of players.",
    facilities: [
      {
        id: "f4",
        name: "Tennis Court #1",
        type: "tennis",
        description: "Clay Court, Competition Standard",
        capacity: 4,
        price: 180,
        image: "/images/tennis-court.png",
        available: true,
        equipmentIncluded: false,
      },
      {
        id: "f5",
        name: "Tennis Court #2",
        type: "tennis",
        description: "Hard Court, Training",
        capacity: 4,
        price: 150,
        image: "/images/tennis-court.png",
        available: true,
        equipmentIncluded: false,
      },
      {
        id: "f6",
        name: "Padel Court #1",
        type: "padel",
        description: "Glass Court, Competition Standard",
        capacity: 4,
        price: 200,
        image: "/images/tennis-court.png",
        available: true,
        equipmentIncluded: false,
      },
    ],
    reviews: [
      {
        id: "r3",
        userName: "Mohamed H.",
        userImage: "/images/profile-pic3.png",
        rating: 5,
        comment:
          "Best tennis courts in Cairo! The clay courts are perfectly maintained and the staff is very professional.",
        date: "3 days ago",
      },
      {
        id: "r4",
        userName: "Nour A.",
        userImage: "/images/profile-pic1.png",
        rating: 4,
        comment:
          "Great facilities for tennis lovers. The coaching staff is excellent. Highly recommended for beginners and pros alike.",
        date: "2 weeks ago",
      },
    ],
    availableTimes: [
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
    ],
  },
  {
    id: "v3",
    name: "Cairo Sports Club",
    location: "Heliopolis, Cairo",
    district: "Heliopolis",
    distance: 3.5,
    rating: 4.7,
    reviewCount: 156,
    price: 300,
    sports: ["football", "basketball", "swimming"],
    amenities: ["Parking", "Showers", "Café", "WiFi", "Gym"],
    images: ["/images/football-field3.png", "/images/basketball-court2.png", "/images/swimming-pool.png"],
    description:
      "Cairo Sports Club is a premier multi-sport facility offering a wide range of activities for sports enthusiasts of all ages. Our club features state-of-the-art facilities including football pitches, basketball courts, and an Olympic-sized swimming pool.",
    facilities: [
      {
        id: "f7",
        name: "Football Pitch #1",
        type: "football",
        description: "11-a-side, Natural Grass",
        capacity: 22,
        price: 500,
        image: "/images/football-field3.png",
        available: true,
        equipmentIncluded: true,
      },
      {
        id: "f8",
        name: "Basketball Court",
        type: "basketball",
        description: "Indoor, Competition Standard",
        capacity: 10,
        price: 300,
        image: "/images/basketball-court2.png",
        available: true,
        equipmentIncluded: true,
      },
      {
        id: "f9",
        name: "Swimming Pool",
        type: "swimming",
        description: "Olympic-sized, Heated",
        capacity: 30,
        price: 150,
        image: "/images/swimming-pool.png",
        available: true,
        equipmentIncluded: false,
      },
    ],
    reviews: [
      {
        id: "r5",
        userName: "Khaled R.",
        userImage: "/images/profile-pic2.png",
        rating: 5,
        comment:
          "Excellent facilities! The football pitch is one of the best in Cairo. Highly recommended for serious players.",
        date: "1 week ago",
      },
      {
        id: "r6",
        userName: "Laila M.",
        userImage: "/images/profile-pic3.png",
        rating: 4,
        comment: "Great swimming pool with professional coaches. The changing rooms are clean and well-maintained.",
        date: "3 weeks ago",
      },
    ],
    availableTimes: [
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
    ],
  },
  {
    id: "v4",
    name: "New Cairo Fitness Center",
    location: "New Cairo, Cairo",
    district: "New Cairo",
    distance: 7.2,
    rating: 4.5,
    reviewCount: 87,
    price: 200,
    sports: ["gym", "squash", "basketball"],
    amenities: ["Parking", "Showers", "Sauna", "WiFi", "Café"],
    images: ["/images/basketball-court3.png", "/images/swimming-pool2.png"],
    description:
      "New Cairo Fitness Center is a state-of-the-art facility offering a comprehensive range of fitness and sports activities. Our center features a fully-equipped gym, squash courts, and basketball courts, all designed to provide the ultimate fitness experience.",
    facilities: [
      {
        id: "f10",
        name: "Gym",
        type: "gym",
        description: "Fully-equipped, Personal Trainers Available",
        capacity: 50,
        price: 100,
        image: "/images/basketball-court3.png",
        available: true,
        equipmentIncluded: true,
      },
      {
        id: "f11",
        name: "Squash Court #1",
        type: "squash",
        description: "Competition Standard",
        capacity: 2,
        price: 120,
        image: "/images/basketball-court3.png",
        available: true,
        equipmentIncluded: false,
      },
      {
        id: "f12",
        name: "Basketball Court",
        type: "basketball",
        description: "Outdoor, Standard",
        capacity: 10,
        price: 200,
        image: "/images/basketball-court3.png",
        available: true,
        equipmentIncluded: true,
      },
    ],
    reviews: [
      {
        id: "r7",
        userName: "Omar S.",
        userImage: "/images/profile-pic1.png",
        rating: 5,
        comment: "The gym is fantastic with all the latest equipment. The trainers are knowledgeable and helpful.",
        date: "5 days ago",
      },
      {
        id: "r8",
        userName: "Heba K.",
        userImage: "/images/profile-pic2.png",
        rating: 4,
        comment: "Great squash courts! The only issue is that they get booked quickly, so plan ahead.",
        date: "2 weeks ago",
      },
    ],
    availableTimes: [
      "7:00 AM",
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
      "7:00 PM",
      "8:00 PM",
      "9:00 PM",
    ],
  },
  {
    id: "v5",
    name: "Zamalek Sports Club",
    location: "Zamalek, Cairo",
    district: "Zamalek",
    distance: 5.8,
    rating: 4.9,
    reviewCount: 203,
    price: 400,
    sports: ["football", "tennis", "swimming", "volleyball"],
    amenities: ["Parking", "Showers", "Restaurant", "WiFi", "Pro Shop"],
    images: ["/images/football-field2.png", "/images/tennis-court.png", "/images/swimming-pool3.png"],
    description:
      "Zamalek Sports Club is one of the most prestigious sports clubs in Egypt, offering a wide range of sports facilities and activities. Our club features professional-grade football pitches, tennis courts, and an Olympic-sized swimming pool, all set in a beautiful location on the Nile.",
    facilities: [
      {
        id: "f13",
        name: "Football Pitch #1",
        type: "football",
        description: "11-a-side, Natural Grass",
        capacity: 22,
        price: 600,
        image: "/images/football-field2.png",
        available: true,
        equipmentIncluded: true,
      },
      {
        id: "f14",
        name: "Tennis Court #1",
        type: "tennis",
        description: "Clay Court, Competition Standard",
        capacity: 4,
        price: 250,
        image: "/images/tennis-court.png",
        available: true,
        equipmentIncluded: false,
      },
      {
        id: "f15",
        name: "Swimming Pool",
        type: "swimming",
        description: "Olympic-sized, Outdoor",
        capacity: 40,
        price: 200,
        image: "/images/swimming-pool3.png",
        available: true,
        equipmentIncluded: false,
      },
    ],
    reviews: [
      {
        id: "r9",
        userName: "Amr F.",
        userImage: "/images/profile-pic3.png",
        rating: 5,
        comment: "The best sports club in Cairo! The facilities are world-class and the location is unbeatable.",
        date: "1 week ago",
      },
      {
        id: "r10",
        userName: "Dina H.",
        userImage: "/images/profile-pic1.png",
        rating: 5,
        comment:
          "I love the tennis courts here. The clay courts are perfectly maintained and the coaching staff is excellent.",
        date: "2 weeks ago",
      },
    ],
    availableTimes: [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
      "6:00 PM",
    ],
  },
]

// Mock teams data
export const teams: Team[] = [
  {
    id: "t1",
    name: "Cairo Eagles FC",
    sport: "football",
    memberCount: 8,
    members: [
      { id: "m1", name: "Ahmed Mohamed", role: "captain", initial: "A", image: "/images/profile-pic1.png" },
      { id: "m2", name: "Khaled Ibrahim", role: "member", initial: "K", image: "/images/profile-pic2.png" },
      { id: "m3", name: "Omar Samir", role: "member", initial: "O", image: "/images/profile-pic3.png" },
      { id: "m4", name: "Mohamed Ali", role: "member", initial: "M", image: "/images/profile-pic1.png" },
      { id: "m5", name: "Tarek Hassan", role: "member", initial: "T", image: "/images/profile-pic2.png" },
      { id: "m6", name: "Youssef Mahmoud", role: "member", initial: "Y", image: "/images/profile-pic3.png" },
      { id: "m7", name: "Karim Nour", role: "member", initial: "K", image: "/images/profile-pic1.png" },
      { id: "m8", name: "Hossam Fawzy", role: "member", initial: "H", image: "/images/profile-pic2.png" },
    ],
    isOwner: true,
    nextGame: {
      date: "Today",
      time: "5:00 PM",
    },
    image: "/images/football-field.png",
  },
  {
    id: "t2",
    name: "Cairo Ballers",
    sport: "basketball",
    memberCount: 12,
    members: [
      { id: "m9", name: "Mohamed Hassan", role: "captain", initial: "M", image: "/images/profile-pic3.png" },
      { id: "m10", name: "Ahmed Mohamed", role: "member", initial: "A", image: "/images/profile-pic1.png" },
      { id: "m11", name: "Khaled Ibrahim", role: "member", initial: "K", image: "/images/profile-pic2.png" },
      { id: "m12", name: "Omar Samir", role: "member", initial: "O", image: "/images/profile-pic3.png" },
    ],
    isOwner: false,
    nextGame: {
      date: "Tomorrow",
      time: "7:00 PM",
    },
    image: "/images/basketball-court.png",
  },
]

// Mock bookings data
export const bookings: Booking[] = [
  {
    id: "b1",
    venueId: "v3",
    venueName: "Cairo Sports Club",
    facilityName: "Football Pitch #3",
    facilityType: "football",
    date: "April 23, 2025",
    time: "5:00 PM - 6:00 PM",
    duration: 1,
    price: 250,
    status: "upcoming",
    image: "/images/football-field3.png",
    location: "Nasr City, Cairo",
  },
  {
    id: "b2",
    venueId: "v2",
    venueName: "Cairo Tennis Academy",
    facilityName: "Tennis Court #2",
    facilityType: "tennis",
    date: "April 24, 2025",
    time: "10:00 AM - 11:00 AM",
    duration: 1,
    price: 180,
    status: "upcoming",
    image: "/images/tennis-court.png",
    location: "Maadi, Cairo",
  },
  {
    id: "b3",
    venueId: "v4",
    venueName: "Elite Sports Center",
    facilityName: "Basketball Court",
    facilityType: "basketball",
    date: "April 30, 2025",
    time: "7:00 PM - 8:00 PM",
    duration: 1,
    price: 200,
    status: "upcoming",
    image: "/images/basketball-court.png",
    location: "New Cairo, Cairo",
  },
  {
    id: "b4",
    venueId: "v3",
    venueName: "Cairo Sports Club",
    facilityName: "Football Pitch #1",
    facilityType: "football",
    date: "April 16, 2025",
    time: "6:00 PM - 7:00 PM",
    duration: 1,
    price: 250,
    status: "past",
    image: "/images/football-field.png",
    location: "Nasr City, Cairo",
  },
  {
    id: "b5",
    venueId: "v2",
    venueName: "Cairo Tennis Academy",
    facilityName: "Tennis Court #3",
    facilityType: "tennis",
    date: "April 10, 2025",
    time: "9:00 AM - 10:00 AM",
    duration: 1,
    price: 180,
    status: "past",
    image: "/images/tennis-court.png",
    location: "Maadi, Cairo",
  },
  {
    id: "b6",
    venueId: "v4",
    venueName: "Elite Sports Center",
    facilityName: "Basketball Court",
    facilityType: "basketball",
    date: "April 5, 2025",
    time: "7:00 PM - 8:00 PM",
    duration: 1,
    price: 200,
    status: "canceled",
    image: "/images/basketball-court2.png",
    location: "New Cairo, Cairo",
  },
]

// Helper functions to get data
export function getVenues(filters?: {
  sport?: Sport
  priceRange?: [number, number]
  distance?: number
  amenities?: string[]
}): Venue[] {
  let filteredVenues = [...venues]

  if (filters) {
    if (filters.sport) {
      filteredVenues = filteredVenues.filter((venue) => venue.sports.includes(filters.sport as Sport))
    }

    if (filters.priceRange) {
      filteredVenues = filteredVenues.filter(
        (venue) => venue.price >= filters.priceRange![0] && venue.price <= filters.priceRange![1],
      )
    }

    if (filters.distance) {
      filteredVenues = filteredVenues.filter((venue) => venue.distance <= filters.distance!)
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filteredVenues = filteredVenues.filter((venue) =>
        filters.amenities!.every((amenity) => venue.amenities.includes(amenity)),
      )
    }
  }

  return filteredVenues
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find((venue) => venue.id === id)
}

export function getTeams(): Team[] {
  return teams
}

export function getBookings(status?: "upcoming" | "past" | "canceled"): Booking[] {
  if (status) {
    return bookings.filter((booking) => booking.status === status)
  }
  return bookings
}

export function getBookingById(id: string): Booking | undefined {
  return bookings.find((booking) => booking.id === id)
}

export function getSportIcon(sport: Sport): string {
  switch (sport) {
    case "football":
      return "/images/football-field.png"
    case "tennis":
      return "/images/tennis-court.png"
    case "basketball":
      return "/images/basketball-court.png"
    case "volleyball":
      return "/images/basketball-court2.png" // Using basketball as placeholder
    case "squash":
      return "/images/basketball-court3.png" // Using basketball as placeholder
    case "padel":
      return "/images/tennis-court.png" // Using tennis as placeholder
    case "swimming":
      return "/images/swimming-pool.png"
    case "gym":
      return "/images/basketball-court3.png" // Using basketball as placeholder
    default:
      return "/placeholder.svg"
  }
}
