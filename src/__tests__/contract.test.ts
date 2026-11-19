import { userAdapter } from "../adapters/userAdapter";
import { petAdapter, safeJsonArray, buildImageUrl } from "../adapters/petAdapter";
import aiController from "../controllers/ai/aiController";

function runTests() {
  console.log("=== INICIANDO TESTES DE CONTRATO (AUHELP FRONT X BACK) ===");

  // 1. Teste de User Adapter
  const dbUser = {
    id: 1,
    name: "Anna Faustino",
    email: "anna@example.com",
    password: "$2b$10$xyzFakeHashNotToBeExposed",
    phone_number: "11999998888",
    avatar_url: "https://example.com/avatar.jpg",
    created_at: new Date("2026-01-01T12:00:00Z")
  };
  const mappedUser = userAdapter(dbUser);
  console.assert(mappedUser.id === "1", "User id deve ser string");
  console.assert(mappedUser.name === "Anna Faustino", "Nome do usuário incorreto");
  console.assert(mappedUser.email === "anna@example.com", "Email do usuário incorreto");
  console.assert(mappedUser.phone === "11999998888", "Telefone deve ser mapeado de phone_number");
  console.assert(mappedUser.avatarUrl === "https://example.com/avatar.jpg", "AvatarUrl incorreto");
  console.assert((mappedUser as any).password === undefined, "Senha NUNCA deve ser exposta no adapter");
  console.log("✔ userAdapter validado com sucesso");

  // 2. Teste de safeJsonArray
  console.assert(JSON.stringify(safeJsonArray('["dog", "cat"]')) === JSON.stringify(["dog", "cat"]), "safeJsonArray com string falhou");
  console.assert(JSON.stringify(safeJsonArray(["dog", "cat"])) === JSON.stringify(["dog", "cat"]), "safeJsonArray com array nativo falhou");
  console.assert(JSON.stringify(safeJsonArray(null)) === JSON.stringify([]), "safeJsonArray com null falhou");
  console.assert(JSON.stringify(safeJsonArray("invalid json")) === JSON.stringify([]), "safeJsonArray com string corrompida falhou");
  console.log("✔ safeJsonArray validado com sucesso");

  // 3. Teste de buildImageUrl
  const externalUrl = "https://images.unsplash.com/photo-123";
  console.assert(buildImageUrl(externalUrl) === externalUrl, "buildImageUrl com URL externa falhou");
  const localRelative = "uploads/pet_123.jpg";
  const builtLocal = buildImageUrl(localRelative, "http://localhost:4000");
  console.assert(builtLocal === "http://localhost:4000/uploads/pet_123.jpg", "buildImageUrl com path relativo falhou");
  console.log("✔ buildImageUrl validado com sucesso");

  // 4. Teste de Pet Adapter
  const animalRow = {
    id: 42,
    user_id: 1,
    name: "Bravinha",
    status: "lost",
    species: "Cachorro",
    description: "Cadela perdida com mancha branca no peito.",
    contact_name: "Maria Silva",
    contact_phone: "11900000000",
    tags: '["dog", "friendly"]',
    characteristics: '["Macho", "Porte médio"]',
    created_at: new Date()
  };

  const images = [
    { image_url: "uploads/bravinha_1.jpg", brightness: 0.1, display_order: 0 },
    { image_url: "https://images.unsplash.com/photo-456", brightness: -0.2, display_order: 1 }
  ];

  const location = {
    address_label: "Pinheiros, São Paulo - SP",
    latitude: -23.5664,
    longitude: -46.6919
  };

  const petReport = petAdapter(animalRow, images, location, 1, "http://localhost:4000");
  console.assert(petReport.id === "42", "Pet id deve ser string");
  console.assert(petReport.name === "Bravinha", "Pet name incorreto");
  console.assert(petReport.status === "lost", "Pet status incorreto");
  console.assert(petReport.imageUrl === "http://localhost:4000/uploads/bravinha_1.jpg", "Pet imageUrl incorreto");
  console.assert(petReport.imageUrls.length === 2, "imageUrls deve conter 2 fotos");
  console.assert(petReport.imageBrightness[0] === 0.1 && petReport.imageBrightness[1] === -0.2, "imageBrightness incorreto");
  console.assert(petReport.location === "Pinheiros, São Paulo - SP", "Pet location incorreto");
  console.assert(petReport.coordinates?.latitude === -23.5664, "Coordenadas latitude incorretas");
  console.assert(petReport.coordinates?.longitude === -46.6919, "Coordenadas longitude incorretas");
  console.assert(petReport.isUserReport === true, "isUserReport deve ser true quando user_id coincide com currentUserId");

  const petOtherUser = petAdapter(animalRow, images, location, 999, "http://localhost:4000");
  console.assert(petOtherUser.isUserReport === false, "isUserReport deve ser false quando user_id difere de currentUserId");

  const petAnonymousUser = petAdapter(animalRow, images, location, null, "http://localhost:4000");
  console.assert(petAnonymousUser.isUserReport === false, "isUserReport deve ser false para usuário não autenticado");
  console.log("✔ petAdapter validado com sucesso");

  // 5. Teste de Triagem por IA (Fallback Heurístico)
  aiController.triage("gato_resgate.jpg").then((aiCatResult) => {
    console.assert(aiCatResult.species === "cat", "Triagem de gato falhou");
    console.assert(aiCatResult.urgencyLevel !== undefined, "Nível de urgência ausente");
    console.assert(Array.isArray(aiCatResult.detectedPhysicalTraits), "Traços físicos devem ser array");
    console.assert(Array.isArray(aiCatResult.apparentInjuries), "Ferimentos aparentes devem ser array");
    console.assert(aiCatResult.recommendedActions.length > 0, "Ações recomendadas devem ter pelo menos 1 item");
    console.log("✔ aiController.triage (gato) validado com sucesso");

    return aiController.triage("cachorro_atropelado.jpg");
  }).then((aiDogResult) => {
    console.assert(aiDogResult.species === "dog", "Triagem de cão falhou");
    console.assert(aiDogResult.urgencyLevel === "high", "Urgência de cão ferido deve ser high");
    console.log("✔ aiController.triage (cão) validado com sucesso");
    console.log("=== TODOS OS TESTES DE CONTRATO PASSARAM COM SUCESSO! ===");
  }).catch((err) => {
    console.error("Erro no teste de triagem:", err);
    process.exit(1);
  });
}

runTests();
