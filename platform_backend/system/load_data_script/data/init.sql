CREATE OR REPLACE VIEW v_employees_for_attrition AS
SELECT
    e.employee_number,
    g.gender_name AS "Gender",
    m.marital_status_name AS "MaritalStatus",
    ef.education_field_name AS "EducationField",
    d.department_name AS "Department",
    jr.job_role_name AS "JobRole",
    bt.travel_type AS "BusinessTravel",
    e.age AS "Age",
    e.education_level AS "Education",
    e.job_level AS "JobLevel",
    e.num_companies_worked AS "NumCompaniesWorked",
    e.total_working_years AS "TotalWorkingYears",
    e.years_at_company AS "YearsAtCompany",
    e.years_in_current_role AS "YearsInCurrentRole",
    e.years_since_last_promotion AS "YearsSinceLastPromotion",
    e.years_with_curr_manager AS "YearsWithCurrManager",
    e.work_life_balance AS "WorkLifeBalance",
    e.training_times_last_year AS "TrainingTimesLastYear",
    s.monthly_income AS "MonthlyIncome",
    s.hourly_rate AS "HourlyRate",
    s.percent_salary_hike AS "PercentSalaryHike",
    pr.performance_rating AS "PerformanceRating",
    pr.job_involvement AS "JobInvolvement",
    pr.job_satisfaction AS "JobSatisfaction",
    pr.relationship_satisfaction AS "RelationshipSatisfaction",
    pr.environment_satisfaction AS "EnvironmentSatisfaction"
FROM employees e
LEFT JOIN genders g ON e.gender_id = g.gender_id
LEFT JOIN marital_statuses m ON e.marital_status_id = m.marital_status_id
LEFT JOIN education_fields ef ON e.education_field_id = ef.education_field_id
LEFT JOIN departments d ON e.department_id = d.department_id
LEFT JOIN job_roles jr ON e.job_role_id = jr.job_role_id
LEFT JOIN business_travel bt ON e.business_travel_id = bt.business_travel_id
LEFT JOIN salaries s ON e.employee_id = s.employee_id
LEFT JOIN performance_reviews pr ON e.employee_id = pr.employee_id;

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
    FROM '/docker-entrypoint-initdb.d/dump.csv'
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
    employee_number,
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
    s.EmployeeNumber,
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