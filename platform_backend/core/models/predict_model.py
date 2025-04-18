import pandas as pd
import joblib
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from core.config import settings


async def predict_attrition_probabilities(session: AsyncSession) -> int:
    # Загружаем модель и трансформер (предобработка)
    model, transformer = joblib.load(settings.prediction_model_config.model_path)

    # Получаем данные из вьюшки
    result = await session.execute(
        text(settings.prediction_model_config.prediction_query)
    )
    rows = result.fetchall()

    if not rows:
        return 0

    # Преобразуем в DataFrame
    df = pd.DataFrame(rows, columns=list(result.keys()))

    # Извлекаем нужные признаки
    feature_columns = (
        settings.prediction_model_config.cat_cols
        + settings.prediction_model_config.num_cols
    )
    X_raw = df[feature_columns]

    # Трансформация с обработкой ошибок
    try:
        X = transformer.transform(X_raw)
    except Exception as e:
        raise ValueError(f"Ошибка при трансформации данных: {e}")

    # Предсказание
    try:
        df["predicted_attrition_prob"] = model.predict(X)
    except Exception as e:
        raise ValueError(f"Ошибка при предсказании: {e}")

    updated = 0

    # Обновляем или вставляем предсказания в таблицу
    for _, row in df.iterrows():
        await session.execute(
            text(
                """
                INSERT INTO attrition_predictions (
                    employee_number,
                    predicted_attrition_prob,
                    predicted_at
                )
                VALUES (
                    :emp_num,
                    :prob,
                    now()
                )
                ON CONFLICT (employee_number)
                DO UPDATE SET
                    predicted_attrition_prob = EXCLUDED.predicted_attrition_prob,
                    predicted_at = EXCLUDED.predicted_at;
                """
            ),
            {
                "emp_num": int(row["employee_number"]),
                "prob": float(round(row["predicted_attrition_prob"], 4)),
            },
        )
        updated += 1

    await session.commit()
    return updated
