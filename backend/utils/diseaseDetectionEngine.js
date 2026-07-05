/**
 * Disease Detection Engine — DEMO PLACEHOLDER
 *
 * Real leaf-disease detection needs a trained CNN (e.g. transfer-learned on
 * PlantVillage data) served from a Python microservice (FastAPI/Flask) that
 * this Node backend would call over HTTP, passing the image bytes.
 *
 * Until that service exists, this module returns a deterministic mock result
 * derived from the uploaded image's filename, so the UI/UX and data flow can
 * be fully built and demoed end-to-end. Swap the body of `detectDisease`
 * with a fetch() call to the ML microservice once it's ready — the
 * input/output contract below is designed to stay the same.
 */

const DISEASE_DB = [
  {
    name: "Leaf Blight",
    symptoms: ["Brown/yellow patches on leaf edges", "Leaves curling and drying out"],
    treatment: ["Apply copper-based fungicide", "Remove and destroy affected leaves"],
    prevention: ["Avoid overhead irrigation", "Ensure proper plant spacing for airflow"],
  },
  {
    name: "Powdery Mildew",
    symptoms: ["White powdery coating on leaves", "Stunted leaf growth"],
    treatment: ["Spray sulfur-based or neem oil fungicide", "Improve air circulation around plants"],
    prevention: ["Avoid excess nitrogen fertilizer", "Water at the base, not on leaves"],
  },
  {
    name: "Bacterial Spot",
    symptoms: ["Small dark water-soaked spots", "Yellow halo around spots"],
    treatment: ["Apply copper-based bactericide", "Remove severely infected plants"],
    prevention: ["Use disease-free seeds", "Rotate crops each season"],
  },
  {
    name: "Healthy Leaf",
    symptoms: ["No visible lesions or discoloration", "Normal leaf color and texture"],
    treatment: ["No treatment needed"],
    prevention: ["Continue regular monitoring and balanced fertilization"],
  },
];

const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

export const detectDisease = (imageName = "leaf.jpg") => {
  const index = hashString(imageName) % DISEASE_DB.length;
  const disease = DISEASE_DB[index];
  const confidence = 72 + (hashString(imageName + "c") % 23); // 72-94%

  return {
    diseaseName: disease.name,
    confidence,
    symptoms: disease.symptoms,
    treatment: disease.treatment,
    prevention: disease.prevention,
  };
};
