USE Preschool;

DELIMITER $$

DROP PROCEDURE IF EXISTS seed_class $$
CREATE PROCEDURE seed_class(IN class_value VARCHAR(32), IN total INT)
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE program_value VARCHAR(20);
  DECLARE safe_class VARCHAR(64);

  SET safe_class = REPLACE(class_value, ' ', '_');

  WHILE i <= total DO
    SET program_value = CASE MOD(i, 6)
      WHEN 0 THEN 'Full Time 2 days'
      WHEN 1 THEN 'Full Time 3 days'
      WHEN 2 THEN 'Full Time 5 days'
      WHEN 3 THEN 'Half Time 2 days'
      WHEN 4 THEN 'Half Time 3 days'
      ELSE 'Half Time 5 days'
    END;

    CALL add_child_with_parents_full(
      CONCAT(class_value, ' Child ', i),
      DATE_ADD('2020-01-01', INTERVAL (i * 7) DAY),
      IF(MOD(i, 2) = 0, 'male', 'female'),
      program_value,
      class_value,
      'Dr. Seeder',
      CONCAT('5550000', LPAD(i, 4, '0')),
      NULL,
      NULL,
      NULL,
      CONCAT('ParentOne ', class_value, ' ', i),
      CONCAT(i, ' Seeder St, Demo City, CA'),
      CONCAT('5551000', LPAD(i, 4, '0')),
      CONCAT('parent1_', safe_class, '_', i, '@example.com'),
      IF(MOD(i, 2) = 0, CONCAT('ParentTwo ', class_value, ' ', i), NULL),
      IF(MOD(i, 2) = 0, CONCAT(i, 'B Seeder St, Demo City, CA'), NULL),
      IF(MOD(i, 2) = 0, CONCAT('5552000', LPAD(i, 4, '0')), NULL),
      IF(MOD(i, 2) = 0, CONCAT('parent2_', safe_class, '_', i, '@example.com'), NULL)
    );

    SET i = i + 1;
  END WHILE;
END $$

CALL seed_class('Caterpillar', 20);
CALL seed_class('Chrysalis', 20);
CALL seed_class('Butterfly', 20);
CALL seed_class('Sunshine', 20);
CALL seed_class('Rainbow', 20);
-- CALL seed_class('Pre-Register', 20);
-- CALL seed_class('Registered', 20);
CALL seed_class('Waitlist', 10);

DROP PROCEDURE seed_class $$

DELIMITER ;
