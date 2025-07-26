CREATE TABLE `loan_applications` (
                                     `id` int NOT NULL,
                                     `amount` decimal(10,2) NOT NULL,
                                     `term` int NOT NULL,
                                     `purpose` varchar(255) NOT NULL,
                                     `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;