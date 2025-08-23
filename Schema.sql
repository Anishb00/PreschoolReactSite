
DROP DATABASE IF EXISTS Preschool;
CREATE DATABASE Preschool
    DEFAULT CHARSET = utf8mb4
    COLLATE = utf8mb4_general_ci;
USE Preschool;




CREATE TABLE Child (
  Child_ID INT NOT NULL AUTO_INCREMENT,
  Child_name VARCHAR(30) NOT NULL,
  DOB DATE NOT NULL,
  Sex VARCHAR(10) CHECK (Sex in ('male', 'female'))NOT NULL ,
  Program VARCHAR(30) NOT NULL,
  Class VARCHAR(20) CHECK (Class IN ('Waitlist','Pre-Register', 'Registered', 'Caterpillar', 'Chrysalis', 'Butterfly', 'Sunshine', 'Rainbow','Test')) DEFAULT NULL,
  Doctor_name VARCHAR(30) NOT NULL,
  Doctor_phone VARCHAR(19) NOT NULL,
  Enroll_date DATE DEFAULT NULL,
  Drop_date DATE DEFAULT NULL,
  Fee INT DEFAULT NULL,
  Child_Pin INT NOT NULL,
  PRIMARY KEY (Child_ID),
  UNIQUE KEY child_pin (Child_Pin),
  CONSTRAINT uq_child UNIQUE (Child_name, DOB),
  CONSTRAINT chk_doctor_phone_format CHECK (Doctor_phone REGEXP '^[0-9]{10}$')
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE Parent (
  Parent_ID INT NOT NULL AUTO_INCREMENT,
  Name VARCHAR(50) NOT NULL,
  Address LONGTEXT NOT NULL,
  Phone VARCHAR(19) NOT NULL,
  Email VARCHAR(50) NOT NULL,
  PRIMARY KEY (Parent_ID),
  UNIQUE KEY uq_parent_identity (Name, Phone, Email),
  CONSTRAINT chk_parent_phone_format CHECK (Phone REGEXP '^[0-9]{10}$')
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
    c.Doctor_name,
    c.Doctor_phone,
    c.Enroll_date,
    c.Drop_date,
    c.Fee,
    c.Child_Pin,

    -- Parent 1 (lowest Parent_ID)
    MIN(CASE WHEN rn = 1 THEN p.Parent_ID END)   AS Parent1_ID,
    MIN(CASE WHEN rn = 1 THEN p.Name END)        AS Parent1_Name,
    MIN(CASE WHEN rn = 1 THEN p.Address END)     AS Parent1_Address,
    MIN(CASE WHEN rn = 1 THEN p.Phone END)       AS Parent1_Phone,
    MIN(CASE WHEN rn = 1 THEN p.Email END)       AS Parent1_Email,

    -- Parent 2 (second parent if exists)
    MIN(CASE WHEN rn = 2 THEN p.Parent_ID END)   AS Parent2_ID,
    MIN(CASE WHEN rn = 2 THEN p.Name END)        AS Parent2_Name,
    MIN(CASE WHEN rn = 2 THEN p.Address END)     AS Parent2_Address,
    MIN(CASE WHEN rn = 2 THEN p.Phone END)       AS Parent2_Phone,
    MIN(CASE WHEN rn = 2 THEN p.Email END)       AS Parent2_Email

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
    c.Child_ID, c.Child_name, c.DOB, c.Sex, c.Program, c.Class,
    c.Doctor_name, c.Doctor_phone, c.Enroll_date, c.Drop_date,
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

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `generate_unique_child_pin`(OUT new_pin INT)
BEGIN
    DECLARE is_unique BOOLEAN DEFAULT FALSE;

    WHILE NOT is_unique DO
        SET new_pin = FLOOR(RAND() * 90000) + 10000;
        IF NOT EXISTS (SELECT 1 FROM Child WHERE child_pin = new_pin) THEN
            SET is_unique = TRUE;
        END IF;
    END WHILE;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `refresh_filtered_students`()
BEGIN
    TRUNCATE TABLE filtered_students;
    INSERT INTO filtered_students (Child_ID)
    SELECT Child_ID FROM Child
    WHERE class IN ('Caterpillar', 'Chrysalis', 'Butterfly', 'Sunshine', 'Rainbow');
    SELECT CONCAT(ROW_COUNT(), ' rows refreshed in filtered_students table') AS refresh_summary;
END ;;
DELIMITER ;




DELIMITER $$

CREATE TRIGGER delete_orphan_parent_after_child
AFTER DELETE ON Child
FOR EACH ROW
BEGIN
  -- Delete only orphan parents (no entries in Child_Parent)
  DELETE FROM Parent
  WHERE Parent_ID IN (
      SELECT orphan_ids.Parent_ID
      FROM (
          SELECT p.Parent_ID
          FROM Parent p
          LEFT JOIN Child_Parent cp ON p.Parent_ID = cp.Parent_ID
          WHERE cp.Parent_ID IS NULL
      ) AS orphan_ids
  );
END$$

DELIMITER ;





DELIMITER $$

CREATE PROCEDURE register_child_waitlist (
    IN p_child_name VARCHAR(30),
    IN p_dob DATE,
    IN p_sex ENUM('male','female'),
    IN p_child_pin INT,
    IN p_doctor_name VARCHAR(50),
    IN p_doctor_phone VARCHAR(20),
    IN p_program VARCHAR(30),

    IN p_parent1_name VARCHAR(50),
    IN p_parent1_address VARCHAR(100),
    IN p_parent1_phone VARCHAR(20),
    IN p_parent1_email VARCHAR(50),

    IN p_parent2_name VARCHAR(50),
    IN p_parent2_address VARCHAR(100),
    IN p_parent2_phone VARCHAR(20),
    IN p_parent2_email VARCHAR(50)
)
BEGIN
    DECLARE v_child_id INT;
    DECLARE v_parent1_id INT;
    DECLARE v_parent2_id INT;

    -- Rollback if anything fails
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Insert child (fails if duplicate because of UNIQUE constraint)
    INSERT INTO Child (Child_name, DOB, Sex, Class, Child_Pin, Doctor_name, Doctor_phone,Program)
    VALUES (p_child_name, p_dob, p_sex, 'Waitlist', p_child_pin, p_doctor_name, p_doctor_phone, p_program );
    SET v_child_id = LAST_INSERT_ID();

    -- Parent 1: look up first
    SELECT parent_id INTO v_parent1_id
    FROM Parent
    WHERE Name = p_parent1_name
      AND Phone = p_parent1_phone
      AND Email = p_parent1_email
    LIMIT 1;

    IF v_parent1_id IS NULL THEN
        INSERT INTO Parent (Name, Address, Phone, Email)
        VALUES (p_parent1_name, p_parent1_address, p_parent1_phone, p_parent1_email);
        SET v_parent1_id = LAST_INSERT_ID();
    END IF;

    INSERT INTO Child_Parent (child_id, parent_id)
    VALUES (v_child_id, v_parent1_id);

    -- Parent 2 (optional)
    IF p_parent2_name IS NOT NULL
       AND p_parent2_phone IS NOT NULL
       AND p_parent2_email IS NOT NULL THEN

        SELECT parent_id INTO v_parent2_id
        FROM Parent
        WHERE Name = p_parent2_name
          AND Phone = p_parent2_phone
          AND Email = p_parent2_email
        LIMIT 1;

        IF v_parent2_id IS NULL THEN
            INSERT INTO Parent (Name, Address, Phone, Email)
            VALUES (p_parent2_name, p_parent2_address, p_parent2_phone, p_parent2_email);
            SET v_parent2_id = LAST_INSERT_ID();
        END IF;

        INSERT INTO Child_Parent (child_id, parent_id)
        VALUES (v_child_id, v_parent2_id);
    END IF;

    COMMIT;
END$$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE update_child_and_parents(
    -- Child info
    IN p_child_id INT,
    IN p_child_name VARCHAR(30),
    IN p_dob DATE,
    IN p_sex VARCHAR(10),
    IN p_program VARCHAR(30),
    IN p_class VARCHAR(20),
    IN p_doctor_name VARCHAR(30),
    IN p_doctor_phone VARCHAR(19),
    IN p_enroll_date DATE,
    IN p_drop_date DATE,
    IN p_fee INT,

    -- Parent 1 info
    IN p_parent1_id INT,
    IN p_parent1_name VARCHAR(50),
    IN p_parent1_address LONGTEXT,
    IN p_parent1_phone VARCHAR(19),
    IN p_parent1_email VARCHAR(50),

    -- Parent 2 info (optional)
    IN p_parent2_id INT,
    IN p_parent2_name VARCHAR(50),
    IN p_parent2_address LONGTEXT,
    IN p_parent2_phone VARCHAR(19),
    IN p_parent2_email VARCHAR(50)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Update Child (everything except Child_Pin)
    UPDATE Child
    SET Child_name   = p_child_name,
        DOB          = p_dob,
        Sex          = p_sex,
        Program      = p_program,
        Class        = p_class,
        Doctor_name  = p_doctor_name,
        Doctor_phone = p_doctor_phone,
        Enroll_date  = p_enroll_date,
        Drop_date    = p_drop_date,
        Fee          = p_fee
    WHERE Child_ID = p_child_id;

    -- Update Parent 1
    UPDATE Parent
    SET Name    = p_parent1_name,
        Address = p_parent1_address,
        Phone   = p_parent1_phone,
        Email   = p_parent1_email
    WHERE Parent_ID = p_parent1_id;

    -- Update Parent 2 (only if it exists)
    IF p_parent2_id IS NOT NULL THEN
        UPDATE Parent
        SET Name    = p_parent2_name,
            Address = p_parent2_address,
            Phone   = p_parent2_phone,
            Email   = p_parent2_email
        WHERE Parent_ID = p_parent2_id;
    END IF;

    COMMIT;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE delete_child_by_id (
    IN p_child_id INT
)
BEGIN
    DELETE FROM Child
    WHERE Child_ID = p_child_id;
END$$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE fuzzy_find_child_parent (
    IN p_search VARCHAR(100)
)
BEGIN
    SELECT
        c.Child_ID,
        c.Child_name,
        c.Class,
        p.Parent_ID,
        p.Name AS Parent_name,
        p.Phone AS Parent_phone,
        p.Email AS Parent_email
    FROM Child c
    JOIN Child_Parent cp ON c.Child_ID = cp.Child_ID
    JOIN Parent p ON cp.Parent_ID = p.Parent_ID
    WHERE c.Child_name LIKE CONCAT('%', p_search, '%')
       OR c.Class LIKE CONCAT('%', p_search, '%')
       OR p.Name LIKE CONCAT('%', p_search, '%')
       OR p.Phone LIKE CONCAT('%', p_search, '%')
       OR p.Email LIKE CONCAT('%', p_search, '%');
END$$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE get_child_parent_columns()
BEGIN
    SELECT COLUMN_NAME, TABLE_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN ('Child', 'Parent')
      AND COLUMN_NAME NOT IN ('Child_ID', 'Parent_ID', 'Child_Pin');
END$$

DELIMITER ;

