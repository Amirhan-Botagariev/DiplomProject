---------------------------------------------------------
-- Удаление таблиц (если существуют) в порядке зависимостей
---------------------------------------------------------
DROP TABLE IF EXISTS performance_reviews CASCADE;
DROP TABLE IF EXISTS salaries CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS business_travel CASCADE;
DROP TABLE IF EXISTS job_roles CASCADE;
DROP TABLE IF EXISTS education_fields CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS genders CASCADE;
DROP TABLE IF EXISTS marital_statuses CASCADE;

---------------------------------------------------------
-- Создание справочных таблиц
---------------------------------------------------------

-- Таблица для пола
CREATE TABLE genders (
                         gender_id SERIAL PRIMARY KEY,
                         gender_name VARCHAR(10) NOT NULL UNIQUE
);
-- Пример данных: 'Мужчина', 'Женщина'

-- Таблица для семейного положения
CREATE TABLE marital_statuses (
                                  marital_status_id SERIAL PRIMARY KEY,
                                  marital_status_name VARCHAR(15) NOT NULL UNIQUE
);
-- Пример данных: 'Холост', 'Женат', 'Разведен'

-- Таблица с департаментами
CREATE TABLE departments (
                             department_id SERIAL PRIMARY KEY,
                             department_name VARCHAR(50) NOT NULL UNIQUE
);

-- Таблица с образовательными направлениями
CREATE TABLE education_fields (
                                  education_field_id SERIAL PRIMARY KEY,
                                  education_field_name VARCHAR(50) NOT NULL UNIQUE
);

-- Таблица с должностями
CREATE TABLE job_roles (
                           job_role_id SERIAL PRIMARY KEY,
                           job_role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Таблица с видами командировок
CREATE TABLE business_travel (
                                 business_travel_id SERIAL PRIMARY KEY,
                                 travel_type VARCHAR(50) NOT NULL UNIQUE
);

---------------------------------------------------------
-- Основная таблица сотрудников
---------------------------------------------------------

CREATE TABLE employees (
                           employee_id SERIAL PRIMARY KEY,
                           age INT NOT NULL,
                           gender_id INT REFERENCES genders(gender_id) ON DELETE SET NULL,
                           marital_status_id INT REFERENCES marital_statuses(marital_status_id) ON DELETE SET NULL,
                           education_level INT CHECK (education_level BETWEEN 1 AND 5),
                           education_field_id INT REFERENCES education_fields(education_field_id) ON DELETE SET NULL,
                           department_id INT REFERENCES departments(department_id) ON DELETE SET NULL,
                           job_role_id INT REFERENCES job_roles(job_role_id) ON DELETE SET NULL,
                           job_level INT CHECK (job_level BETWEEN 1 AND 5),
                           attrition BOOLEAN NOT NULL DEFAULT FALSE,
                           business_travel_id INT REFERENCES business_travel(business_travel_id) ON DELETE SET NULL,
                           num_companies_worked INT CHECK (num_companies_worked >= 0),
                           total_working_years INT CHECK (total_working_years >= 0),
                           years_at_company INT CHECK (years_at_company >= 0),
                           years_in_current_role INT CHECK (years_in_current_role >= 0),
                           years_since_last_promotion INT CHECK (years_since_last_promotion >= 0),
                           years_with_curr_manager INT CHECK (years_with_curr_manager >= 0),
                           work_life_balance INT CHECK (work_life_balance BETWEEN 1 AND 4),
                           training_times_last_year INT CHECK (training_times_last_year >= 0),
                           created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------------------------
-- Таблица с зарплатами
---------------------------------------------------------

CREATE TABLE salaries (
                          salary_id SERIAL PRIMARY KEY,
                          employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE,
                          monthly_income DECIMAL(10,2) CHECK (monthly_income >= 0),
                          hourly_rate DECIMAL(10,2) CHECK (hourly_rate >= 0),
                          percent_salary_hike INT CHECK (percent_salary_hike >= 0),
                          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------------------------
-- Таблица с отзывами о производительности сотрудников
---------------------------------------------------------

CREATE TABLE performance_reviews (
                                     review_id SERIAL PRIMARY KEY,
                                     employee_id INT REFERENCES employees(employee_id) ON DELETE CASCADE,
                                     review_date DATE DEFAULT CURRENT_DATE,
                                     performance_rating INT CHECK (performance_rating BETWEEN 1 AND 5),
                                     job_involvement INT CHECK (job_involvement BETWEEN 1 AND 4),
                                     job_satisfaction INT CHECK (job_satisfaction BETWEEN 1 AND 4),
                                     relationship_satisfaction INT CHECK (relationship_satisfaction BETWEEN 1 AND 4),
                                     environment_satisfaction INT CHECK (environment_satisfaction BETWEEN 1 AND 4),
                                     created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

---------------------------------------------------------
-- Создание индексов для ускорения выборок
---------------------------------------------------------

-- Для таблицы employees
CREATE INDEX idx_employees_gender_id ON employees(gender_id);
CREATE INDEX idx_employees_marital_status_id ON employees(marital_status_id);
CREATE INDEX idx_employees_education_field_id ON employees(education_field_id);
CREATE INDEX idx_employees_department_id ON employees(department_id);
CREATE INDEX idx_employees_job_role_id ON employees(job_role_id);
CREATE INDEX idx_employees_business_travel_id ON employees(business_travel_id);
CREATE INDEX idx_employees_age ON employees(age);
CREATE INDEX idx_employees_attrition ON employees(attrition);

-- Для таблицы salaries
CREATE INDEX idx_salaries_employee_id ON salaries(employee_id);

-- Для таблицы performance_reviews
CREATE INDEX idx_perf_reviews_employee_id ON performance_reviews(employee_id);
CREATE INDEX idx_perf_reviews_review_date ON performance_reviews(review_date);

---------------------------------------------------------
-- ETL часть: загрузка данных из CSV в staging-таблицу и распределение по нормализованным таблицам
---------------------------------------------------------

-- 1. Создание staging-таблицы для загрузки данных из большого CSV
DROP TABLE IF EXISTS staging_big_table;
CREATE TABLE staging_big_table (
                                   Age INT,
                                   Attrition BOOLEAN,
                                   BusinessTravel VARCHAR(50),
                                   Department VARCHAR(50),
                                   Education INT,
                                   EducationField VARCHAR(50),
                                   EmployeeNumber INT,
                                   EnvironmentSatisfaction INT,
                                   Gender VARCHAR(10),
                                   HourlyRate DECIMAL(10,2),
                                   JobInvolvement INT,
                                   JobLevel INT,
                                   JobRole VARCHAR(50),
                                   JobSatisfaction INT,
                                   MaritalStatus VARCHAR(15),
                                   MonthlyIncome DECIMAL(10,2),
                                   NumCompaniesWorked INT,
                                   OverTime VARCHAR(10),
                                   PercentSalaryHike INT,
                                   PerformanceRating INT,
                                   RelationshipSatisfaction INT,
                                   TotalWorkingYears INT,
                                   TrainingTimesLastYear INT,
                                   WorkLifeBalance INT,
                                   YearsAtCompany INT,
                                   YearsInCurrentRole INT,
                                   YearsSinceLastPromotion INT,
                                   YearsWithCurrManager INT
);

-- 2. Загрузка данных из CSV в staging-таблицу.
-- Замените '/path/to/big_table.csv' на корректный путь внутри контейнера.
COPY staging_big_table
    FROM '/var/lib/postgresql/dump.csv'
    DELIMITER ','
    CSV HEADER;

-- 3. Заполнение справочных таблиц (INSERT DISTINCT)

-- Пол (genders)
INSERT INTO genders (gender_name)
SELECT DISTINCT Gender
FROM staging_big_table
WHERE Gender IS NOT NULL;

-- Семейное положение (marital_statuses)
INSERT INTO marital_statuses (marital_status_name)
SELECT DISTINCT MaritalStatus
FROM staging_big_table
WHERE MaritalStatus IS NOT NULL;

-- Департаменты (departments)
INSERT INTO departments (department_name)
SELECT DISTINCT Department
FROM staging_big_table
WHERE Department IS NOT NULL;

-- Образовательные направления (education_fields)
INSERT INTO education_fields (education_field_name)
SELECT DISTINCT EducationField
FROM staging_big_table
WHERE EducationField IS NOT NULL;

-- Должности (job_roles)
INSERT INTO job_roles (job_role_name)
SELECT DISTINCT JobRole
FROM staging_big_table
WHERE JobRole IS NOT NULL;

-- Виды командировок (business_travel)
INSERT INTO business_travel (travel_type)
SELECT DISTINCT BusinessTravel
FROM staging_big_table
WHERE BusinessTravel IS NOT NULL;

-- 4. Заполнение основной таблицы сотрудников с подстановкой внешних ключей через JOIN

INSERT INTO employees (
    age,
    gender_id,
    marital_status_id,
    education_level,
    education_field_id,
    department_id,
    job_role_id,
    job_level,
    attrition,
    business_travel_id,
    num_companies_worked,
    total_working_years,
    years_at_company,
    years_in_current_role,
    years_since_last_promotion,
    years_with_curr_manager,
    work_life_balance,
    training_times_last_year
)
SELECT
    s.Age,
    g.gender_id,
    m.marital_status_id,
    s.Education,
    ef.education_field_id,
    d.department_id,
    jr.job_role_id,
    s.JobLevel,
    s.Attrition,
    bt.business_travel_id,
    s.NumCompaniesWorked,
    s.TotalWorkingYears,
    s.YearsAtCompany,
    s.YearsInCurrentRole,
    s.YearsSinceLastPromotion,
    s.YearsWithCurrManager,
    s.WorkLifeBalance,
    s.TrainingTimesLastYear
FROM staging_big_table s
         LEFT JOIN genders g ON s.Gender = g.gender_name
         LEFT JOIN marital_statuses m ON s.MaritalStatus = m.marital_status_name
         LEFT JOIN departments d ON s.Department = d.department_name
         LEFT JOIN education_fields ef ON s.EducationField = ef.education_field_name
         LEFT JOIN job_roles jr ON s.JobRole = jr.job_role_name
         LEFT JOIN business_travel bt ON s.BusinessTravel = bt.travel_type;

-- 5. (Опционально) Заполнение таблиц зарплат и отзывов.
INSERT INTO salaries (employee_id, monthly_income, hourly_rate, percent_salary_hike, created_at, updated_at)
SELECT e.employee_id, s.MonthlyIncome, s.HourlyRate, s.PercentSalaryHike, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM staging_big_table s
JOIN employees e ON s.EmployeeNumber = e.employee_number;

INSERT INTO performance_reviews (employee_id, review_date, performance_rating, job_involvement, job_satisfaction, relationship_satisfaction, environment_satisfaction, created_at, updated_at)
SELECT e.employee_id, CURRENT_DATE, s.PerformanceRating, s.JobInvolvement, s.JobSatisfaction, s.RelationshipSatisfaction, s.EnvironmentSatisfaction, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM staging_big_table s
JOIN employees e ON s.EmployeeNumber = e.employee_number;

-- 6. Удаление staging-таблицы (по желанию)
DROP TABLE staging_big_table;