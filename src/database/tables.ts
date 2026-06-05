class Tables {
    private connection:any
  init(connection:any) {
    this.connection = connection;
    this.createTableUser()
    this.createTableAnimal()
    this.createTableAnimalImages()
    this.createTableAnimalLocation()
  }

  createTableUser() {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(15) UNIQUE,
            active BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT NULL
        );
        `;
        this.connection.query(sql,(error:any)=>{
            if(error){
                console.log(error.message)
                return
            }
            console.log('Create Table USERS')
        })
  }

  createTableAnimal() {
    const sql = `
    CREATE TABLE IF NOT EXISTS animals (
        id INT AUTO_INCREMENT PRIMARY KEY,

        user_id INT NOT NULL,

        name VARCHAR(100) NOT NULL,
        species VARCHAR(50) NOT NULL,

        status ENUM('missing', 'found', 'reunited') NOT NULL DEFAULT 'missing',

        gender ENUM('male', 'female') NOT NULL,

        age INT,

        size ENUM('small', 'medium', 'large'),

        color VARCHAR(20),

        description VARCHAR(255),

        missing_date DATETIME,

        created_at TIMESTAMP not null DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT NULL,

        FOREIGN KEY (user_id) REFERENCES users(id)
    );
    `;
    this.connection.query(sql,(error:any)=>{
            if(error){
                console.log(error.message)
                return
            }
            console.log('Create Table Animal')
        })
  }
  createTableAnimalImages() {
    const sql = `
    CREATE TABLE IF NOT EXISTS animal_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        animal_id INT NOT NULL,
        image_url VARCHAR(255) NOT NULL,
        FOREIGN KEY (animal_id) REFERENCES animals(id)
    );
    `;
    this.connection.query(sql,(error:any)=>{
            if(error){
                console.log(error.message)
                return
            }
            console.log('Create Table Animal Image')
        })
  }

  createTableAnimalLocation() {
    const sql = `
        CREATE TABLE IF NOT EXISTS animal_locations(
            id INT AUTO_INCREMENT PRIMARY KEY,
            animal_id INT NOT NULL,
            zip VARCHAR(10),
            state VARCHAR(4),
            city VARCHAR(100),
            county VARCHAR(100),
            latitude DECIMAL(10,8),
            longitude DECIMAL(11,8),
            observation_date DATETIME not null DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (animal_id) REFERENCES animals(id)
        )
  
    `;
    this.connection.query(sql,(error:any)=>{
            if(error){
                console.log(error.message)
                return
            }
            console.log('Create Table Animal Location')
        })
  }
}

export default new Tables();
