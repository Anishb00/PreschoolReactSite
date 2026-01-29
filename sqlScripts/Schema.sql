CREATE DATABASE IF NOT EXISTS Preschool
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_general_ci;
USE Preschool;

DROP VIEW IF EXISTS ChildWithParents;

DROP TABLE IF EXISTS Check_In_Out;
DROP TABLE IF EXISTS filtered_students;
DROP TABLE IF EXISTS schedule_items;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS email_verifications;
DROP TABLE IF EXISTS Child_Parent;
DROP TABLE IF EXISTS Parent;
DROP TABLE IF EXISTS Child;

CREATE TABLE Child (
  Child_ID INT NOT NULL AUTO_INCREMENT,
  Child_name VARCHAR(100) NOT NULL,
  DOB DATE NOT NULL,
  Sex VARCHAR(10) CHECK (Sex in ('male', 'female'))NOT NULL ,
  Program VARCHAR(30) NOT NULL,
  Class VARCHAR(20) CHECK (Class IN ('Waitlist','Pre-Register', 'Registered', 'Caterpillar', 'Chrysalis', 'Butterfly', 'Sunshine', 'Rainbow','Test','Dismissed')) DEFAULT NULL,
  Potty_trained BOOLEAN NOT NULL DEFAULT FALSE,
  Doctor_name VARCHAR(100) NOT NULL,
  Doctor_phone VARCHAR(19) NULL,
  Enroll_date DATE DEFAULT NULL,
  Drop_date DATE DEFAULT NULL,
  Checkout_time TIME DEFAULT NULL,
  Fee INT DEFAULT NULL,
  Child_Pin INT NOT NULL,
  PRIMARY KEY (Child_ID),
  UNIQUE KEY UNIQUE_PIN (Child_Pin),
  CONSTRAINT DUPLICATE_CHILD UNIQUE (Child_name, DOB),
  CONSTRAINT DOCTOR_PHONE_FORMAT CHECK (Doctor_phone REGEXP '^[0-9]{11}$')
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Parent (
  Parent_ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(100) NOT NULL,
  Address LONGTEXT NOT NULL,
  Phone VARCHAR(19) NULL,
  Email VARCHAR(50) NOT NULL,
  Email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (Parent_ID),
  UNIQUE KEY UQ_PARENT_IDENTITY (Name, Phone, Email),
  CONSTRAINT PARENT_PHONE_FORMAT CHECK (Phone REGEXP '^[0-9]{11}$')
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE email_verifications (
  Verification_ID INT NOT NULL AUTO_INCREMENT,
  Parent_ID INT NOT NULL,
  Token_Hash VARCHAR(255) NOT NULL,
  Expires_At DATETIME NOT NULL,
  Last_Sent_At DATETIME NOT NULL,
  Daily_Count INT NOT NULL DEFAULT 1,
  Daily_Window_Start DATETIME NOT NULL,
  Created_At TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (Verification_ID),
  UNIQUE KEY UQ_parent_verification (Parent_ID),
  FOREIGN KEY (Parent_ID) REFERENCES Parent(Parent_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Child_Parent (
  Child_ID INT NOT NULL,
  Parent_ID INT NOT NULL,
  PRIMARY KEY (Child_ID, Parent_ID),
  FOREIGN KEY (Child_ID) REFERENCES Child(Child_ID) ON DELETE CASCADE,
  FOREIGN KEY (Parent_ID) REFERENCES Parent(Parent_ID) ON DELETE CASCADE
);

CREATE OR REPLACE VIEW ChildWithParents AS
SELECT
    c.Child_ID,
    c.Child_name,
    c.DOB,
    c.Sex,
    c.Program,
    c.Class,
    c.Potty_trained,
    c.Doctor_name,
    c.Doctor_phone,
    c.Enroll_date,
    c.Drop_date,
    c.Checkout_time,
    c.Fee,
    c.Child_Pin,

    -- Parent 1 (lowest Parent_ID)
    MIN(CASE WHEN rn = 1 THEN p.Parent_ID END)   AS Parent1_ID,
    MIN(CASE WHEN rn = 1 THEN p.Name END)        AS Parent1_Name,
    MIN(CASE WHEN rn = 1 THEN p.Address END)     AS Parent1_Address,
    MIN(CASE WHEN rn = 1 THEN p.Phone END)       AS Parent1_Phone,
    MIN(CASE WHEN rn = 1 THEN p.Email END)       AS Parent1_Email,
    MIN(CASE WHEN rn = 1 THEN p.Email_verified END) AS Parent1_Verified,

    -- Parent 2 (second parent if exists)
    MIN(CASE WHEN rn = 2 THEN p.Parent_ID END)   AS Parent2_ID,
    MIN(CASE WHEN rn = 2 THEN p.Name END)        AS Parent2_Name,
    MIN(CASE WHEN rn = 2 THEN p.Address END)     AS Parent2_Address,
    MIN(CASE WHEN rn = 2 THEN p.Phone END)       AS Parent2_Phone,
    MIN(CASE WHEN rn = 2 THEN p.Email END)       AS Parent2_Email,
    MIN(CASE WHEN rn = 2 THEN p.Email_verified END) AS Parent2_Verified

FROM (
    -- Rank parents per child so we can split into Parent1 / Parent2
    SELECT
        cp.Child_ID,
        p.*,
        ROW_NUMBER() OVER (PARTITION BY cp.Child_ID ORDER BY p.Parent_ID) AS rn
    FROM Child_Parent cp
    JOIN Parent p ON cp.Parent_ID = p.Parent_ID
) p
RIGHT JOIN Child c ON c.Child_ID = p.Child_ID
GROUP BY
    c.Child_ID, c.Child_name, c.DOB, c.Sex, c.Program, c.Class, c.Potty_trained,
    c.Doctor_name, c.Doctor_phone, c.Enroll_date, c.Drop_date, c.Checkout_time,
    c.Fee, c.Child_Pin;

CREATE TABLE `Check_In_Out` (
  `Entry_ID` INT NOT NULL AUTO_INCREMENT,
  `Child_Pin` INT NOT NULL,
  `Date` date DEFAULT NULL,
  `Check_in_time` time DEFAULT NULL,
  `Check_in_signature_key` varchar(255) DEFAULT NULL,
  `Check_out_time` time DEFAULT NULL,
  `Check_out_signature_key` varchar(255) DEFAULT NULL,
  `no_checkout` tinyint DEFAULT '0',
  PRIMARY KEY (`Entry_ID`),
  KEY `fk_child_pin` (`child_pin`),
  CONSTRAINT `fk_child_pin` FOREIGN KEY (`Child_Pin`) REFERENCES `Child` (`Child_Pin`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=latin1;

CREATE TABLE filtered_students (
  ID INT NOT NULL AUTO_INCREMENT,
  Child_ID INT NOT NULL,
  PRIMARY KEY (ID),
  UNIQUE KEY (Child_ID),
  FOREIGN KEY (Child_ID) REFERENCES Child(Child_ID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `schedules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `schedule_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `schedule_id` INT NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `schedule_id` (`schedule_id`),
  CONSTRAINT `schedule_items_id_fk_1` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4;
