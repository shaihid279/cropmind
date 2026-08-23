const crops = {
  soybean: {
    name: "Soybean",
    season: "Kharif",
    districts: ["Ahmednagar", "Latur", "Osmanabad"],
    soil: "Black cotton soil",
    irrigation: "Critical stages: flowering and pod filling. Avoid waterlogging.",
    fertilizer: "DAP 100kg/ha + MOP 50kg/ha at sowing",
    commonDiseases: [
      {
        name: "Yellow Mosaic Virus",
        solution: "Spray Imidacloprid 0.5ml/litre water"
      }
    ]
  },
  wheat: {
    name: "Wheat",
    season: "Rabi",
    districts: ["Nashik", "Pune"],
    soil: "Loamy, clay soil",
    irrigation: "Every 10-12 days, critical at crown root stage",
    fertilizer: "DAP 50kg/acre at sowing, Urea 30kg/acre at 21 days",
    commonDiseases: [
      {
        name: "Rust",
        solution: "Spray Propiconazole 0.1%"
      }
    ]
  },
  cotton: {
    name: "Cotton",
    season: "Kharif",
    districts: ["Yavatmal", "Nagpur"],
    soil: "Black cotton soil",
    irrigation: "Every 15-20 days depending on rainfall",
    fertilizer: "Urea 50kg/acre + DAP 40kg/acre",
    commonDiseases: [
      {
        name: "Bollworm",
        solution: "Spray Chlorpyrifos, monitor pheromone traps"
      }
    ]
  }
};

export default crops;