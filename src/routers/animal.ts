import { Router, Request, Response } from "express";
import mainController, { ForbiddenError, NotFoundError } from "../controllers/animal/main/mainController";
import imageController from "../controllers/animal/image/imageController";
import { upload, validateId, authMiddleware, optionalAuthMiddleware } from "./middleware";

const routerAnimal = Router();

function getBaseUrl(req: Request): string {
  return process.env.APP_URL || `${req.protocol}://${req.get("host")}`;
}

// GET /animal (com filtros opcionais e optionalAuthMiddleware)
routerAnimal.get("/animal", optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { status, search, tag } = req.query;
    const filters = {
      status: status ? String(status) : undefined,
      search: search ? String(search) : undefined,
      tag: tag ? String(tag) : undefined
    };

    const currentUserId = req.userId || null;
    const baseUrl = getBaseUrl(req);
    const result = await mainController.animalGet(filters, currentUserId, baseUrl);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao listar animais"
    });
  }
});

// GET /animal/:id (com optionalAuthMiddleware)
routerAnimal.get("/animal/:id", validateId, optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const currentUserId = req.userId || null;
    const baseUrl = getBaseUrl(req);
    const result = await mainController.animalGetId(id, currentUserId, baseUrl);

    if (!result) {
      return res.status(404).json({ message: "Animal não encontrado" });
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao buscar animal"
    });
  }
});

// POST /animal (criação unificada de anúncio com authMiddleware e suporte a multipart / JSON)
routerAnimal.post(
  "/animal",
  authMiddleware,
  upload.array("photos", 6),
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const baseUrl = getBaseUrl(req);
      const body = req.body;

      // 1. Processar fotos: multipart files ou array JSON de fotos
      const photos: Array<{ url: string; brightness?: number }> = [];

      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        let brightnessList: number[] = [];
        if (body.imageBrightness) {
          try {
            brightnessList = typeof body.imageBrightness === "string"
              ? JSON.parse(body.imageBrightness)
              : body.imageBrightness;
          } catch {
            brightnessList = [];
          }
        }

        req.files.forEach((file: Express.Multer.File, index: number) => {
          photos.push({
            url: `uploads/${file.filename}`,
            brightness: brightnessList[index] ?? 0
          });
        });
      } else if (body.photos) {
        const rawPhotos = typeof body.photos === "string" ? JSON.parse(body.photos) : body.photos;
        if (Array.isArray(rawPhotos)) {
          rawPhotos.forEach((p: any) => {
            const url = typeof p === "string" ? p : p.url || p.uri;
            if (url) {
              photos.push({
                url,
                brightness: p.brightness ?? 0
              });
            }
          });
        }
      }

      // 2. Processar coordenadas
      let coordinates: { latitude: number; longitude: number } | undefined = undefined;
      if (body.coordinates) {
        try {
          const parsed = typeof body.coordinates === "string" ? JSON.parse(body.coordinates) : body.coordinates;
          if (parsed && parsed.latitude !== undefined && parsed.longitude !== undefined) {
            coordinates = {
              latitude: Number(parsed.latitude),
              longitude: Number(parsed.longitude)
            };
          }
        } catch {}
      } else if (body.latitude !== undefined && body.longitude !== undefined) {
        coordinates = {
          latitude: Number(body.latitude),
          longitude: Number(body.longitude)
        };
      }

      // 3. Processar tags e características
      let tags: string[] = [];
      if (body.tags) {
        try {
          tags = typeof body.tags === "string" ? JSON.parse(body.tags) : body.tags;
        } catch {
          tags = Array.isArray(body.tags) ? body.tags : [];
        }
      }

      let characteristics: string[] = [];
      if (body.characteristics) {
        try {
          characteristics = typeof body.characteristics === "string"
            ? JSON.parse(body.characteristics)
            : body.characteristics;
        } catch {
          characteristics = Array.isArray(body.characteristics) ? body.characteristics : [];
        }
      }

      const input = {
        name: body.name || null,
        species: body.species || "Outro",
        status: body.status || "street",
        description: body.description || undefined,
        location: body.location || undefined,
        coordinates,
        tags,
        characteristics,
        photos,
        contactName: body.contactName || body.contact_name || undefined,
        contactPhone: body.contactPhone || body.contact_phone || undefined
      };

      const result = await mainController.animalCreate(input, userId, baseUrl);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Erro ao criar anúncio"
      });
    }
  }
);

// PUT /animal/:id (com ownership check)
routerAnimal.put("/animal/:id", validateId, authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.userId!;
    const baseUrl = getBaseUrl(req);

    const result = await mainController.animalUpdate(req.body, id, userId, baseUrl);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao atualizar anúncio"
    });
  }
});

// DELETE /animal/:id (com ownership check)
routerAnimal.delete("/animal/:id", validateId, authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const userId = req.userId!;

    const result = await mainController.animalDelete(id, userId);
    return res.status(200).json(result);
  } catch (error: any) {
    if (error instanceof ForbiddenError) {
      return res.status(403).json({ message: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao excluir anúncio"
    });
  }
});

// GET /image-animal/:id (compatibilidade retroativa)
routerAnimal.get("/image-animal/:id", validateId, async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const result = await imageController.imageGet(id);

    if (!result) {
      return res.status(404).json({ message: "Imagens não encontradas" });
    }
    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao obter imagem"
    });
  }
});

// POST /image-animal (compatibilidade retroativa)
routerAnimal.post("/image-animal", upload.single("image"), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Imagem é obrigatória" });
    }

    const baseUrl = getBaseUrl(req);
    const imageUrl = `${baseUrl}/uploads/${file.filename}`;
    const newImage = {
      id: Number(req.params.id),
      animal_id: Number(req.body.animal_id),
      image_url: imageUrl
    };

    const result = await imageController.imageCreate(newImage);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error instanceof Error ? error.message : "Erro ao salvar imagem"
    });
  }
});

export default routerAnimal;
