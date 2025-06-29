import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def analyze_csv(df: pd.DataFrame) -> dict:
    result = {}

    # === Basic Info ===
    result['columns'] = list(df.columns)
    result['shape'] = df.shape
    result['missing_values'] = df.isnull().sum().to_dict()
    result['dtypes'] = df.dtypes.astype(str).to_dict()
    result['duplicates'] = int(df.duplicated().sum())
    result['summary'] = df.describe(include='all').fillna("").to_dict()

    # === Anomaly Detection (z-score) ===
    numeric_df = df.select_dtypes(include=np.number)
    zscores = (numeric_df - numeric_df.mean()) / numeric_df.std(ddof=0)
    outliers = (zscores.abs() > 3).sum().to_dict()
    result['anomalies'] = outliers

    # === Trend Prediction ===
    trend_predictions = {}
    for col in numeric_df.columns:
        x = np.arange(len(df)).reshape(-1, 1)
        y = numeric_df[col].values.reshape(-1, 1)
        model = LinearRegression()
        try:
            model.fit(x, y)
            future = np.array([[len(df) + i] for i in range(1, 6)])
            pred = model.predict(future).flatten().tolist()
            trend_predictions[col] = pred
        except Exception:
            trend_predictions[col] = None
    result['trend_prediction'] = trend_predictions

    return result