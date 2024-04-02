--  Create user table
CREATE TABLE `testowa-db`.`user` (
  `id` INT(10) UNSIGNED UNIQUE NOT NULL AUTO_INCREMENT,
  `uuid` CHAR(36) UNIQUE NOT NULL,
  `user_name` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(200) UNIQUE NOT NULL,
  `updated_at` INT(10) UNSIGNED NOT NULL,
  `created_at` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
);

--  Insert testing data to the user table
  INSERT INTO `user` (`uuid`, `user_name`, `email`, `updated_at`, `created_at`) VALUES
('e3b0c442-98fc-1c14-9afb-4c76934fb1d0', 'user1', 'user1@example.com', UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
('a3b5b2a1-93e2-2c3e-3f4a-5a6f7d8e8f9f', 'user2', 'user2@example.com', UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
('b2c1d3e4-f5g6-h7i8-j9k0-lmn1opq2r3s4', 'user3', 'user3@example.com', UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
('c3d4e5f6-g7h8-i9j0-k1l2-m3n4o5p6q7r8', 'user4', 'user4@example.com', UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
('d4e5f6g7-h8i9-j0k1-l2m3-n4o5p6q7r8s9', 'user5', 'user5@example.com', UNIX_TIMESTAMP(), UNIX_TIMESTAMP());

--  Create procedure to get all users
## PROCEDURA GetAllUsers
DROP PROCEDURE IF EXISTS `testowa-db`.GetAllUsers;

DELIMITER $$
$$
CREATE PROCEDURE `testowa-db`.GetAllUsers()
BEGIN
	SELECT * FROM `user`;
END$$
DELIMITER ;

--  Call the procedure to get all users
CALL GetAllUsers();

--  Create procedure to get user by its id
## PROCEDURA GetUserById
DROP PROCEDURE IF EXISTS `testowa-db`.GetUserById;

DELIMITER $$
$$

CREATE PROCEDURE `testowa-db`.GetUserById(IN userId INT)
BEGIN
	SELECT * FROM user WHERE id = userId;
END$$

DELIMITER ;

--  Call the procedure to get user by its id
CALL GetUserById(3);

--  Create procedure to craete sample user
## PROCEDURA CreateUser
CREATE PROCEDURE `testowa-db`.`CreateUser`(IN userName VARCHAR(100), IN userEmail VARCHAR(200))
BEGIN
	INSERT INTO user (uuid, user_name, email, updated_at, created_at)
    VALUES (UUID(), userName, userEmail,  UNIX_TIMESTAMP(), UNIX_TIMESTAMP());
END

CALL CreateUser('user_name', "user_name@com.pl");