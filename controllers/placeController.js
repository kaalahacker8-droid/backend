const Place = require('../models/Place');

const placesData = [
  {
    name: "Sakleshpur Town Center",
    category: "transit",
    description: "Main town center of Sakleshpur, starting point for all rides",
    lat: 12.9174, lng: 75.7849,
    fareFromTown: 0,
    distanceFromTown: 0,
    estimatedDuration: 0,
    isActive: true, isFeatured: true
  },
  {
    name: "Manjarabad Fort",
    category: "heritage",
    description: "Star-shaped fort built by Tipu Sultan, stunning views of Western Ghats",
    lat: 12.9339, lng: 75.7394,
    fareFromTown: 300,
    distanceFromTown: 8,
    estimatedDuration: 20,
    isActive: true, isFeatured: true
  },
  {
    name: "Bisle Ghat Viewpoint",
    category: "nature",
    description: "One of the most scenic viewpoints in Karnataka, dense rainforest",
    lat: 12.7524, lng: 75.8023,
    fareFromTown: 800,
    distanceFromTown: 35,
    estimatedDuration: 60,
    isActive: true, isFeatured: true
  },
  {
    name: "Belur Chennakeshava Temple",
    category: "temple",
    description: "UNESCO World Heritage site, Hoysala architecture masterpiece",
    lat: 13.1628, lng: 75.8680,
    fareFromTown: 700,
    distanceFromTown: 30,
    estimatedDuration: 50,
    isActive: true, isFeatured: true
  },
  {
    name: "Halebidu Hoysaleswara Temple",
    category: "temple",
    description: "12th century Hoysala temple complex, intricate stone carvings",
    lat: 13.2121, lng: 75.9956,
    fareFromTown: 750,
    distanceFromTown: 35,
    estimatedDuration: 60,
    isActive: true, isFeatured: true
  },
  {
    name: "Hemavathi Reservoir",
    category: "dam",
    description: "Scenic reservoir surrounded by coffee estates and hills",
    lat: 13.0317, lng: 75.9436,
    fareFromTown: 500,
    distanceFromTown: 22,
    estimatedDuration: 40,
    isActive: true, isFeatured: false
  },
  {
    name: "Magajahalli Waterfalls",
    category: "waterfall",
    description: "Beautiful waterfalls hidden in the coffee estate region",
    lat: 12.8907, lng: 75.7234,
    fareFromTown: 600,
    distanceFromTown: 18,
    estimatedDuration: 35,
    isActive: true, isFeatured: true
  },
  {
    name: "Yedakumeri Coffee Estate",
    category: "estate",
    description: "Working coffee and spice estate, guided tours available",
    lat: 12.9512, lng: 75.7623,
    fareFromTown: 400,
    distanceFromTown: 12,
    estimatedDuration: 25,
    isActive: true, isFeatured: false
  },
  {
    name: "Shiradi Ghat",
    category: "scenic",
    description: "Winding mountain road through dense forest, stunning views",
    lat: 12.8214, lng: 75.7801,
    fareFromTown: 600,
    distanceFromTown: 25,
    estimatedDuration: 45,
    isActive: true, isFeatured: false
  },
  {
    name: "Kukke Subramanya Temple",
    category: "temple",
    description: "Famous Naga Devata temple, one of the most visited in Karnataka",
    lat: 12.8361, lng: 75.9414,
    fareFromTown: 1500,
    distanceFromTown: 55,
    estimatedDuration: 90,
    isActive: true, isFeatured: true
  },
  {
    name: "Hornadu Annapoorneshwari Temple",
    category: "temple",
    description: "Sacred temple on the banks of Bhadra river, free meals for devotees",
    lat: 13.3742, lng: 75.6357,
    fareFromTown: 1400,
    distanceFromTown: 62,
    estimatedDuration: 100,
    isActive: true, isFeatured: true
  },
  {
    name: "Chikmagalur City",
    category: "city",
    description: "Coffee capital of India, gateway to Mullayanagiri peak",
    lat: 13.3161, lng: 75.7720,
    fareFromTown: 900,
    distanceFromTown: 42,
    estimatedDuration: 70,
    isActive: true, isFeatured: false
  },
  {
    name: "Mudigere Town",
    category: "city",
    description: "Scenic hill town surrounded by cardamom and coffee plantations",
    lat: 13.1316, lng: 75.6408,
    fareFromTown: 500,
    distanceFromTown: 24,
    estimatedDuration: 40,
    isActive: true, isFeatured: false
  },
  {
    name: "Hassan City",
    category: "city",
    description: "District headquarters, nearest major city with railway station",
    lat: 13.0068, lng: 76.1003,
    fareFromTown: 400,
    distanceFromTown: 40,
    estimatedDuration: 65,
    isActive: true, isFeatured: false
  },
  {
    name: "Sakleshpur Railway Station",
    category: "transit",
    description: "Railway station connecting Sakleshpur to Bangalore and Mangalore",
    lat: 12.9141, lng: 75.7871,
    fareFromTown: 150,
    distanceFromTown: 2,
    estimatedDuration: 5,
    isActive: true, isFeatured: false
  },
  {
    name: "Bisale Rainforest Trek",
    category: "trek",
    description: "Dense rainforest trekking destination near Bisle Ghat",
    lat: 12.7701, lng: 75.8134,
    fareFromTown: 900,
    distanceFromTown: 38,
    estimatedDuration: 65,
    isActive: true, isFeatured: false
  },
  {
    name: "Donigal Bridge",
    category: "nature",
    description: "Old railway bridge over Hemavathi river, popular photography spot",
    lat: 12.9623, lng: 75.8012,
    fareFromTown: 300,
    distanceFromTown: 7,
    estimatedDuration: 15,
    isActive: true, isFeatured: false
  },
  {
    name: "Kalasa Temple",
    category: "temple",
    description: "Ancient Kalaseshwara temple town in the Western Ghats",
    lat: 13.2114, lng: 75.5236,
    fareFromTown: 1200,
    distanceFromTown: 54,
    estimatedDuration: 90,
    isActive: true, isFeatured: false
  },
  {
    name: "Kottigehara",
    category: "nature",
    description: "Scenic village surrounded by pepper and areca nut plantations",
    lat: 13.0754, lng: 75.6201,
    fareFromTown: 550,
    distanceFromTown: 26,
    estimatedDuration: 45,
    isActive: true, isFeatured: false
  },
  {
    name: "Hanbal Marikamba Temple",
    category: "temple",
    description: "Village temple famous for the annual Jatra festival",
    lat: 12.9034, lng: 75.8145,
    fareFromTown: 250,
    distanceFromTown: 6,
    estimatedDuration: 12,
    isActive: true, isFeatured: false
  },
  {
    name: "Abbe Falls Madikeri",
    category: "waterfall",
    description: "Beautiful waterfalls near Coorg, popular tourist destination",
    lat: 12.4244, lng: 75.7382,
    fareFromTown: 1200,
    distanceFromTown: 65,
    estimatedDuration: 110,
    isActive: true, isFeatured: false
  },
  {
    name: "Belur Bus Stand",
    category: "transit",
    description: "Belur bus stand for onward connections",
    lat: 13.1601, lng: 75.8651,
    fareFromTown: 650,
    distanceFromTown: 28,
    estimatedDuration: 48,
    isActive: true, isFeatured: false
  },
  {
    name: "Yagachi Dam",
    category: "dam",
    description: "Scenic dam near Belur with boating facility",
    lat: 13.1123, lng: 75.9012,
    fareFromTown: 700,
    distanceFromTown: 32,
    estimatedDuration: 55,
    isActive: true, isFeatured: false
  },
  {
    name: "Sakleshpur Coffee Museum",
    category: "heritage",
    description: "Museum showcasing the history of coffee cultivation in Malnad region",
    lat: 12.9189, lng: 75.7856,
    fareFromTown: 50,
    distanceFromTown: 1,
    estimatedDuration: 5,
    isActive: true, isFeatured: false
  },
  {
    name: "Alur Town",
    category: "city",
    description: "Small town near Hassan, entry point to several trekking routes",
    lat: 13.0612, lng: 75.9523,
    fareFromTown: 350,
    distanceFromTown: 18,
    estimatedDuration: 30,
    isActive: true, isFeatured: false
  }
];

// FUNCTION 1: seedPlaces
exports.seedPlaces = async (req, res) => {
  try {
    const count = await Place.countDocuments();
    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: `Places already seeded. ${count} places exist.`
      });
    }

    const result = await Place.insertMany(placesData);
    return res.status(201).json({
      success: true,
      message: "25 places seeded successfully",
      count: result.length
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error seeding places",
      error: error.message
    });
  }
};

// FUNCTION 2: getAllPlaces
exports.getAllPlaces = async (req, res) => {
  try {
    const { category, featured } = req.query;
    
    let filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    const places = await Place.find(filter)
      .sort({ isFeatured: -1, fareFromTown: 1 });
    
    return res.status(200).json({
      success: true,
      count: places.length,
      places
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching places",
      error: error.message
    });
  }
};

// FUNCTION 3: getFare
exports.getFare = async (req, res) => {
  try {
    const { pickup, drop } = req.query;
    
    if (!pickup || !drop) {
      return res.status(400).json({
        success: false,
        message: "pickup and drop place IDs are required"
      });
    }
    
    const [pickupPlace, dropPlace] = await Promise.all([
      Place.findById(pickup),
      Place.findById(drop)
    ]);
    
    if (!pickupPlace || !dropPlace) {
      return res.status(404).json({
        success: false,
        message: "One or both places not found"
      });
    }
    
    // Calculate fare
    let fare;
    if (pickupPlace.fareFromTown === 0) {
      // User is at town
      fare = dropPlace.fareFromTown;
    } else if (dropPlace.fareFromTown === 0) {
      // User going to town
      fare = pickupPlace.fareFromTown;
    } else {
      // Inter-destination fare: 70% of combined fares
      fare = Math.round((pickupPlace.fareFromTown + dropPlace.fareFromTown) * 0.7);
    }
    
    // Calculate platform fee and driver earning
    const platformFee = Math.round(fare * 0.10);
    const driverEarning = fare - platformFee;
    
    // Calculate estimated duration
    const estimatedDuration = Math.abs(
      (pickupPlace.estimatedDuration || 0) - (dropPlace.estimatedDuration || 0)
    ) + 15;
    
    return res.status(200).json({
      success: true,
      pickup: {
        _id: pickupPlace._id,
        name: pickupPlace.name,
        lat: pickupPlace.lat,
        lng: pickupPlace.lng
      },
      drop: {
        _id: dropPlace._id,
        name: dropPlace.name,
        lat: dropPlace.lat,
        lng: dropPlace.lng
      },
      fare,
      platformFee,
      driverEarning,
      estimatedDuration,
      currency: "INR"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error calculating fare",
      error: error.message
    });
  }
};
