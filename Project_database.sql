-- CREATE USER SigmaUser INDENTIFIED BY ILoveFullStackProjects;
-- GRANT ALL PRIVILEGES ON COP4710.* TO SigmaUser;
-- $conn = new mysqli("localhost", "SigmaUser", "ILoveFullStackProjects", "COP4710");

-- Insert

CREATE TABLE
Users
    (user_id int NOT NULL AUTO_INCREMENT,
     first_name varchar(50) NOT NULL DEFAULT '',
     last_name varchar(50) NOT NULL DEFAULT '',
     email varchar(50) UNIQUE NOT NULL DEFAULT '',
     login varchar(50) NOT NULL DEFAULT '',
     password varchar(20) NOT NULL DEFAULT '',
     role varchar(20) NOT NULL DEFAULT 'student',
     university varchar(50) NOT NULL,
     date_created DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     date_last_logged_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (user_id)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Attending
    (user_id int NOT NULL,
     university varchar(50) NOT NULL,
     FOREIGN KEY (user_id) REFERENCES Users (user_id),
     FOREIGN KEY (university) REFERENCES Uni_Profs(email_ending)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Admins
    (user_id int NOT NULL,
     events_created INTEGER,
     PRIMARY KEY (user_id),
     FOREIGN KEY (user_id) REFERENCES Users (user_id)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
RSO
    (rso_id int NOT NULL AUTO_INCREMENT,
     admin_id varchar(50) NOT NULL,
     active boolean NOT NULL DEFAULT TRUE,
     name varchar(50) NOT NULL,
     PRIMARY KEY (rso_id),
     FOREIGN KEY (admin_id) REFERENCES Admin (user_id),
     ON DELETE CASCADE
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Student_RSOS
    (rso_name varchar(50) NOT NULL,
     student_id varchar(50),
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Super_Admins
    (user_id int NOT NULL,
     email_ending varchar(50) NOT NULL,
     PRIMARY KEY (user_id),
     FOREIGN KEY (user_id) REFERENCES Users (user_id),
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Relationship between Student and Post represented by id of who created it
CREATE TABLE
Posts
    (post_id int NOT NULL AUTO_INCREMENT,
     student_id varchar(50) NOT NULL,
     event_id int NOT NULL AUTO_INCREMENT,
     comment varchar(200) NOT NULL DEFAULT ,
     rating int NOT NULL check(rating >= 1 AND rating <= 5),
     date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (post_id),
     FOREIGN KEY (student_id) REFERENCES Users (user_id),
     FOREIGN KEY (event_id) REFERENCES Events (event_id)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Uni_Profs
    (uni_id int NOT NULL AUTO_INCREMENT,
     name varchar(50) NOT NULL DEFAULT '',
     description varchar(200),
     image_path varchar(100),
     location varchar(200) NOT NULL DEFAULT '',
     email_ending varchar(50) NOT NULL,
     super_id varchar(50) NOT NULL,
     PRIMARY KEY (uni_id),
     FOREIGN KEY (super_id) REFERENCES Super_Admins (user_id)
     FOREIGN KEY (email_ending) REFERENCES Super_Admins (email_ending)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Events
    (event_id int NOT NULL AUTO_INCREMENT,
     name varchar(30) NOT NULL DEFAULT '',
     uni_id varchar(50) NOT NULL,
     admin_id int NOT NULL,
     category varchar(20) NOT NULL DEFAULT "private",
     approved boolean NOT NULL DEFAULT FALSE,
     description varchar(200),
     time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     contact_phone varchar(20) NOT NULL DEFAULT '',
     contact_email varchar(40) NOT NULL DEFAULT '',
     location varchar(200) NOT NULL DEFAULT '',
     PRIMARY KEY (event_id),
     FOREIGN KEY (admin_id) REFERENCES Admins (user_id),
     FOREIGN KEY (uni_id) REFERENCES Uni_Profs (uni_id)
     ON DELETE CASCADE) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
Public_Events
    (event_id int NOT NULL,
     super_id int NOT NULL,
     PRIMARY KEY (event_id),
     FOREIGN KEY (event_id) REFERENCES Events (event_id),
     FOREIGN KEY (super_id) REFERENCES Super_Admins (super_id)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE
RSO_Events
    (event_id int NOT NULL,
     rso_name varchar(50) NOT NULL,
     PRIMARY KEY (event_id),
     FOREIGN KEY (event_id) REFERENCES Events (event_id),
     FOREIGN KEY (rso_id) REFERENCES RSO (rso_id)
    ) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
