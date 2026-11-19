class Tables {
  private connection: any;

  init(connection: any) {
    this.connection = connection;
    this.createTableUser();
    this.createTableAnimal();
    this.createTableAnimalImages();
    this.createTableAnimalLocation();
    this.createTableNotification();
    this.createTableCourses();
    this.createTablePetshops();
  }

  createTableUser() {
    const sql = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(25) NULL,
        avatar_url VARCHAR(255) NULL,
        active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela users:", error.message);
        return;
      }
      console.log("Tabela USERS pronta");

      // Migrações seguras para tabelas existentes
      const migrations = [
        `ALTER TABLE users MODIFY COLUMN phone_number VARCHAR(25) NULL;`,
        `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) NULL AFTER phone_number;`
      ];
      for (const migration of migrations) {
        this.connection.query(migration, () => {});
      }
    });
  }

  createTableAnimal() {
    const sql = `
      CREATE TABLE IF NOT EXISTS animals (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        name VARCHAR(100) NULL,
        species VARCHAR(50) NOT NULL,
        status ENUM('lost', 'street', 'rescued', 'adoption', 'adopted') NOT NULL DEFAULT 'street',
        gender ENUM('male', 'female') NULL,
        age INT NULL,
        size ENUM('small', 'medium', 'large') NULL,
        color VARCHAR(50) NULL,
        description VARCHAR(500) NULL,
        contact_name VARCHAR(100) NULL,
        contact_phone VARCHAR(25) NULL,
        tags JSON NULL,
        characteristics JSON NULL,
        missing_date DATETIME NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela animals:", error.message);
        return;
      }
      console.log("Tabela ANIMALS pronta");

      // Migrações para adequar colunas existentes
      const migrations = [
        `ALTER TABLE animals MODIFY COLUMN name VARCHAR(100) NULL;`,
        `ALTER TABLE animals MODIFY COLUMN status ENUM('lost', 'street', 'rescued', 'adoption', 'adopted') NOT NULL DEFAULT 'street';`,
        `ALTER TABLE animals MODIFY COLUMN description VARCHAR(500) NULL;`,
        `ALTER TABLE animals ADD COLUMN IF NOT EXISTS contact_name VARCHAR(100) NULL;`,
        `ALTER TABLE animals ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(25) NULL;`,
        `ALTER TABLE animals ADD COLUMN IF NOT EXISTS tags JSON NULL;`,
        `ALTER TABLE animals ADD COLUMN IF NOT EXISTS characteristics JSON NULL;`
      ];
      for (const migration of migrations) {
        this.connection.query(migration, () => {});
      }
    });
  }

  createTableAnimalImages() {
    const sql = `
      CREATE TABLE IF NOT EXISTS animal_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        animal_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        brightness DECIMAL(3,2) DEFAULT 0.00,
        display_order INT DEFAULT 0,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela animal_images:", error.message);
        return;
      }
      console.log("Tabela ANIMAL_IMAGES pronta");

      const migrations = [
        `ALTER TABLE animal_images ADD COLUMN IF NOT EXISTS brightness DECIMAL(3,2) DEFAULT 0.00;`,
        `ALTER TABLE animal_images ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;`
      ];
      for (const migration of migrations) {
        this.connection.query(migration, () => {});
      }
    });
  }

  createTableAnimalLocation() {
    const sql = `
      CREATE TABLE IF NOT EXISTS animal_locations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        animal_id INT NOT NULL,
        address_label VARCHAR(255) NULL,
        zip VARCHAR(10) NULL,
        state VARCHAR(4) NULL,
        city VARCHAR(100) NULL,
        county VARCHAR(100) NULL,
        latitude DECIMAL(10,8) NULL,
        longitude DECIMAL(11,8) NULL,
        observation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela animal_locations:", error.message);
        return;
      }
      console.log("Tabela ANIMAL_LOCATIONS pronta");

      const migrations = [
        `ALTER TABLE animal_locations ADD COLUMN IF NOT EXISTS address_label VARCHAR(255) NULL;`
      ];
      for (const migration of migrations) {
        this.connection.query(migration, () => {});
      }
    });
  }

  createTableNotification() {
    const sql = `
      CREATE TABLE IF NOT EXISTS notification (
        id INT AUTO_INCREMENT PRIMARY KEY,
        animal_id INT NOT NULL,
        type ENUM('location_added', 'status_changed') NOT NULL,
        message VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela notification:", error.message);
        return;
      }
      console.log("Tabela NOTIFICATION pronta");
    });
  }

  createTableCourses() {
    const sql = `
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        level ENUM('beginner', 'intermediate', 'advanced') NOT NULL DEFAULT 'beginner',
        lessons_count INT NOT NULL DEFAULT 0,
        duration_minutes INT NOT NULL DEFAULT 0,
        image_url VARCHAR(255) NOT NULL,
        is_free BOOLEAN NOT NULL DEFAULT FALSE,
        price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        original_price DECIMAL(10,2) NULL,
        rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
        students_count INT NOT NULL DEFAULT 0,
        badge VARCHAR(50) NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela courses:", error.message);
        return;
      }
      console.log("Tabela COURSES pronta");
      this.seedCourses();
    });
  }

  createTablePetshops() {
    const sql = `
      CREATE TABLE IF NOT EXISTS petshops (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        address VARCHAR(255) NOT NULL,
        latitude DECIMAL(10,8) NOT NULL,
        longitude DECIMAL(11,8) NOT NULL,
        phone VARCHAR(25) NOT NULL,
        rating DECIMAL(2,1) NOT NULL DEFAULT 5.0,
        reviews_count INT NOT NULL DEFAULT 0,
        is_partner BOOLEAN NOT NULL DEFAULT TRUE,
        partner_benefit VARCHAR(255) NULL,
        opening_hours JSON NULL,
        services JSON NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `;
    this.connection.query(sql, (error: any) => {
      if (error) {
        console.error("Erro ao criar tabela petshops:", error.message);
        return;
      }
      console.log("Tabela PETSHOPS pronta");
      this.seedPetshops();
    });
  }

  private seedCourses() {
    const checkSql = "SELECT COUNT(*) as count FROM courses";
    this.connection.query(checkSql, (err: any, rows: any) => {
      if (err || rows[0]?.count > 0) return;

      const seedCourses = [
        {
          id: "course_1",
          title: "Primeiros socorros para pets",
          description: "Aprenda a agir em emergências: ferimentos, engasgos, intoxicações e como estabilizar o animal até o veterinário.",
          category: "Saúde",
          level: "beginner",
          lessons_count: 8,
          duration_minutes: 95,
          image_url: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&auto=format&fit=crop&q=80",
          is_free: false,
          price: 49.90,
          original_price: 89.90,
          rating: 4.9,
          students_count: 1240,
          badge: "Mais vendido"
        },
        {
          id: "course_2",
          title: "Como resgatar um animal de rua com segurança",
          description: "Abordagem, contenção sem estresse, transporte e os primeiros cuidados depois do resgate.",
          category: "Resgate",
          level: "beginner",
          lessons_count: 6,
          duration_minutes: 70,
          image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80",
          is_free: true,
          price: 0.00,
          original_price: null,
          rating: 4.8,
          students_count: 3180,
          badge: "Grátis"
        },
        {
          id: "course_3",
          title: "Cuidados e higiene no dia a dia",
          description: "Banho, escovação, unhas, vermifugação e vacinação: a rotina que mantém seu pet saudável.",
          category: "Cuidados",
          level: "beginner",
          lessons_count: 10,
          duration_minutes: 120,
          image_url: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80",
          is_free: false,
          price: 39.90,
          original_price: 59.90,
          rating: 4.7,
          students_count: 860,
          badge: null
        }
      ];

      for (const course of seedCourses) {
        this.connection.query("INSERT IGNORE INTO courses SET ?", course, () => {});
      }
      console.log("Cursos semente cadastrados");
    });
  }

  private seedPetshops() {
    const checkSql = "SELECT COUNT(*) as count FROM petshops";
    this.connection.query(checkSql, (err: any, rows: any) => {
      if (err || rows[0]?.count > 0) return;

      const seedShop = {
        id: "shop_1",
        name: "Pet Shop Amigo Fiel",
        description: "Banho, tosa, veterinário e tudo para o seu pet. Ponto de coleta de ração para os animais resgatados pelo AuHelp.",
        address: "Av. Ibirapuera, 2120 – Moema, São Paulo",
        latitude: -23.60120000,
        longitude: -46.66550000,
        phone: "(11) 90000-0000",
        rating: 4.8,
        reviews_count: 236,
        is_partner: true,
        partner_benefit: "10% de desconto no banho para quem adotou pelo AuHelp",
        opening_hours: JSON.stringify([
          { days: "Segunda a sexta", hours: "8h às 19h" },
          { days: "Sábado", hours: "8h às 17h" },
          { days: "Domingo", hours: "Fechado" }
        ]),
        services: JSON.stringify([
          { name: "Banho", priceFrom: 45, icon: "shower-head" },
          { name: "Tosa", priceFrom: 60, icon: "content-cut" },
          { name: "Veterinário", priceFrom: 120, icon: "stethoscope" },
          { name: "Vacinas", priceFrom: 80, icon: "needle" },
          { name: "Ração e acessórios", icon: "food-drumstick" },
          { name: "Hotel pet", priceFrom: 90, icon: "home-heart" }
        ])
      };

      this.connection.query("INSERT IGNORE INTO petshops SET ?", seedShop, () => {});
      console.log("Petshops semente cadastrados");
    });
  }
}

export default new Tables();
